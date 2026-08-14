import { prisma } from '../../config/prisma.js';

export interface DataConfidenceBreakdown {
  overallScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  scores: {
    identity: number;
    academic: number;
    skills: number;
    projects: number;
    certifications: number;
    placement: number;
    codingActivity: number;
  };
  explanation: Array<{
    category: string;
    score: number;
    weightPct: number;
    status: string;
    details: string;
  }>;
}

export class TrustScoreService {
  public async calculateProfileTrustScore(profileId: string): Promise<DataConfidenceBreakdown> {
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        user: {
          include: {
            academicIdentity: true,
          },
        },
        skills: { include: { skill: true } },
        projects: { include: { evidence: true } },
        certifications: { include: { verification: true } },
        placementClaims: true,
        codingProfile: true,
      },
    });

    if (!profile) {
      throw new Error('Profile not found');
    }

    // 1. Identity Score (Weight 20%)
    let identityScore = 30; // default unverified
    let identityStatus = 'UNVERIFIED';
    let identityDetails = 'Student profile lacks institutional academic identity verification.';
    if (profile.user.academicIdentity && profile.user.academicIdentity.verificationStatus === 'VERIFIED') {
      identityScore = 100;
      identityStatus = 'VERIFIED';
      identityDetails = `Verified via Institutional Academic Database (${profile.user.academicIdentity.rollNumber})`;
    } else if (profile.user.emailVerified) {
      identityScore = 60;
      identityStatus = 'PARTIALLY_VERIFIED';
      identityDetails = 'Institutional email verified, pending roll number sync.';
    }

    // 2. Academic Score (Weight 15%)
    let academicScore = 40;
    let academicStatus = 'SELF_DECLARED';
    let academicDetails = 'Academic CGPA self-entered.';
    if (profile.user.academicIdentity && profile.user.academicIdentity.verificationStatus === 'VERIFIED') {
      academicScore = 100;
      academicStatus = 'VERIFIED';
      academicDetails = `Official CGPA ${profile.user.academicIdentity.cgpa} from Academic ERP (${profile.user.academicIdentity.department})`;
    }

    // 3. Skills Score (Weight 20%)
    let skillsScore = 20;
    let skillsStatus = 'SELF_DECLARED';
    let skillsDetails = 'No skill assessments or project evidence linked.';
    if (profile.skills.length > 0) {
      const avgConfidence = profile.skills.reduce((acc, s) => acc + s.confidenceScore, 0) / profile.skills.length;
      skillsScore = Math.round(avgConfidence);
      if (skillsScore >= 75) {
        skillsStatus = 'HIGH_CONFIDENCE';
        skillsDetails = `${profile.skills.length} skills verified via assessments and project evidence.`;
      } else if (skillsScore >= 50) {
        skillsStatus = 'PARTIALLY_VERIFIED';
        skillsDetails = 'Some skills backed by assessments or verified projects.';
      } else {
        skillsDetails = 'Most skills remain self-declared claims.';
      }
    }

    // 4. Projects Score (Weight 20%)
    let projectsScore = 15;
    let projectsStatus = 'LOW_EVIDENCE';
    let projectsDetails = 'No verified GitHub projects found.';
    if (profile.projects.length > 0) {
      const evidenceScores = profile.projects.map(p => p.evidence?.evidenceScore || (p.status === 'APPROVED' ? 75 : 20));
      projectsScore = Math.round(evidenceScores.reduce((acc, score) => acc + score, 0) / evidenceScores.length);
      const verifiedCount = profile.projects.filter(p => p.status === 'APPROVED').length;
      if (projectsScore >= 75) {
        projectsStatus = 'VERIFIED';
        projectsDetails = `${verifiedCount}/${profile.projects.length} projects analyzed with strong GitHub commit & contribution history.`;
      } else {
        projectsDetails = `${profile.projects.length} projects submitted. GitHub evidence requires further manual review.`;
      }
    }

    // 5. Certifications Score (Weight 10%)
    let certsScore = 20;
    let certsStatus = 'UNVERIFIED';
    let certsDetails = 'No verified certifications.';
    if (profile.certifications.length > 0) {
      const verifiedCerts = profile.certifications.filter(c => c.status === 'APPROVED' || c.status === 'VERIFIED');
      certsScore = Math.round((verifiedCerts.length / profile.certifications.length) * 100);
      if (certsScore >= 80) {
        certsStatus = 'VERIFIED';
        certsDetails = `${verifiedCerts.length}/${profile.certifications.length} certifications verified via URL, QR, or Issuer API.`;
      } else {
        certsDetails = `${verifiedCerts.length}/${profile.certifications.length} certifications verified.`;
      }
    }

    // 6. Placement Score (Weight 10%)
    let placementScore = 50; // Default baseline for non-placed or active
    let placementStatus = 'NO_CLAIM';
    let placementDetails = 'No active placement claims.';
    const verifiedPlacement = profile.placementClaims.find(p => p.claimStatus === 'VERIFIED');
    const pendingPlacement = profile.placementClaims.find(p => p.claimStatus === 'PENDING_VERIFICATION');
    if (verifiedPlacement) {
      placementScore = 100;
      placementStatus = 'VERIFIED';
      placementDetails = `Verified placement at ${verifiedPlacement.companyName} (${verifiedPlacement.roleTitle})`;
    } else if (pendingPlacement) {
      placementScore = 40;
      placementStatus = 'PENDING_VERIFICATION';
      placementDetails = `Pending placement claim at ${pendingPlacement.companyName} awaiting officer verification.`;
    }

    // 7. External Coding Activity (Weight 5%)
    let codingScore = 30;
    if (profile.codingProfile && profile.codingProfile.githubCommits > 100) {
      codingScore = 95;
    } else if (profile.codingProfile && profile.codingProfile.githubCommits > 20) {
      codingScore = 65;
    }

    // Weighted Overall Data Confidence Score Calculation
    const overallScore = Math.round(
      identityScore * 0.20 +
      academicScore * 0.15 +
      skillsScore * 0.20 +
      projectsScore * 0.20 +
      certsScore * 0.10 +
      placementScore * 0.10 +
      codingScore * 0.05
    );

    let riskLevel: DataConfidenceBreakdown['riskLevel'] = 'LOW';
    if (overallScore < 50) {
      riskLevel = 'HIGH';
    } else if (overallScore < 75) {
      riskLevel = 'MEDIUM';
    }

    const explanation = [
      { category: 'Institutional Identity', score: identityScore, weightPct: 20, status: identityStatus, details: identityDetails },
      { category: 'Academic Records', score: academicScore, weightPct: 15, status: academicStatus, details: academicDetails },
      { category: 'Skills Evidence', score: skillsScore, weightPct: 20, status: skillsStatus, details: skillsDetails },
      { category: 'Project Evidence', score: projectsScore, weightPct: 20, status: projectsStatus, details: projectsDetails },
      { category: 'Certifications Evidence', score: certsScore, weightPct: 10, status: certsStatus, details: certsDetails },
      { category: 'Placement Claims', score: placementScore, weightPct: 10, status: placementStatus, details: placementDetails },
      { category: 'Coding Profile Activity', score: codingScore, weightPct: 5, status: 'SYNCED', details: 'Synced LeetCode and GitHub repository metrics.' },
    ];

    const breakdownJson = JSON.stringify(explanation);

    // Upsert TrustScore record
    await prisma.trustScore.upsert({
      where: { profileId },
      update: {
        overallDataConfidence: overallScore,
        identityScore,
        academicScore,
        skillScore: skillsScore,
        projectScore: projectsScore,
        certificationScore: certsScore,
        placementScore,
        riskLevel,
        breakdownJson,
      },
      create: {
        profileId,
        overallDataConfidence: overallScore,
        identityScore,
        academicScore,
        skillScore: skillsScore,
        projectScore: projectsScore,
        certificationScore: certsScore,
        placementScore,
        riskLevel,
        breakdownJson,
      },
    });

    return {
      overallScore,
      riskLevel,
      scores: {
        identity: identityScore,
        academic: academicScore,
        skills: skillsScore,
        projects: projectsScore,
        certifications: certsScore,
        placement: placementScore,
        codingActivity: codingScore,
      },
      explanation,
    };
  }
}
