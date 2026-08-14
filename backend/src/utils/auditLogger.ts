import { Request } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthRequest } from '../middlewares/auth.js';

export function getClientIp(req?: Request | AuthRequest): string {
  if (!req) return '127.0.0.1';
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim().length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || '127.0.0.1';
}

export async function logAuditEvent(
  action: string,
  details: string,
  userId?: string | null,
  req?: Request | AuthRequest,
  metadata?: Record<string, any>
) {
  try {
    const ipAddress = getClientIp(req);
    const detailsStr = metadata ? `${details} | Metadata: ${JSON.stringify(metadata)}` : details;

    await prisma.auditLog.create({
      data: {
        action,
        details: detailsStr,
        userId: userId || null,
        ipAddress,
      },
    });
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}

