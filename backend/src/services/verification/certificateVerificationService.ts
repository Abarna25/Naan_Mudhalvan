import { prisma } from '../../config/prisma.js';
import { getIssuerVerificationProvider } from '../integrations/issuers/issuerVerificationProvider.js';
import crypto from 'crypto';

export interface CertificateVerificationResult {
  status: 'VERIFIED' | 'REJECTED' | 'MANUAL_REVIEW_REQUIRED' | 'INVALID' | 'CREDENTIAL_REUSE_SUSPECTED';
  verificationMethod: 'URL_AND_QR' | 'ISSUER_API' | 'FACULTY_MANUAL' | 'NONE';
  issuerVerified: boolean;
  fileHash: string;
  isDuplicate: boolean;
  riskFlags: string[];
  verificationDetails: any;
}

export class CertificateVerificationService {
  private issuerProvider = getIssuerVerificationProvider();

  public generateFileHash(input: string): string {
    return crypto.createHash('sha256').update(input.trim()).digest('hex');
  }

  public async processCertificateVerification(params: {
    certificationId: string;
    profileId: string;
    studentName: string;
    title: string;
    issuer: string;
    credentialId?: string | null;
    verificationUrl?: string | null;
    fileUrl?: string | null;
    qrCodeData?: string | null;
  }): Promise<CertificateVerificationResult> {
    const { certificationId, profileId, studentName, title, issuer, credentialId, verificationUrl, fileUrl, qrCodeData } = params;

    const hashInput = `${title}_${issuer}_${credentialId || ''}_${fileUrl || ''}`;
    const fileHash = this.generateFileHash(hashInput);

    const riskFlags: string[] = [];
    let isDuplicate = false;

    // 1. Check duplicate certificate for same profile
    const existingSameProfile = await prisma.certification.findFirst({
      where: {
        profileId,
        id: { not: certificationId },
        OR: [
          { credentialId: credentialId ? credentialId : '____none____' },
          { title, issuer },
        ],
      },
    });

    if (existingSameProfile) {
      isDuplicate = true;
      riskFlags.push('DUPLICATE_CERTIFICATE_SUBMITTED');
    }

    // 2. Check suspicious credential reuse across DIFFERENT profiles
    if (credentialId && credentialId.trim().length > 3) {
      const reuseAcrossStudents = await prisma.certification.findFirst({
        where: {
          profileId: { not: profileId },
          credentialId: credentialId.trim(),
        },
      });

      if (reuseAcrossStudents) {
        riskFlags.push('CREDENTIAL_REUSE_SUSPECTED');
      }
    }

    // 3. Automated Verification Checks
    let verifiedByIssuer = false;
    let verifiedByUrlOrQr = false;
    let verificationResponseJson = {};
    let verificationStatus: CertificateVerificationResult['status'] = 'MANUAL_REVIEW_REQUIRED';
    let verificationMethod: CertificateVerificationResult['verificationMethod'] = 'NONE';

    // A. Check Issuer API
    if (credentialId) {
      const issuerRecord = await this.issuerProvider.verifyCredential(issuer, credentialId, studentName);
      if (issuerRecord && issuerRecord.isValid) {
        verifiedByIssuer = true;
        verificationMethod = 'ISSUER_API';
        verificationStatus = 'VERIFIED';
        verificationResponseJson = issuerRecord;
      }
    }

    // B. Check Verification URL if not already verified by issuer
    if (!verifiedByIssuer && verificationUrl) {
      const isValidUrl = this.validateVerificationUrl(verificationUrl, issuer);
      if (isValidUrl.valid) {
        verifiedByUrlOrQr = true;
        verificationMethod = 'URL_AND_QR';
        verificationStatus = 'VERIFIED';
        verificationResponseJson = { url: verificationUrl, domain: isValidUrl.domain, matched: true };
      } else {
        riskFlags.push('UNTRUSTED_OR_UNREACHABLE_VERIFICATION_URL');
      }
    }

    // C. Check QR Code if available
    if (!verifiedByIssuer && !verifiedByUrlOrQr && qrCodeData) {
      if (qrCodeData.includes('http') || qrCodeData.includes('credential')) {
        verifiedByUrlOrQr = true;
        verificationMethod = 'URL_AND_QR';
        verificationStatus = 'VERIFIED';
        verificationResponseJson = { qr: qrCodeData, decoded: true };
      }
    }

    // D. Credential Reuse Override
    if (riskFlags.includes('CREDENTIAL_REUSE_SUSPECTED')) {
      verificationStatus = 'CREDENTIAL_REUSE_SUSPECTED';
    }

    // Save or Update CertificateVerification Record in Prisma
    await prisma.certificateVerification.upsert({
      where: { certificationId },
      update: {
        fileHash,
        verificationUrl,
        verificationDomain: verificationUrl ? this.extractDomain(verificationUrl) : null,
        verificationResponse: JSON.stringify(verificationResponseJson),
        qrCodeData,
        issuerVerified: verifiedByIssuer,
        verificationStatus,
        verificationMethod,
        riskFlags: JSON.stringify(riskFlags),
        verifiedAt: verificationStatus === 'VERIFIED' ? new Date() : null,
      },
      create: {
        certificationId,
        fileHash,
        verificationUrl,
        verificationDomain: verificationUrl ? this.extractDomain(verificationUrl) : null,
        verificationResponse: JSON.stringify(verificationResponseJson),
        qrCodeData,
        issuerVerified: verifiedByIssuer,
        verificationStatus,
        verificationMethod,
        riskFlags: JSON.stringify(riskFlags),
        verifiedAt: verificationStatus === 'VERIFIED' ? new Date() : null,
      },
    });

    // Update parent Certification model status
    await prisma.certification.update({
      where: { id: certificationId },
      data: {
        isDuplicate,
        status: verificationStatus === 'VERIFIED' ? 'APPROVED' : verificationStatus === 'CREDENTIAL_REUSE_SUSPECTED' ? 'REJECTED' : 'PENDING',
      },
    });

    return {
      status: verificationStatus,
      verificationMethod,
      issuerVerified: verifiedByIssuer,
      fileHash,
      isDuplicate,
      riskFlags,
      verificationDetails: verificationResponseJson,
    };
  }

  private validateVerificationUrl(url: string, issuer: string): { valid: boolean; domain: string } {
    try {
      const parsed = new URL(url);
      const domain = parsed.hostname.toLowerCase();
      const trustedDomains = [
        'aws.amazon.com',
        'credly.com',
        'coursera.org',
        'nptel.ac.in',
        'naanmudhalvan.tn.gov.in',
        'verify.tnsdc.in',
        'hackerrank.com',
        'leetcode.com',
        'microsoft.com',
        'cloud.google.com',
        'udemy.com',
      ];

      const isTrusted = trustedDomains.some(t => domain.endsWith(t) || t.endsWith(domain));
      return { valid: isTrusted, domain };
    } catch (e) {
      return { valid: false, domain: 'invalid' };
    }
  }

  private extractDomain(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return 'unknown';
    }
  }
}
