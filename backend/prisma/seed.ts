import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Naan Mudhalvan Database...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Admin
  const admin = await prisma.user.upsert({
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
  const placementOfficer = await prisma.user.upsert({
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
  const faculty = await prisma.user.upsert({
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

  // 4. Create Top Student (Aravind Kumar)
  const studentUser = await prisma.user.upsert({
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
          bio: 'Passionate Full Stack Developer & AI enthusiast focused on building scalable cloud systems.',
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
    },
    include: { profile: true },
  });

  if (studentUser.profile) {
    const profileId = studentUser.profile.id;

    // Skills
    const skillsList = [
      { name: 'React.js', category: 'Frontend', level: 90 },
      { name: 'Node.js', category: 'Backend', level: 88 },
      { name: 'TypeScript', category: 'Language', level: 85 },
      { name: 'Python', category: 'Language', level: 92 },
      { name: 'PostgreSQL', category: 'Database', level: 82 },
      { name: 'Docker', category: 'DevOps', level: 75 },
    ];

    for (const s of skillsList) {
      const skill = await prisma.skill.upsert({
        where: { name: s.name },
        update: {},
        create: { name: s.name, category: s.category },
      });

      await prisma.studentSkill.upsert({
        where: { profileId_skillId: { profileId, skillId: skill.id } },
        update: {},
        create: {
          profileId,
          skillId: skill.id,
          proficiency: s.level,
          verifiedSource: 'Naan Mudhalvan Assessment',
        },
      });
    }

    // Projects
    await prisma.project.createMany({
      data: [
        {
          profileId,
          title: 'AI Smart Traffic Management System',
          description: 'Computer vision pipeline analyzing live road cameras using YOLOv8 and FastAPI.',
          techStack: 'Python, OpenCV, YOLOv8, FastAPI, React',
          githubUrl: 'https://github.com/aravind-dev/smart-traffic-ai',
          liveUrl: 'https://traffic-ai-demo.vercel.app',
          stars: 28,
          status: 'APPROVED',
        },
        {
          profileId,
          title: 'Cloud Native Microservices E-Commerce',
          description: 'High-throughput e-commerce platform with Redis caching, Kafka message queue, and Docker Kubernetes.',
          techStack: 'Node.js, Express, PostgreSQL, Redis, Docker',
          githubUrl: 'https://github.com/aravind-dev/microservices-shop',
          stars: 42,
          status: 'APPROVED',
        },
      ],
    });

    // Certifications
    await prisma.certification.createMany({
      data: [
        {
          profileId,
          title: 'AWS Certified Cloud Practitioner',
          issuer: 'Amazon Web Services',
          issueDate: '2025-11-15',
          credentialId: 'AWS-991204-NM',
          ocrExtracted: true,
          status: 'APPROVED',
        },
        {
          profileId,
          title: 'Naan Mudhalvan Advanced Full Stack Mastery',
          issuer: 'Tamil Nadu Skill Development Corporation (TNSDC)',
          issueDate: '2025-08-20',
          credentialId: 'TNSDC-NM-2025-4421',
          ocrExtracted: true,
          status: 'APPROVED',
        },
      ],
    });

    // Coding Profile
    await prisma.codingProfile.upsert({
      where: { profileId },
      update: {},
      create: {
        profileId,
        leetcodeSolved: 245,
        leetcodeRating: 1820,
        hackerrankStars: 5,
        githubRepos: 24,
        githubStars: 85,
        githubCommits: 580,
      },
    });

    // Employment Scores & XAI
    const explainability = [
      { feature: 'Strong Projects', impact: '+18%', type: 'positive', description: '2 high-throughput full stack projects with live URLs and GitHub stars.' },
      { feature: 'GitHub Activity', impact: '+14%', type: 'positive', description: '580+ commits in the past 12 months with high star count.' },
      { feature: 'Naan Mudhalvan Certifications', impact: '+12%', type: 'positive', description: 'TNSDC Advanced Full Stack & AWS Practitioner verified.' },
      { feature: 'High Academic CGPA', impact: '+10%', type: 'positive', description: '9.4 CGPA in CSE department.' },
      { feature: 'System Architecture Communication', impact: '-6%', type: 'negative', description: 'Documentation on microservice queue recovery can be enhanced.' },
    ];

    await prisma.employmentScore.create({
      data: {
        profileId,
        overallScore: 88,
        technicalReadiness: 90,
        projectStrength: 94,
        codingReadiness: 86,
        communicationReadiness: 80,
        placementProbability: 92,
        explainabilityJson: JSON.stringify(explainability),
      },
    });
  }

  console.log('✅ Seeding completed successfully!');
  console.log('Credentials:');
  console.log(' - Student: aravind.student@college.edu / password123');
  console.log(' - Faculty: faculty.cse@college.edu / password123');
  console.log(' - Officer: placement@college.edu / password123');
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
