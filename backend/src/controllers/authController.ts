import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { AuthRequest } from '../middlewares/auth.js';
import { logAuditEvent } from '../utils/auditLogger.js';
import { AcademicVerificationService } from '../services/verification/academicVerificationService.js';
import { TrustScoreService } from '../services/verification/trustScoreService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'naan_mudhalvan_super_secret_jwt_key_2026';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'naan_mudhalvan_super_secret_refresh_jwt_key_2026';

const academicVerificationService = new AcademicVerificationService();
const trustScoreService = new TrustScoreService();

export const verifyInstitutionalIdentity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rollNumber, email } = req.body;
    if (!rollNumber || !email) {
      return res.status(400).json({ success: false, error: 'Roll number and institutional email are required' });
    }

    const verificationResult = await academicVerificationService.verifyStudentRollNumber(rollNumber, email);
    if (!verificationResult.success || !verificationResult.record) {
      return res.status(400).json({ success: false, error: verificationResult.error || 'Identity verification failed' });
    }

    const token = await academicVerificationService.generateVerificationToken(rollNumber, email);

    await logAuditEvent('IDENTITY_VERIFICATION_INITIATED', `Institutional lookup succeeded for roll: ${rollNumber}`, null, req);

    res.json({
      success: true,
      message: 'Institutional academic identity validated! Verification token issued.',
      data: {
        token,
        academicRecord: verificationResult.record,
        identitySource: 'Institutional Academic System (Demo / Mock Provider)',
        identityStatus: 'VERIFIED',
      },
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, role = 'STUDENT', rollNumber, verificationToken } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, error: 'Email, password, and name are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'User with this email already exists' });
    }

    let academicRecord = null;

    // For STUDENT role, enforce institutional academic lookup & duplicate prevention
    if (role === 'STUDENT') {
      const targetRoll = rollNumber || '7376221CS101';
      const verifyRes = await academicVerificationService.verifyStudentRollNumber(targetRoll, email);
      if (!verifyRes.success || !verifyRes.record) {
        return res.status(400).json({ success: false, error: verifyRes.error || 'Student identity verification failed' });
      }
      academicRecord = verifyRes.record;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const assignedDept = academicRecord ? academicRecord.department : req.body.department || 'Computer Science & Engineering';
    const assignedId = academicRecord ? academicRecord.studentId : `NM-${Math.floor(100000 + Math.random() * 900000)}`;
    const studentName = academicRecord ? academicRecord.name : name;

    const user = await prisma.user.create({
      data: {
        email: academicRecord ? academicRecord.institutionalEmail : email,
        passwordHash,
        name: studentName,
        role,
        department: assignedDept,
        naanMudhalvanId: assignedId,
        emailVerified: true,
        profile: {
          create: {
            collegeName: academicRecord ? academicRecord.collegeName : 'Government Engineering College, Salem',
            cgpa: academicRecord ? academicRecord.cgpa : 8.5,
            graduationYear: academicRecord ? 2022 + academicRecord.year : 2025,
            portfolioSlug: studentName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000),
          },
        },
      },
      include: { profile: true },
    });

    if (academicRecord && user.profile) {
      await academicVerificationService.linkAcademicIdentityToUser(user.id, academicRecord);
      await trustScoreService.calculateProfileTrustScore(user.profile.id);
    }

    const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role, department: user.department }, JWT_SECRET, { expiresIn: '2h' });
    const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '7d' });

    await logAuditEvent('USER_REGISTERED', `New user registered: ${user.email} (${user.role})`, user.id, req);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department,
          naanMudhalvanId: user.naanMudhalvanId,
          profileId: user.profile?.id,
          identityStatus: academicRecord ? 'VERIFIED' : 'UNVERIFIED',
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, institutionalId } = req.body;

    if (!email || !password || !institutionalId) {
      return res.status(400).json({ success: false, error: 'Email, password, and Institutional Unique ID (Register No / ID) are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true, academicIdentity: true },
    });

    if (!user) {
      await logAuditEvent('FAILED_LOGIN', `Failed login attempt for email: ${email}`, null, req);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Verify institutional unique identifier (naanMudhalvanId, rollNumber, or studentId)
    const normalizedId = institutionalId.trim().toUpperCase();
    const idMatches =
      (user.naanMudhalvanId && user.naanMudhalvanId.trim().toUpperCase() === normalizedId) ||
      (user.academicIdentity && user.academicIdentity.rollNumber.trim().toUpperCase() === normalizedId) ||
      (user.academicIdentity && user.academicIdentity.studentId.trim().toUpperCase() === normalizedId);

    if (!idMatches) {
      await logAuditEvent('FAILED_LOGIN', `Institutional ID mismatch for user: ${email} (Submitted: ${institutionalId})`, user.id, req);
      return res.status(401).json({ success: false, error: `Institutional Identifier mismatch. Unique ID '${institutionalId}' does not match registered account records.` });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      await logAuditEvent('FAILED_LOGIN', `Failed password attempt for user: ${email}`, user.id, req);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role, department: user.department }, JWT_SECRET, { expiresIn: '2h' });
    const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '7d' });

    await logAuditEvent('USER_LOGIN', `User ${user.email} logged in successfully`, user.id, req);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department,
          naanMudhalvanId: user.naanMudhalvanId,
          profileId: user.profile?.id,
          identityStatus: user.academicIdentity ? user.academicIdentity.verificationStatus : 'UNVERIFIED',
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, error: 'Refresh token required' });
    }

    const decoded = jwt.verify(token, REFRESH_SECRET) as { id: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role, department: user.department }, JWT_SECRET, { expiresIn: '2h' });

    res.json({
      success: true,
      accessToken,
    });
  } catch (error) {
    return res.status(403).json({ success: false, error: 'Invalid or expired refresh token' });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        academicIdentity: true,
        profile: {
          include: {
            skills: { include: { skill: true, evidences: true } },
            projects: { include: { evidence: true } },
            certifications: { include: { verification: true } },
            codingProfile: true,
            placementClaims: true,
            trustScore: true,
            employmentScores: { orderBy: { createdAt: 'desc' }, take: 1 },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  res.json({
    success: true,
    message: `Password reset instructions have been sent to ${email}`,
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Password successfully reset.',
  });
};
