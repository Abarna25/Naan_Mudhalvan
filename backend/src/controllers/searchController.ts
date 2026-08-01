import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';

export const globalSearch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = (req.query.q as string || '').trim();
    if (!q) {
      return res.json({
        success: true,
        data: { students: [], projects: [], skills: [], certifications: [] },
      });
    }

    const students = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        OR: [
          { name: { contains: q } },
          { email: { contains: q } },
          { naanMudhalvanId: { contains: q } },
          { department: { contains: q } },
        ],
      },
      take: 10,
    });

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
          { techStack: { contains: q } },
        ],
      },
      take: 10,
    });

    const skills = await prisma.skill.findMany({
      where: {
        name: { contains: q },
      },
      take: 10,
    });

    const certifications = await prisma.certification.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { issuer: { contains: q } },
        ],
      },
      take: 10,
    });

    res.json({
      success: true,
      data: {
        students,
        projects,
        skills,
        certifications,
      },
    });
  } catch (error) {
    next(error);
  }
};
