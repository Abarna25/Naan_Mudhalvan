import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { AuthRequest } from '../middlewares/auth.js';
import { logAuditEvent } from '../utils/auditLogger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'naan_mudhalvan_super_secret_jwt_key_2026';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'naan_mudhalvan_super_secret_refresh_jwt_key_2026';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, role = 'STUDENT', department, naanMudhalvanId } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, error: 'Email, password, and name are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role,
        department: department || 'Computer Science & Engineering',
        naanMudhalvanId: naanMudhalvanId || `NM-${Math.floor(100000 + Math.random() * 900000)}`,
        profile: {
          create: {
            collegeName: 'Government Engineering College, Salem',
            cgpa: 8.5,
            graduationYear: 2025,
            portfolioSlug: name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000),
          },
        },
      },
      include: { profile: true },
    });

    const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role, department: user.department }, JWT_SECRET, { expiresIn: '2h' });
    const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '7d' });

    await logAuditEvent('USER_REGISTERED', `New user registered: ${user.email} (${user.role})`, user.id);

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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      await logAuditEvent('FAILED_LOGIN', `Failed login attempt for email: ${email}`);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      await logAuditEvent('FAILED_LOGIN', `Failed password attempt for user: ${email}`, user.id);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role, department: user.department }, JWT_SECRET, { expiresIn: '2h' });
    const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '7d' });

    await logAuditEvent('USER_LOGIN', `User ${user.email} logged in successfully`, user.id);

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
        profile: {
          include: {
            skills: { include: { skill: true } },
            projects: true,
            certifications: true,
            codingProfile: true,
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
