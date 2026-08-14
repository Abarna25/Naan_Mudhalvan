import assert from 'node:assert';
import { MockAcademicProvider } from '../services/integrations/academic/academicProvider.js';
import { CertificateVerificationService } from '../services/verification/certificateVerificationService.js';
import { GitHubEvidenceService } from '../services/integrations/github/githubEvidenceService.js';

export async function runTrustArchitectureTests() {
  console.log('🧪 Running Trust Architecture Unit Tests...');

  const academicProvider = new MockAcademicProvider();
  const certService = new CertificateVerificationService();
  const githubService = new GitHubEvidenceService();

  // Test 1: Academic lookup
  const record = await academicProvider.findStudentByRollNumber('7376221CS101');
  assert.ok(record !== null, 'Academic record should exist for valid roll number');
  assert.strictEqual(record?.name, 'Aravind Kumar');
  assert.strictEqual(record?.cgpa, 9.4);
  console.log(' ✓ Academic identity lookup test passed');

  // Test 2: Institutional email validation
  const isCollegeEmail = await academicProvider.verifyCollegeEmail('random@gmail.com');
  assert.strictEqual(isCollegeEmail, false, 'Gmail should not be valid institutional email');

  const isValidCollegeEmail = await academicProvider.verifyCollegeEmail('aravind.student@college.edu');
  assert.strictEqual(isValidCollegeEmail, true, 'College.edu domain should be valid');
  console.log(' ✓ Institutional email domain verification test passed');

  // Test 3: SHA-256 certificate hashing
  const hash1 = certService.generateFileHash('AWS_Cert_123');
  const hash2 = certService.generateFileHash('AWS_Cert_123');
  assert.strictEqual(hash1, hash2, 'SHA-256 hashes must match deterministically');
  assert.strictEqual(hash1.length, 64, 'SHA-256 hash length must be 64 chars');
  console.log(' ✓ Certificate SHA-256 hash fingerprinting test passed');

  // Test 4: GitHub URL parser
  const parsed = githubService.extractOwnerAndRepo('https://github.com/aravind-dev/smart-traffic-ai');
  assert.ok(parsed !== null);
  assert.strictEqual(parsed?.owner, 'aravind-dev');
  assert.strictEqual(parsed?.repo, 'smart-traffic-ai');
  console.log(' ✓ GitHub owner & repository URL extraction test passed');

  // Test 5: 100-point evidence scoring
  const score = githubService.calculateEvidenceScore({
    repoExists: true,
    repoAgeMonths: 8,
    commitCount: 45,
    studentContributionFound: true,
    contributionPercentage: 90,
    hasReadme: true,
    recentActivityDays: 10,
    riskFlags: [],
  });
  assert.ok(score >= 85, 'High quality repo should receive high evidence score');
  console.log(` ✓ 100-point project evidence scoring test passed (Score: ${score}/100)`);

  console.log('✅ ALL TRUST ARCHITECTURE TESTS PASSED SUCCESSFULLY!');
}

if (process.env.RUN_TESTS === 'true') {
  runTrustArchitectureTests().catch((e) => {
    console.error('❌ Trust test failure:', e);
    process.exit(1);
  });
}
