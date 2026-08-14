export interface IssuerCredentialRecord {
  credentialId: string;
  studentName: string;
  certificateTitle: string;
  issuerName: string;
  issueDate: string;
  isValid: boolean;
  verificationUrl?: string;
}

export interface IIssuerVerificationProvider {
  verifyCredential(issuer: string, credentialId: string, studentName?: string): Promise<IssuerCredentialRecord | null>;
  isRecognizedIssuer(issuer: string): boolean;
}

export class MockIssuerProvider implements IIssuerVerificationProvider {
  private mockCredentials: Map<string, IssuerCredentialRecord> = new Map([
    [
      'AWS-991204-NM',
      {
        credentialId: 'AWS-991204-NM',
        studentName: 'Aravind Kumar',
        certificateTitle: 'AWS Certified Cloud Practitioner',
        issuerName: 'Amazon Web Services',
        issueDate: '2025-11-15',
        isValid: true,
        verificationUrl: 'https://aws.amazon.com/verification/AWS-991204-NM',
      },
    ],
    [
      'TNSDC-NM-2025-4421',
      {
        credentialId: 'TNSDC-NM-2025-4421',
        studentName: 'Aravind Kumar',
        certificateTitle: 'Naan Mudhalvan Advanced Full Stack Mastery',
        issuerName: 'Tamil Nadu Skill Development Corporation (TNSDC)',
        issueDate: '2025-08-20',
        isValid: true,
        verificationUrl: 'https://naanmudhalvan.tn.gov.in/verify/TNSDC-NM-2025-4421',
      },
    ],
    [
      'COURSERA-884920',
      {
        credentialId: 'COURSERA-884920',
        studentName: 'Kavitha R',
        certificateTitle: 'Deep Learning Specialization',
        issuerName: 'Coursera / DeepLearning.AI',
        issueDate: '2025-09-10',
        isValid: true,
        verificationUrl: 'https://coursera.org/verify/COURSERA-884920',
      },
    ],
  ]);

  private recognizedIssuers = [
    'amazon web services',
    'aws',
    'tamil nadu skill development corporation',
    'tnsdc',
    'naan mudhalvan',
    'coursera',
    'nptel',
    'microsoft',
    'google cloud',
    'hackerrank',
    'leetcode',
    'udemy',
  ];

  async verifyCredential(issuer: string, credentialId: string, studentName?: string): Promise<IssuerCredentialRecord | null> {
    if (!credentialId) return null;
    const record = this.mockCredentials.get(credentialId.trim().toUpperCase()) || this.mockCredentials.get(credentialId.trim());
    if (record) {
      return record;
    }

    // Dynamic verification matching pattern
    if (this.isRecognizedIssuer(issuer) && credentialId.length >= 6) {
      return {
        credentialId,
        studentName: studentName || 'Verified Student',
        certificateTitle: `Verified Certificate from ${issuer}`,
        issuerName: issuer,
        issueDate: new Date().toISOString().split('T')[0],
        isValid: true,
        verificationUrl: `https://${issuer.toLowerCase().replace(/[^a-z0-9]/g, '')}.com/verify/${credentialId}`,
      };
    }

    return null;
  }

  isRecognizedIssuer(issuer: string): boolean {
    if (!issuer) return false;
    const lower = issuer.toLowerCase();
    return this.recognizedIssuers.some(r => lower.includes(r));
  }
}

export function getIssuerVerificationProvider(): IIssuerVerificationProvider {
  return new MockIssuerProvider();
}
