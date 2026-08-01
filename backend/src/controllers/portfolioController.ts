import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthRequest } from '../middlewares/auth.js';
import { logAuditEvent } from '../utils/auditLogger.js';

export const getPublicPortfolio = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;

    const profile = await prisma.profile.findFirst({
      where: { portfolioSlug: slug, isPublic: true },
      include: {
        user: { select: { name: true, email: true, department: true, avatarUrl: true } },
        skills: { include: { skill: true } },
        projects: { where: { status: 'APPROVED' } },
        certifications: { where: { status: 'APPROVED' } },
        achievements: true,
        internships: true,
        codingProfile: true,
      },
    });

    if (!profile) {
      return res.status(404).json({ success: false, error: 'Public portfolio not found or private' });
    }

    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

export const updatePortfolioConfig = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { theme = 'modern', isPublic = true, customSlug } = req.body;

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) return res.status(404).json({ success: false, error: 'Profile not found' });

    const updatedProfile = await prisma.profile.update({
      where: { id: profile.id },
      data: {
        isPublic,
        portfolioSlug: customSlug || profile.portfolioSlug,
      },
    });

    const portfolioVersion = await prisma.portfolioVersion.create({
      data: {
        profileId: profile.id,
        theme,
        slug: updatedProfile.portfolioSlug || 'default-slug',
      },
    });

    await logAuditEvent('PORTFOLIO_COMPILED', `Portfolio compiled with theme "${theme}" and slug "/portfolio/${updatedProfile.portfolioSlug}"`, userId);

    res.json({ success: true, data: { profile: updatedProfile, portfolioVersion } });
  } catch (error) {
    next(error);
  }
};

