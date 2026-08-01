import { prisma } from '../config/prisma.js';

export async function logAuditEvent(action: string, details: string, userId?: string, ipAddress: string = '127.0.0.1') {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        details,
        userId: userId || null,
        ipAddress,
      },
    });
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}
