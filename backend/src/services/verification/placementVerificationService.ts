import { prisma } from '../../config/prisma.js';

export class PlacementVerificationService {
  public normalizeCompanyName(name: string): string {
    if (!name) return 'Unknown Company';
    let clean = name.trim().toLowerCase();
    clean = clean.replace(/\b(inc|ltd|limited|corp|corporation|pvt|private|india|technologies|solutions|services|tech|systems)\b/gi, '');
    clean = clean.replace(/[^a-z0-9]/g, '');
    if (clean.includes('google')) return 'Google';
    if (clean.includes('amazon') || clean.includes('aws')) return 'Amazon';
    if (clean.includes('microsoft')) return 'Microsoft';
    if (clean.includes('tcs') || clean.includes('tata')) return 'TCS';
    if (clean.includes('infosys')) return 'Infosys';
    if (clean.includes('wipro')) return 'Wipro';
    if (clean.includes('zoho')) return 'Zoho';
    if (clean.includes('freshworks')) return 'Freshworks';
    return name.trim();
  }

  public async submitPlacementClaim(params: {
    profileId: string;
    companyName: string;
    roleTitle: string;
    packageLpa?: number;
    offerLetterUrl?: string;
    joiningLetterUrl?: string;
  }) {
    const normalized = this.normalizeCompanyName(params.companyName);

    // Upsert company
    let company = await prisma.company.findUnique({ where: { normalizedName: normalized.toLowerCase() } });
    if (!company) {
      company = await prisma.company.create({
        data: {
          name: normalized,
          normalizedName: normalized.toLowerCase(),
          tier: params.packageLpa && params.packageLpa >= 12 ? 'Tier 1' : 'Tier 2',
        },
      });
    }

    const claim = await prisma.placementClaim.create({
      data: {
        profileId: params.profileId,
        companyName: params.companyName,
        companyId: company.id,
        roleTitle: params.roleTitle,
        packageLpa: params.packageLpa || 6.5,
        offerLetterUrl: params.offerLetterUrl,
        joiningLetterUrl: params.joiningLetterUrl,
        claimStatus: 'PENDING_VERIFICATION',
      },
    });

    return claim;
  }

  public async verifyPlacementClaim(claimId: string, officerUserId: string, action: 'VERIFY' | 'REJECT', reason?: string) {
    const claim = await prisma.placementClaim.findUnique({ where: { id: claimId } });
    if (!claim) {
      throw new Error('Placement claim not found');
    }

    const updated = await prisma.placementClaim.update({
      where: { id: claimId },
      data: {
        claimStatus: action === 'VERIFY' ? 'VERIFIED' : 'REJECTED',
        verifiedBy: officerUserId,
        verifiedAt: new Date(),
        rejectionReason: reason || null,
      },
    });

    return updated;
  }
}
