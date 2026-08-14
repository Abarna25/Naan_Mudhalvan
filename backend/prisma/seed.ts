import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Naan Mudhalvan Trust System Database...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Admin
  await prisma.user.upsert({
    where: { email: 'admin@naanmudhalvan.edu' },
    update: {},
    create: {
      email: 'admin@naanmudhalvan.edu',
      passwordHash,
      name: 'Dr. K. Rajasekaran',
      role: 'ADMIN',
      department: 'State Skill Development Mission',
      naanMudhalvanId: 'NM-ADMIN-001',
      emailVerified: true,
    },
  });

  // 2. Create Placement Officer
  await prisma.user.upsert({
    where: { email: 'placement@college.edu' },
    update: {},
    create: {
      email: 'placement@college.edu',
      passwordHash,
      name: 'Prof. Sundararam M',
      role: 'PLACEMENT_OFFICER',
      department: 'Training & Placement Cell',
      naanMudhalvanId: 'NM-OFFICER-102',
      emailVerified: true,
    },
  });

  // 3. Create Faculty
  await prisma.user.upsert({
    where: { email: 'faculty.cse@college.edu' },
    update: {},
    create: {
      email: 'faculty.cse@college.edu',
      passwordHash,
      name: 'Dr. Malathi N',
      role: 'FACULTY',
      department: 'Computer Science & Engineering',
      naanMudhalvanId: 'NM-FACULTY-204',
      emailVerified: true,
    },
  });

  // 4. Create Companies
  const amazonCompany = await prisma.company.upsert({
    where: { normalizedName: 'amazon' },
    update: {},
    create: { name: 'Amazon', normalizedName: 'amazon', tier: 'Tier 1' },
  });

  await prisma.company.upsert({
    where: { normalizedName: 'tcs' },
    update: {},
    create: { name: 'TCS', normalizedName: 'tcs', tier: 'Tier 2' },
  });

  // -------------------------------------------------------------
  // STUDENT A: Aravind Kumar (VERIFIED Everything, Data Confidence: 96)
  // -------------------------------------------------------------
  const studentA = await prisma.user.upsert({
    where: { email: 'aravind.student@college.edu' },
    update: {},
    create: {
      email: 'aravind.student@college.edu',
      passwordHash,
      name: 'Aravind Kumar',
      role: 'STUDENT',
      department: 'Computer Science & Engineering',
      naanMudhalvanId: 'NM-2026-882341',
      emailVerified: true,
      profile: {
        create: {
          bio: 'Passionate Full Stack Developer & AI enthusiast.',
          cgpa: 9.4,
          graduationYear: 2025,
          phone: '+91 98401 23456',
          collegeName: 'Government Engineering College, Salem',
          githubUsername: 'aravind-dev',
          leetcodeUsername: 'aravind_k',
          hackerrankUsername: 'aravind_nm',
          linkedinUrl: 'https://linkedin.com/in/aravind-kumar-dev',
          portfolioSlug: 'aravind-kumar',
          isPublic: true,
          profileCompletion: 95,
        },
      },
      academicIdentity: {
        create: {
          studentId: 'NM-2026-882341',
          rollNumber: '7376221CS101',
          institutionalEmail: 'aravind.student@college.edu',
          name: 'Aravind Kumar',
          collegeName: 'Government Engineering College, Salem',
          department: 'Computer Science & Engineering',
          program: 'B.E. Computer Science & Engineering',
          year: 4,
          semester: 7,
          batch: '2022-2026',
          section: 'A',
          academicStatus: 'ACTIVE',
          cgpa: 9.4,
          verificationStatus: 'VERIFIED',
        },
      },
    },
    include: { profile: true },
  });

  if (studentA.profile) {
    const profileId = studentA.profile.id;

    // Skills
    const pySkill = await prisma.skill.upsert({ where: { name: 'Python' }, update: {}, create: { name: 'Python', category: 'Language' } });
    const reactSkill = await prisma.skill.upsert({ where: { name: 'React.js' }, update: {}, create: { name: 'React.js', category: 'Frontend' } });

    await prisma.studentSkill.upsert({
      where: { profileId_skillId: { profileId, skillId: pySkill.id } },
      update: {},
      create: {
        profileId,
        skillId: pySkill.id,
        proficiency: 92,
        verifiedSource: 'Coding Assessment & GitHub Evidence',
        status: 'HIGH_CONFIDENCE',
        confidenceScore: 94,
        assessmentScore: 92,
      },
    });

    await prisma.studentSkill.upsert({
      where: { profileId_skillId: { profileId, skillId: reactSkill.id } },
      update: {},
      create: {
        profileId,
        skillId: reactSkill.id,
        proficiency: 90,
        verifiedSource: 'Verified GitHub Project',
        status: 'VERIFIED',
        confidenceScore: 88,
      },
    });

    // Projects
    const projA = await prisma.project.create({
      data: {
        profileId,
        title: 'AI Smart Traffic Management System',
        description: 'Computer vision pipeline analyzing live road cameras using YOLOv8 and FastAPI.',
        techStack: 'Python, OpenCV, YOLOv8, FastAPI, React',
        githubUrl: 'https://github.com/aravind-dev/smart-traffic-ai',
        liveUrl: 'https://traffic-ai-demo.vercel.app',
        stars: 28,
        status: 'APPROVED',
        evidence: {
          create: {
            repoOwner: 'aravind-dev',
            repoName: 'smart-traffic-ai',
            repoAgeMonths: 8,
            commitCount: 43,
            commitFrequency: 'HIGH',
            studentContributionFound: true,
            contributionPercentage: 90,
            contributorsCount: 3,
            hasReadme: true,
            recentActivityDays: 12,
            evidenceScore: 91,
            contributionStatus: 'OWNER_VERIFIED',
            riskFlags: '[]',
          },
        },
      },
    });

    // Certifications
    await prisma.certification.create({
      data: {
        profileId,
        title: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services',
        issueDate: '2025-11-15',
        credentialId: 'AWS-991204-NM',
        ocrExtracted: true,
        status: 'APPROVED',
        verification: {
          create: {
            fileHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            verificationUrl: 'https://aws.amazon.com/verification/AWS-991204-NM',
            verificationDomain: 'aws.amazon.com',
            issuerVerified: true,
            verificationStatus: 'VERIFIED',
            verificationMethod: 'ISSUER_API',
            verifiedBy: 'SYSTEM',
            riskFlags: '[]',
          },
        },
      },
    });

    // Placement Claim
    await prisma.placementClaim.create({
      data: {
        profileId,
        companyName: 'Amazon',
        companyId: amazonCompany.id,
        roleTitle: 'Software Development Engineer I',
        packageLpa: 18.5,
        claimStatus: 'VERIFIED',
        verifiedAt: new Date(),
      },
    });

    // Trust Score
    await prisma.trustScore.upsert({
      where: { profileId },
      update: {},
      create: {
        profileId,
        overallDataConfidence: 96,
        identityScore: 100,
        academicScore: 100,
        skillScore: 94,
        projectScore: 91,
        certificationScore: 100,
        placementScore: 100,
        riskLevel: 'LOW',
        breakdownJson: JSON.stringify([
          { category: 'Institutional Identity', score: 100, status: 'VERIFIED', details: 'Verified via Institutional Academic Database (7376221CS101)' },
          { category: 'Academic Records', score: 100, status: 'VERIFIED', details: 'Official CGPA 9.4 from Academic ERP' },
          { category: 'Skills Evidence', score: 94, status: 'HIGH_CONFIDENCE', details: 'Python assessment (92%) and GitHub verified' },
          { category: 'Project Evidence', score: 91, status: 'VERIFIED', details: 'Strong 8-month commit history with 43 commits' },
          { category: 'Certifications Evidence', score: 100, status: 'VERIFIED', details: 'AWS Certified Cloud Practitioner verified via Issuer API' },
          { category: 'Placement Claims', score: 100, status: 'VERIFIED', details: 'Verified placement at Amazon (SDE I)' },
        ]),
      },
    });

    // Employment Score
    await prisma.employmentScore.create({
      data: {
        profileId,
        overallScore: 88,
        technicalReadiness: 90,
        projectStrength: 94,
        codingReadiness: 86,
        communicationReadiness: 80,
        placementProbability: 92,
        explainabilityJson: JSON.stringify([
          { feature: 'Trusted Python Skill', impact: '+18%', type: 'positive', description: '94% confidence backed by assessment & GitHub commits' },
          { feature: 'Verified Project Evidence', impact: '+15%', type: 'positive', description: 'GitHub analysis confirmed owner contributions' },
        ]),
      },
    });
  }

  // -------------------------------------------------------------
  // STUDENT B: Kavitha R (Unverified Claims, Data Confidence: 42)
  // -------------------------------------------------------------
  const studentB = await prisma.user.upsert({
    where: { email: 'kavitha.student@college.edu' },
    update: {},
    create: {
      email: 'kavitha.student@college.edu',
      passwordHash,
      name: 'Kavitha R',
      role: 'STUDENT',
      department: 'Information Technology',
      naanMudhalvanId: 'NM-2026-882342',
      emailVerified: true,
      profile: {
        create: {
          bio: 'IT Student interested in Web Development.',
          cgpa: 9.2,
          graduationYear: 2025,
          phone: '+91 98401 99887',
          collegeName: 'Government Engineering College, Salem',
          githubUsername: 'kavitha-dev',
          portfolioSlug: 'kavitha-r',
          isPublic: true,
          profileCompletion: 60,
        },
      },
      academicIdentity: {
        create: {
          studentId: 'NM-2026-882342',
          rollNumber: '7376221CS102',
          institutionalEmail: 'kavitha.student@college.edu',
          name: 'Kavitha R',
          collegeName: 'Government Engineering College, Salem',
          department: 'Information Technology',
          program: 'B.Tech Information Technology',
          year: 4,
          semester: 7,
          batch: '2022-2026',
          section: 'B',
          academicStatus: 'ACTIVE',
          cgpa: 9.2,
          verificationStatus: 'VERIFIED',
        },
      },
    },
    include: { profile: true },
  });

  if (studentB.profile) {
    const profileId = studentB.profile.id;
    const awsSkill = await prisma.skill.upsert({ where: { name: 'AWS' }, update: {}, create: { name: 'AWS', category: 'Cloud' } });

    await prisma.studentSkill.upsert({
      where: { profileId_skillId: { profileId, skillId: awsSkill.id } },
      update: {},
      create: {
        profileId,
        skillId: awsSkill.id,
        proficiency: 80,
        verifiedSource: 'Self Declared',
        status: 'SELF_DECLARED',
        confidenceScore: 20,
      },
    });

    await prisma.project.create({
      data: {
        profileId,
        title: 'Basic HTML Portfolio',
        description: 'Personal web page',
        techStack: 'HTML, CSS',
        githubUrl: 'https://github.com/kavitha-dev/portfolio-temp',
        status: 'MANUAL_REVIEW_REQUIRED',
        evidence: {
          create: {
            repoOwner: 'kavitha-dev',
            repoName: 'portfolio-temp',
            repoAgeMonths: 0,
            commitCount: 1,
            commitFrequency: 'LOW',
            studentContributionFound: true,
            contributionPercentage: 100,
            evidenceScore: 32,
            contributionStatus: 'MANUAL_REVIEW_REQUIRED',
            riskFlags: JSON.stringify(['SINGLE_COMMIT_PROJECT']),
          },
        },
      },
    });

    await prisma.trustScore.upsert({
      where: { profileId },
      update: {},
      create: {
        profileId,
        overallDataConfidence: 42,
        identityScore: 100,
        academicScore: 100,
        skillScore: 20,
        projectScore: 32,
        certificationScore: 0,
        placementScore: 0,
        riskLevel: 'HIGH',
        breakdownJson: JSON.stringify([
          { category: 'Institutional Identity', score: 100, status: 'VERIFIED', details: 'Verified roll number' },
          { category: 'Skills Evidence', score: 20, status: 'SELF_DECLARED', details: 'AWS self-declared without assessment or cert' },
          { category: 'Project Evidence', score: 32, status: 'LOW_EVIDENCE', details: 'Single commit project requires review' },
        ]),
      },
    });
  }

  // -------------------------------------------------------------
  // STUDENT C: Sanjay Nathan (Suspicious Project, Cert Review)
  // -------------------------------------------------------------
  const studentC = await prisma.user.upsert({
    where: { email: 'sanjay.student@college.edu' },
    update: {},
    create: {
      email: 'sanjay.student@college.edu',
      passwordHash,
      name: 'Sanjay Nathan',
      role: 'STUDENT',
      department: 'Electronics & Comm Eng',
      naanMudhalvanId: 'NM-2026-882343',
      emailVerified: true,
      profile: {
        create: {
          bio: 'ECE Student experimenting with IoT.',
          cgpa: 8.9,
          graduationYear: 2026,
          collegeName: 'Government Engineering College, Salem',
          portfolioSlug: 'sanjay-nathan',
          isPublic: true,
          profileCompletion: 70,
        },
      },
      academicIdentity: {
        create: {
          studentId: 'NM-2026-882343',
          rollNumber: '7376221CS103',
          institutionalEmail: 'sanjay.student@college.edu',
          name: 'Sanjay Nathan',
          collegeName: 'Government Engineering College, Salem',
          department: 'Electronics & Comm Eng',
          program: 'B.E. Electronics & Communication',
          year: 3,
          semester: 6,
          batch: '2023-2027',
          section: 'A',
          academicStatus: 'ACTIVE',
          cgpa: 8.9,
          verificationStatus: 'VERIFIED',
        },
      },
    },
    include: { profile: true },
  });

  if (studentC.profile) {
    const profileId = studentC.profile.id;

    await prisma.project.create({
      data: {
        profileId,
        title: 'Smart Home Automation',
        description: 'Copied IoT project submission',
        techStack: 'C++, Arduino',
        githubUrl: 'https://github.com/someone-else/smart-home-copy',
        status: 'SUSPICIOUS',
        evidence: {
          create: {
            repoOwner: 'someone-else',
            repoName: 'smart-home-copy',
            repoAgeMonths: 0,
            commitCount: 2,
            studentContributionFound: false,
            contributionPercentage: 0,
            evidenceScore: 25,
            contributionStatus: 'NO_CONTRIBUTION_FOUND',
            riskFlags: JSON.stringify(['NO_STUDENT_CONTRIBUTION_DETECTED', 'CREATED_IMMEDIATELY_BEFORE_SUBMISSION']),
          },
        },
      },
    });

    await prisma.trustScore.upsert({
      where: { profileId },
      update: {},
      create: {
        profileId,
        overallDataConfidence: 61,
        identityScore: 100,
        academicScore: 100,
        skillScore: 40,
        projectScore: 25,
        certificationScore: 40,
        placementScore: 0,
        riskLevel: 'MEDIUM',
        breakdownJson: JSON.stringify([
          { category: 'Project Evidence', score: 25, status: 'SUSPICIOUS', details: 'No student commit activity detected on repo' },
        ]),
      },
    });
  }

  // -------------------------------------------------------------
  // STUDENT D: Praveen S (Assessment 82% Passed, Data Confidence: 91)
  // -------------------------------------------------------------
  const studentD = await prisma.user.upsert({
    where: { email: 'praveen.student@college.edu' },
    update: {},
    create: {
      email: 'praveen.student@college.edu',
      passwordHash,
      name: 'Praveen S',
      role: 'STUDENT',
      department: 'Computer Science & Engineering',
      naanMudhalvanId: 'NM-2026-882344',
      emailVerified: true,
      profile: {
        create: {
          bio: 'Backend & Systems Engineer',
          cgpa: 8.4,
          graduationYear: 2026,
          collegeName: 'Government Engineering College, Salem',
          githubUsername: 'praveen-dev',
          portfolioSlug: 'praveen-s',
          isPublic: true,
          profileCompletion: 88,
        },
      },
      academicIdentity: {
        create: {
          studentId: 'NM-2026-882344',
          rollNumber: '7376221CS104',
          institutionalEmail: 'praveen.student@college.edu',
          name: 'Praveen S',
          collegeName: 'Government Engineering College, Salem',
          department: 'Computer Science & Engineering',
          program: 'B.E. Computer Science & Engineering',
          year: 3,
          semester: 6,
          batch: '2023-2027',
          section: 'B',
          academicStatus: 'ACTIVE',
          cgpa: 8.4,
          verificationStatus: 'VERIFIED',
        },
      },
    },
    include: { profile: true },
  });

  if (studentD.profile) {
    const profileId = studentD.profile.id;
    const pySkill = await prisma.skill.upsert({ where: { name: 'Python' }, update: {}, create: { name: 'Python', category: 'Language' } });

    await prisma.studentSkill.upsert({
      where: { profileId_skillId: { profileId, skillId: pySkill.id } },
      update: {},
      create: {
        profileId,
        skillId: pySkill.id,
        proficiency: 85,
        verifiedSource: 'Naan Mudhalvan MCQ Assessment',
        status: 'HIGH_CONFIDENCE',
        confidenceScore: 88,
        assessmentScore: 82,
      },
    });

    await prisma.trustScore.upsert({
      where: { profileId },
      update: {},
      create: {
        profileId,
        overallDataConfidence: 91,
        identityScore: 100,
        academicScore: 100,
        skillScore: 88,
        projectScore: 85,
        certificationScore: 80,
        placementScore: 0,
        riskLevel: 'LOW',
        breakdownJson: JSON.stringify([
          { category: 'Institutional Identity', score: 100, status: 'VERIFIED', details: 'Verified roll number' },
          { category: 'Skills Evidence', score: 88, status: 'HIGH_CONFIDENCE', details: 'Python MCQ Assessment score: 82%' },
        ]),
      },
    });
  }

  console.log('✅ Naan Mudhalvan Trust Architecture database seeded successfully!');
  console.log('Demonstration Credentials:');
  console.log(' - Student A (Verified 96% Data Confidence): aravind.student@college.edu / password123');
  console.log(' - Student B (Self-declared 42% Data Confidence): kavitha.student@college.edu / password123');
  console.log(' - Student C (Suspicious 61% Data Confidence): sanjay.student@college.edu / password123');
  console.log(' - Student D (Assessment 91% Data Confidence): praveen.student@college.edu / password123');
  console.log(' - Faculty (CSE Dept Scope): faculty.cse@college.edu / password123');
  console.log(' - Placement Officer: placement@college.edu / password123');
  console.log(' - Admin: admin@naanmudhalvan.edu / password123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
