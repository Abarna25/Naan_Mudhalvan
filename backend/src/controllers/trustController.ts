import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthRequest } from '../middlewares/auth.js';
import { TrustScoreService } from '../services/verification/trustScoreService.js';
import { SkillVerificationService } from '../services/verification/skillVerificationService.js';
import { FraudRiskService } from '../services/verification/fraudRiskService.js';

const trustScoreService = new TrustScoreService();
const skillVerificationService = new SkillVerificationService();
const fraudRiskService = new FraudRiskService();

export const getStudentTrustScore = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const profile = await prisma.profile.findUnique({ where: { userId } });

    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    const breakdown = await trustScoreService.calculateProfileTrustScore(profile.id);
    const risk = await fraudRiskService.evaluateStudentFraudRisk(profile.id);

    res.json({
      success: true,
      data: {
        dataConfidenceScore: breakdown.overallScore,
        riskLevel: breakdown.riskLevel,
        scores: breakdown.scores,
        explanation: breakdown.explanation,
        fraudRisk: risk,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTrustCenterData = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        academicIdentity: true,
        profile: {
          include: {
            skills: { include: { skill: true, evidences: true } },
            projects: { include: { evidence: true } },
            certifications: { include: { verification: true } },
            placementClaims: true,
            trustScore: true,
          },
        },
      },
    });

    if (!user || !user.profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    const breakdown = await trustScoreService.calculateProfileTrustScore(user.profile.id);
    const fraudRisk = await fraudRiskService.evaluateStudentFraudRisk(user.profile.id);

    const certVerifiedCount = user.profile.certifications.filter(c => c.status === 'APPROVED' || c.status === 'VERIFIED').length;
    const projVerifiedCount = user.profile.projects.filter(p => p.status === 'APPROVED').length;
    const skillVerifiedCount = user.profile.skills.filter(s => s.status === 'VERIFIED' || s.status === 'HIGH_CONFIDENCE').length;

    res.json({
      success: true,
      data: {
        identityVerified: Boolean(user.academicIdentity && user.academicIdentity.verificationStatus === 'VERIFIED'),
        academicVerified: Boolean(user.academicIdentity && user.academicIdentity.verificationStatus === 'VERIFIED'),
        certificateVerificationRate: `${certVerifiedCount}/${user.profile.certifications.length}`,
        projectVerificationRate: `${projVerifiedCount}/${user.profile.projects.length}`,
        skillVerificationRate: `${skillVerifiedCount}/${user.profile.skills.length}`,
        overallDataConfidence: breakdown.overallScore,
        scores: breakdown.scores,
        explanation: breakdown.explanation,
        fraudRisk,
        academicIdentity: user.academicIdentity,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const startSkillAssessment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id: studentSkillId } = req.params;
    const studentSkill = await prisma.studentSkill.findUnique({
      where: { id: studentSkillId },
      include: { skill: true },
    });

    if (!studentSkill) {
      return res.status(404).json({ success: false, error: 'Skill not found' });
    }

    const skillName = studentSkill.skill.name;

    // Find or seed skill assessment questions
    let assessment = await prisma.skillAssessment.findFirst({
      where: { skillName: { contains: skillName } },
      include: { questions: true },
    });

    if (!assessment) {
      assessment = await prisma.skillAssessment.create({
        data: {
          skillName,
          category: studentSkill.skill.category || 'Technical',
          title: `${skillName} Practical MCQ Assessment`,
          description: `Test your practical knowledge of ${skillName} concepts and architecture.`,
          passingScore: 60,
          questions: {
            create: [
              {
                questionText: `What is the primary execution flow for ${skillName} applications?`,
                optionsJson: JSON.stringify(['Client-side rendering only', 'Event loop and execution context stack', 'Single-threaded blocking sync', 'Direct hardware interrupt']),
                correctAnswerIndex: 1,
                explanation: 'Node.js and modern JS engines use an event loop architecture.',
              },
              {
                questionText: `Which approach best prevents memory leaks in ${skillName}?`,
                optionsJson: JSON.stringify(['Global variable assignments', 'Explicit event listener cleanup and weak references', 'Disabling garbage collection', 'Infinite loops']),
                correctAnswerIndex: 1,
                explanation: 'Removing event listeners and avoiding accidental global references prevents memory leaks.',
              },
              {
                questionText: `How does async/await handle error propagation in ${skillName}?`,
                optionsJson: JSON.stringify(['Ignores errors silently', 'Requires try/catch blocks or .catch() handlers', 'Throws kernel panics', 'Converts errors into 0']),
                correctAnswerIndex: 1,
                explanation: 'Async functions return promises, which throw exceptions catchable in try/catch blocks.',
              },
              {
                questionText: `What is the recommended design pattern for modular code in ${skillName}?`,
                optionsJson: JSON.stringify(['Single monolithic file', 'Decoupled module exports and dependency injection', 'Inline script injection', 'Global state mutations']),
                correctAnswerIndex: 1,
                explanation: 'Decoupled modules promote reusability and unit testing.',
              },
              {
                questionText: `What is the default data flow mechanism in ${skillName}?`,
                optionsJson: JSON.stringify(['Bi-directional global binding', 'Unidirectional data flow or explicit state pipelines', 'Random state mutations', 'Shared database locks']),
                correctAnswerIndex: 1,
                explanation: 'Modern state frameworks use unidirectional data pipelines for predictable updates.',
              },
            ],
          },
        },
        include: { questions: true },
      });
    }

    // Create attempt
    const attempt = await prisma.skillAssessmentAttempt.create({
      data: {
        assessmentId: assessment.id,
        studentId: req.user!.id,
        status: 'IN_PROGRESS',
      },
    });

    // Sanitize questions (hide correctAnswerIndex from client)
    const sanitizedQuestions = assessment.questions.map(q => ({
      id: q.id,
      questionText: q.questionText,
      options: JSON.parse(q.optionsJson),
    }));

    res.json({
      success: true,
      data: {
        attemptId: attempt.id,
        assessmentTitle: assessment.title,
        questions: sanitizedQuestions,
        totalQuestions: sanitizedQuestions.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const submitSkillAssessment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { attemptId, answers } = req.body;
    if (!attemptId || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, error: 'attemptId and answers array are required' });
    }

    const result = await skillVerificationService.evaluateAssessmentSubmission(attemptId, answers);

    res.json({
      success: true,
      message: result.passed ? 'Skill assessment PASSED! Confidence score updated.' : 'Skill assessment completed.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
