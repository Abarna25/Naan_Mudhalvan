import { prisma } from '../../config/prisma.js';
import { getAcademicProvider, AcademicRecord } from '../integrations/academic/academicProvider.js';
import crypto from 'crypto';

export class AcademicVerificationService {
  private academicProvider = getAcademicProvider();

  public async verifyStudentRollNumber(rollNumber: string, email: string): Promise<{ success: boolean; record?: AcademicRecord; error?: string }> {
    const isCollegeEmail = await this.academicProvider.verifyCollegeEmail(email);
    if (!isCollegeEmail) {
      return { success: false, error: 'Must use a valid institutional college email address' };
    }

    const academicRecord = await this.academicProvider.findStudentByRollNumber(rollNumber);
    if (!academicRecord) {
      return { success: false, error: 'Roll number not found in institutional academic database' };
    }

    // Check if rollNumber or studentId or institutionalEmail is already registered in User or AcademicIdentity
    const existingUserByEmail = await prisma.user.findUnique({ where: { email } });
    if (existingUserByEmail) {
      return { success: false, error: 'This institutional email is already registered. Please log in or recover your account.' };
    }

    const existingIdentityByRoll = await prisma.academicIdentity.findFirst({
      where: {
        OR: [
          { rollNumber: academicRecord.rollNumber },
          { studentId: academicRecord.studentId },
          { institutionalEmail: academicRecord.institutionalEmail },
        ],
      },
    });

    if (existingIdentityByRoll) {
      return { success: false, error: 'This student identity (Roll Number / Student ID) is already registered. Duplicate registration prohibited.' };
    }

    return { success: true, record: academicRecord };
  }

  public async generateVerificationToken(rollNumber: string, email: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.verificationToken.create({
      data: {
        email,
        rollNumber,
        token,
        expiresAt,
      },
    });

    return token;
  }

  public async verifyToken(token: string): Promise<{ success: boolean; email?: string; rollNumber?: string; error?: string }> {
    const record = await prisma.verificationToken.findUnique({ where: { token } });
    if (!record) {
      return { success: false, error: 'Invalid verification token' };
    }

    if (record.used) {
      return { success: false, error: 'Token has already been used' };
    }

    if (record.expiresAt < new Date()) {
      return { success: false, error: 'Verification token has expired' };
    }

    if (record.attempts >= 5) {
      return { success: false, error: 'Verification attempt limit exceeded' };
    }

    await prisma.verificationToken.update({
      where: { id: record.id },
      data: { used: true, attempts: { increment: 1 } },
    });

    return { success: true, email: record.email, rollNumber: record.rollNumber };
  }

  public async linkAcademicIdentityToUser(userId: string, academicRecord: AcademicRecord) {
    const identity = await prisma.academicIdentity.create({
      data: {
        userId,
        studentId: academicRecord.studentId,
        rollNumber: academicRecord.rollNumber,
        institutionalEmail: academicRecord.institutionalEmail,
        name: academicRecord.name,
        collegeName: academicRecord.collegeName,
        department: academicRecord.department,
        program: academicRecord.program,
        year: academicRecord.year,
        semester: academicRecord.semester,
        batch: academicRecord.batch,
        section: academicRecord.section,
        academicStatus: academicRecord.academicStatus,
        cgpa: academicRecord.cgpa,
        verificationStatus: 'VERIFIED',
      },
    });

    // Update user and profile with authoritative data
    await prisma.user.update({
      where: { id: userId },
      data: {
        department: academicRecord.department,
        naanMudhalvanId: academicRecord.studentId,
        emailVerified: true,
      },
    });

    await prisma.profile.update({
      where: { userId },
      data: {
        collegeName: academicRecord.collegeName,
        cgpa: academicRecord.cgpa,
      },
    });

    return identity;
  }
}
