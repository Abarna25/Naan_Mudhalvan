import { prisma } from '../../config/prisma.js';

export interface FraudRiskEvaluation {
  riskScore: number; // 0-100 (higher = higher risk)
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  flags: Array<{
    code: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    message: string;
  }>;
  requiresReview: boolean;
}

export class FraudRiskService {
  public async evaluateStudentFraudRisk(profileId: string): Promise<FraudRiskEvaluation> {
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        user: { include: { academicIdentity: true } },
        projects: { include: { evidence: true } },
        certifications: { include: { verification: true } },
        placementClaims: true,
      },
    });

    if (!profile) {
      throw new Error('Profile not found');
    }

    const flags: FraudRiskEvaluation['flags'] = [];
    let riskPoints = 0;

    // Signal 1: Academic Identity
    if (!profile.user.academicIdentity || profile.user.academicIdentity.verificationStatus !== 'VERIFIED') {
      flags.push({
        code: 'UNVERIFIED_ACADEMIC_IDENTITY',
        severity: 'MEDIUM',
        message: 'Student account identity is not verified against institutional academic records.',
      });
      riskPoints += 15;
    }

    // Signal 2: Certificate Credential Reuse
    const certReuses = profile.certifications.filter(c =>
      c.verification?.riskFlags?.includes('CREDENTIAL_REUSE_SUSPECTED')
    );
    if (certReuses.length > 0) {
      flags.push({
        code: 'CREDENTIAL_REUSE_SUSPECTED',
        severity: 'HIGH',
        message: `Credential ID in ${certReuses.length} certification(s) matches another registered student's profile.`,
      });
      riskPoints += 40;
    }

    // Signal 3: Duplicate Certificate Submission
    const duplicateCerts = profile.certifications.filter(c => c.isDuplicate);
    if (duplicateCerts.length > 0) {
      flags.push({
        code: 'DUPLICATE_CERTIFICATE_SUBMITTED',
        severity: 'MEDIUM',
        message: `${duplicateCerts.length} duplicate certification upload(s) detected.`,
      });
      riskPoints += 20;
    }

    // Signal 4: Suspicious Projects (Single Commit, Created Recently, No Contribution)
    for (const proj of profile.projects) {
      if (proj.status === 'SUSPICIOUS' || proj.evidence?.contributionStatus === 'NO_CONTRIBUTION_FOUND') {
        flags.push({
          code: 'SUSPICIOUS_PROJECT_SUBMISSION',
          severity: 'HIGH',
          message: `Project "${proj.title}" flagged for suspicious repository patterns or lack of student commits.`,
        });
        riskPoints += 30;
      } else if (proj.evidence?.riskFlags?.includes('SINGLE_COMMIT_PROJECT')) {
        flags.push({
          code: 'SINGLE_COMMIT_PROJECT',
          severity: 'LOW',
          message: `Project "${proj.title}" contains only 1 commit.`,
        });
        riskPoints += 10;
      }
    }

    // Signal 5: Unverified Placement Claim
    const unverifiedPlacements = profile.placementClaims.filter(p => p.claimStatus === 'PENDING_VERIFICATION');
    if (unverifiedPlacements.length > 0) {
      flags.push({
        code: 'UNVERIFIED_PLACEMENT_CLAIM',
        severity: 'LOW',
        message: `Placement claim for ${unverifiedPlacements[0].companyName} is pending institutional verification.`,
      });
      riskPoints += 10;
    }

    const riskScore = Math.min(100, riskPoints);
    let riskLevel: FraudRiskEvaluation['riskLevel'] = 'LOW';
    if (riskScore >= 50) {
      riskLevel = 'HIGH';
    } else if (riskScore >= 25) {
      riskLevel = 'MEDIUM';
    }

    return {
      riskScore,
      riskLevel,
      flags,
      requiresReview: riskLevel !== 'LOW',
    };
  }
}
