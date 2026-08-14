import { prisma } from '../../config/prisma.js';
import { GitHubEvidenceService, GitHubAnalysisResult } from '../integrations/github/githubEvidenceService.js';

export class ProjectEvidenceService {
  private githubService = new GitHubEvidenceService();

  public async evaluateProjectEvidence(projectId: string, studentGithubUsername?: string | null): Promise<GitHubAnalysisResult> {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      throw new Error('Project not found');
    }

    let githubAnalysis: GitHubAnalysisResult;
    if (project.githubUrl) {
      githubAnalysis = await this.githubService.analyzeRepository(project.githubUrl, studentGithubUsername);
    } else {
      githubAnalysis = {
        repoExists: false,
        repoOwner: null,
        repoName: null,
        repoAgeMonths: 0,
        commitCount: 0,
        commitFrequency: 'LOW',
        studentContributionFound: false,
        contributionPercentage: 0,
        languageBreakdown: {},
        contributorsCount: 0,
        hasReadme: false,
        recentActivityDays: 999,
        evidenceScore: 15, // Low default for projects without GitHub URL
        contributionStatus: 'MANUAL_REVIEW_REQUIRED',
        riskFlags: ['NO_GITHUB_URL_PROVIDED'],
      };
    }

    // Determine project status based on evidence score and risk flags
    let projectStatus = 'PENDING';
    if (githubAnalysis.riskFlags.includes('SUSPICIOUS_REPO_PATTERN') || githubAnalysis.riskFlags.includes('CREATED_IMMEDIATELY_BEFORE_SUBMISSION')) {
      projectStatus = 'SUSPICIOUS';
    } else if (githubAnalysis.evidenceScore >= 70 && (githubAnalysis.contributionStatus === 'OWNER_VERIFIED' || githubAnalysis.contributionStatus === 'CONTRIBUTOR_VERIFIED')) {
      projectStatus = 'APPROVED';
    } else {
      projectStatus = 'MANUAL_REVIEW_REQUIRED';
    }

    // Upsert ProjectEvidence record
    await prisma.projectEvidence.upsert({
      where: { projectId },
      update: {
        repoOwner: githubAnalysis.repoOwner,
        repoName: githubAnalysis.repoName,
        repoAgeMonths: githubAnalysis.repoAgeMonths,
        commitCount: githubAnalysis.commitCount,
        commitFrequency: githubAnalysis.commitFrequency,
        studentContributionFound: githubAnalysis.studentContributionFound,
        contributionPercentage: githubAnalysis.contributionPercentage,
        languageBreakdown: JSON.stringify(githubAnalysis.languageBreakdown),
        contributorsCount: githubAnalysis.contributorsCount,
        hasReadme: githubAnalysis.hasReadme,
        recentActivityDays: githubAnalysis.recentActivityDays,
        evidenceScore: githubAnalysis.evidenceScore,
        contributionStatus: githubAnalysis.contributionStatus,
        riskFlags: JSON.stringify(githubAnalysis.riskFlags),
        verifiedAt: projectStatus === 'APPROVED' ? new Date() : null,
      },
      create: {
        projectId,
        repoOwner: githubAnalysis.repoOwner,
        repoName: githubAnalysis.repoName,
        repoAgeMonths: githubAnalysis.repoAgeMonths,
        commitCount: githubAnalysis.commitCount,
        commitFrequency: githubAnalysis.commitFrequency,
        studentContributionFound: githubAnalysis.studentContributionFound,
        contributionPercentage: githubAnalysis.contributionPercentage,
        languageBreakdown: JSON.stringify(githubAnalysis.languageBreakdown),
        contributorsCount: githubAnalysis.contributorsCount,
        hasReadme: githubAnalysis.hasReadme,
        recentActivityDays: githubAnalysis.recentActivityDays,
        evidenceScore: githubAnalysis.evidenceScore,
        contributionStatus: githubAnalysis.contributionStatus,
        riskFlags: JSON.stringify(githubAnalysis.riskFlags),
        verifiedAt: projectStatus === 'APPROVED' ? new Date() : null,
      },
    });

    // Update parent Project status
    await prisma.project.update({
      where: { id: projectId },
      data: { status: projectStatus },
    });

    return githubAnalysis;
  }
}
