import { prisma } from '../../config/prisma.js';

export interface SkillConfidenceBreakdown {
  skillName: string;
  confidenceScore: number;
  status: 'SELF_DECLARED' | 'PARTIALLY_VERIFIED' | 'VERIFIED' | 'HIGH_CONFIDENCE';
  confidenceLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
  evidences: Array<{
    type: string;
    description: string;
    weight: number;
    delta: number;
  }>;
}

export class SkillVerificationService {
  public async recalculateSkillConfidence(studentSkillId: string): Promise<SkillConfidenceBreakdown> {
    const studentSkill = await prisma.studentSkill.findUnique({
      where: { id: studentSkillId },
      include: {
        skill: true,
        profile: {
          include: {
            projects: { include: { evidence: true } },
            certifications: { include: { verification: true } },
          },
        },
        evidences: true,
      },
    });

    if (!studentSkill) {
      throw new Error('StudentSkill not found');
    }

    const skillNameLower = studentSkill.skill.name.toLowerCase();
    const evidences: Array<{ type: string; description: string; weight: number; delta: number }> = [];

    let totalScore = 15; // Base score for self declaration
    evidences.push({
      type: 'SELF_DECLARED',
      description: `Self-declared claim of ${studentSkill.proficiency}% proficiency`,
      weight: 0.5,
      delta: 15,
    });

    // Check Assessment evidence
    if (studentSkill.assessmentScore && studentSkill.assessmentScore >= 60) {
      const delta = Math.round(studentSkill.assessmentScore * 0.35); // up to 35 pts
      totalScore += delta;
      evidences.push({
        type: 'ASSESSMENT',
        description: `Verified Coding MCQ Assessment Score: ${studentSkill.assessmentScore}%`,
        weight: 2.5,
        delta,
      });
    }

    // Check Verified Project evidence
    const matchingProjects = studentSkill.profile.projects.filter(p =>
      p.techStack.toLowerCase().includes(skillNameLower) || p.title.toLowerCase().includes(skillNameLower)
    );

    for (const proj of matchingProjects) {
      if (proj.status === 'APPROVED') {
        const scoreBonus = proj.evidence?.evidenceScore ? Math.round(proj.evidence.evidenceScore * 0.25) : 15;
        totalScore += scoreBonus;
        evidences.push({
          type: 'GITHUB_PROJECT',
          description: `Verified Project "${proj.title}" (Evidence Score: ${proj.evidence?.evidenceScore || 85})`,
          weight: 1.8,
          delta: scoreBonus,
        });
      }
    }

    // Check Verified Certification evidence
    const matchingCerts = studentSkill.profile.certifications.filter(c =>
      c.title.toLowerCase().includes(skillNameLower) || c.issuer.toLowerCase().includes(skillNameLower)
    );

    for (const cert of matchingCerts) {
      if (cert.status === 'APPROVED' || cert.status === 'VERIFIED') {
        totalScore += 20;
        evidences.push({
          type: 'VERIFIED_CERTIFICATE',
          description: `Verified Certification "${cert.title}" from ${cert.issuer}`,
          weight: 2.0,
          delta: 20,
        });
      }
    }

    // Cap totalScore between 0 and 100
    const finalConfidenceScore = Math.min(100, Math.max(0, totalScore));

    let status: SkillConfidenceBreakdown['status'] = 'SELF_DECLARED';
    let confidenceLevel: SkillConfidenceBreakdown['confidenceLevel'] = 'LOW';

    if (finalConfidenceScore >= 80) {
      status = 'HIGH_CONFIDENCE';
      confidenceLevel = 'VERY_HIGH';
    } else if (finalConfidenceScore >= 60) {
      status = 'VERIFIED';
      confidenceLevel = 'HIGH';
    } else if (finalConfidenceScore >= 30) {
      status = 'PARTIALLY_VERIFIED';
      confidenceLevel = 'MODERATE';
    }

    await prisma.studentSkill.update({
      where: { id: studentSkillId },
      data: {
        confidenceScore: finalConfidenceScore,
        status,
      },
    });

    return {
      skillName: studentSkill.skill.name,
      confidenceScore: finalConfidenceScore,
      status,
      confidenceLevel,
      evidences,
    };
  }

  public async evaluateAssessmentSubmission(attemptId: string, userAnswers: number[]): Promise<{ score: number; passed: boolean }> {
    const attempt = await prisma.skillAssessmentAttempt.findUnique({
      where: { id: attemptId },
      include: {
        assessment: {
          include: { questions: true },
        },
      },
    });

    if (!attempt) {
      throw new Error('Assessment attempt not found');
    }

    const questions = attempt.assessment.questions;
    if (questions.length === 0) {
      throw new Error('Assessment contains no questions');
    }

    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] !== undefined && userAnswers[idx] === q.correctAnswerIndex) {
        correctCount += 1;
      }
    });

    const scorePct = Math.round((correctCount / questions.length) * 100);
    const passed = scorePct >= attempt.assessment.passingScore;

    await prisma.skillAssessmentAttempt.update({
      where: { id: attemptId },
      data: {
        score: scorePct,
        passed,
        status: 'SUBMITTED',
        submittedAt: new Date(),
        userAnswersJson: JSON.stringify(userAnswers),
      },
    });

    // Find student's skill record and update assessment score
    const studentUser = await prisma.user.findUnique({
      where: { id: attempt.studentId },
      include: { profile: { include: { skills: { include: { skill: true } } } } },
    });

    if (studentUser && studentUser.profile) {
      const skillName = attempt.assessment.skillName;
      const studentSkill = studentUser.profile.skills.find(s =>
        s.skill.name.toLowerCase() === skillName.toLowerCase()
      );

      if (studentSkill) {
        await prisma.studentSkill.update({
          where: { id: studentSkill.id },
          data: { assessmentScore: scorePct },
        });

        // Recalculate skill confidence
        await this.recalculateSkillConfidence(studentSkill.id);
      }
    }

    return { score: scorePct, passed };
  }
}
