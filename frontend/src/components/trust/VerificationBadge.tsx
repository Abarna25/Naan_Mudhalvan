import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Clock, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';

export type VerificationStatusType =
  | 'VERIFIED'
  | 'HIGH_CONFIDENCE'
  | 'PARTIALLY_VERIFIED'
  | 'MANUAL_REVIEW_REQUIRED'
  | 'SELF_DECLARED'
  | 'SUSPICIOUS'
  | 'REJECTED'
  | 'CREDENTIAL_REUSE_SUSPECTED';

interface VerificationBadgeProps {
  status: VerificationStatusType | string;
  evidenceScore?: number;
  evidenceSource?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  reason?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  status,
  evidenceScore,
  evidenceSource,
  verifiedBy,
  verifiedAt,
  reason,
  size = 'md',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getStatusConfig = () => {
    switch (status) {
      case 'VERIFIED':
      case 'HIGH_CONFIDENCE':
      case 'APPROVED':
        return {
          label: '✓ VERIFIED',
          bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30',
          icon: ShieldCheck,
          detailsTitle: 'Machine or Authoritative Verified Fact',
        };
      case 'PARTIALLY_VERIFIED':
        return {
          label: '◐ PARTIALLY VERIFIED',
          bg: 'bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400 border-blue-300 dark:border-blue-500/30',
          icon: CheckCircle2,
          detailsTitle: 'Supported by Partial Evidence',
        };
      case 'MANUAL_REVIEW_REQUIRED':
      case 'PENDING':
        return {
          label: '! MANUAL REVIEW',
          bg: 'bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400 border-amber-300 dark:border-amber-500/30',
          icon: Clock,
          detailsTitle: 'Awaiting Authorized Human Review',
        };
      case 'SUSPICIOUS':
      case 'CREDENTIAL_REUSE_SUSPECTED':
        return {
          label: '⚠ SUSPICIOUS',
          bg: 'bg-rose-100 text-rose-800 dark:bg-rose-500/10 dark:text-rose-400 border-rose-300 dark:border-rose-500/30',
          icon: AlertTriangle,
          detailsTitle: 'Flagged for Suspicious Evidence Patterns',
        };
      case 'REJECTED':
      case 'INVALID':
        return {
          label: '✕ REJECTED',
          bg: 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400 border-red-300 dark:border-red-500/30',
          icon: XCircle,
          detailsTitle: 'Verification Failed or Rejected',
        };
      case 'SELF_DECLARED':
      default:
        return {
          label: '○ SELF-DECLARED',
          bg: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
          icon: HelpCircle,
          detailsTitle: 'Unverified Student Claim',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  }[size];

  return (
    <div className="relative inline-block" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
      <span className={`inline-flex items-center gap-1.5 font-bold rounded-full border ${config.bg} ${sizeClasses} cursor-help transition-all duration-200 shadow-xs`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
        {evidenceScore !== undefined && (
          <span className="ml-1 opacity-80 border-l border-current pl-1.5 font-mono">{evidenceScore}/100</span>
        )}
      </span>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3.5 bg-slate-900 dark:bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 text-xs text-slate-100 pointer-events-none backdrop-blur-md">
          <p className="font-bold text-white flex items-center gap-1 mb-1">
            <Icon className="w-3.5 h-3.5 text-blue-400" />
            {config.detailsTitle}
          </p>
          <div className="space-y-1 text-slate-300 text-[11px]">
            {evidenceSource && <p><strong className="text-slate-400">Evidence Source:</strong> {evidenceSource}</p>}
            {verifiedBy && <p><strong className="text-slate-400">Verified By:</strong> {verifiedBy}</p>}
            {verifiedAt && <p><strong className="text-slate-400">Verified At:</strong> {new Date(verifiedAt).toLocaleDateString()}</p>}
            {reason && <p className="text-rose-300"><strong className="text-slate-400">Note:</strong> {reason}</p>}
            {!evidenceSource && !verifiedBy && (
              <p className="text-slate-400 italic">Every student claim requires verifiable evidence to reach VERIFIED state.</p>
            )}
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
        </div>
      )}
    </div>
  );
};
