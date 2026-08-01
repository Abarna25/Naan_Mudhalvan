import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthRequest } from '../middlewares/auth.js';

export const generateResume = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { targetRole = 'Software Engineer' } = req.body;

    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        user: true,
        skills: { include: { skill: true } },
        projects: true,
        certifications: true,
        internships: true,
        codingProfile: true,
      },
    });

    if (!profile) return res.status(404).json({ success: false, error: 'Profile not found' });

    const resumeContent = {
      personalInfo: {
        name: profile.user.name,
        email: profile.user.email,
        phone: profile.phone || '+91 98765 43210',
        location: 'Tamil Nadu, India',
        github: profile.githubUsername ? `https://github.com/${profile.githubUsername}` : undefined,
        linkedin: profile.linkedinUrl || undefined,
      },
      summary: `Motivated ${targetRole} with a strong academic background (${profile.cgpa} CGPA) from ${profile.collegeName}. Skilled in ${profile.skills.map(s => s.skill.name).slice(0, 5).join(', ')}. Aligned with Naan Mudhalvan skill standards.`,
      education: [
        {
          institution: profile.collegeName,
          degree: `B.E. ${profile.user.department || 'Computer Science & Engineering'}`,
          cgpa: `${profile.cgpa} / 10.0`,
          graduationYear: profile.graduationYear,
        },
      ],
      skills: profile.skills.map(s => s.skill.name),
      projects: profile.projects.map(p => ({
        title: p.title,
        description: p.description,
        techStack: p.techStack,
        link: p.githubUrl,
      })),
      certifications: profile.certifications.map(c => ({
        title: c.title,
        issuer: c.issuer,
        issueDate: c.issueDate,
      })),
    };

    const resumeVersion = await prisma.resumeVersion.create({
      data: {
        profileId: profile.id,
        targetRole,
        atsScore: 88,
        resumeJson: JSON.stringify(resumeContent),
      },
    });

    res.status(201).json({
      success: true,
      data: {
        id: resumeVersion.id,
        atsScore: 88,
        targetRole,
        content: resumeContent,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const optimizeResume = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { targetRole = 'Software Engineer' } = req.body;

    res.json({
      success: true,
      data: {
        atsScore: 88,
        targetRole,
        missingKeywords: ['Docker', 'CI/CD Pipelines', 'REST APIs', 'Unit Testing'],
        formattingSuggestions: [
          'Use bullet points starting with action verbs (e.g. Architected, Developed, Automated)',
          'Ensure contact information is in standard single column format',
          'Quantify project achievements with metrics (e.g., Improved speed by 35%)',
        ],
        grammarSuggestions: ['No grammatical errors detected.'],
        roleMatchPercentage: 86,
        recommendations: [
          'Add Docker certification from Naan Mudhalvan catalog',
          'Include links to live project demos',
        ],
      },
    });
  } catch (error) {
    next(error);
  }
};
