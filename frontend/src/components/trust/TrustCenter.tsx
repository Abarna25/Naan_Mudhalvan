import React, { useState } from 'react';
import { Shield, Info, Lock } from 'lucide-react';
import { VerificationBadge } from './VerificationBadge';

export interface TrustCenterProps {
  dataConfidenceScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  identityVerified: boolean;
  academicVerified: boolean;
  certificateVerificationRate: string;
  projectVerificationRate: string;
  skillVerificationRate: string;
  scores: {
    identity: number;
    academic: number;
    skills: number;
    projects: number;
    certifications: number;
    placement: number;
    codingActivity: number;
  };
  explanation?: Array<{
    category: string;
    score: number;
    weightPct: number;
    status: string;
    details: string;
  }>;
  academicIdentity?: any;
}

export const TrustCenter: React.FC<TrustCenterProps> = ({
  dataConfidenceScore,
  riskLevel,
  identityVerified,
  academicVerified,
  certificateVerificationRate,
  projectVerificationRate,
  skillVerificationRate,
  scores,
  explanation = [],
  academicIdentity,
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden transition-colors">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Trust Center & Evidence Audit</h2>
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
                Anti-Fraud Engine Active
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Verified record architecture preventing unverified student claim inflation
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
        >
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          How Data Confidence is Calculated
        </button>
      </div>

      {/* Main Grid: Data Confidence Card & Institutional Identity Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Card 1: Data Confidence Score */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Overall Data Confidence</span>
              <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full ${
                riskLevel === 'LOW' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30' :
                riskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30' :
                'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30'
              }`}>
                {riskLevel} RISK
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-4xl font-black text-slate-900 dark:text-white">{dataConfidenceScore}</span>
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">/ 100</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-3">
              <div
                className={`h-full transition-all duration-500 ${
                  dataConfidenceScore >= 80 ? 'bg-emerald-500' :
                  dataConfidenceScore >= 60 ? 'bg-blue-500' : 'bg-amber-500'
                }`}
                style={{ width: `${dataConfidenceScore}%` }}
              ></div>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-4 leading-relaxed font-medium">
            Data Confidence reflects the percentage of student claims backed by institutional identity, GitHub analysis, EasyOCR, or faculty verification.
          </p>
        </div>

        {/* Card 2: Institutional Identity Status */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 md:col-span-2 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Identity Source: Institutional Academic System</span>
              </div>
              <VerificationBadge status={identityVerified ? 'VERIFIED' : 'SELF_DECLARED'} size="sm" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-bold uppercase">Roll Number</span>
                <span className="font-bold text-slate-900 dark:text-white">{academicIdentity?.rollNumber || '7376221CS101'}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-bold uppercase">Official Email</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200 truncate block">{academicIdentity?.institutionalEmail || 'student@college.edu'}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-bold uppercase">Department</span>
                <span className="font-bold text-slate-900 dark:text-white">{academicIdentity?.department || 'CSE'}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-bold uppercase">Official CGPA</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{academicIdentity?.cgpa || '8.5'} (Read-Only)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300 font-medium">
              <span>Certificates: <strong className="text-slate-900 dark:text-white font-bold">{certificateVerificationRate}</strong></span>
              <span>Projects: <strong className="text-slate-900 dark:text-white font-bold">{projectVerificationRate}</strong></span>
              <span>Skills: <strong className="text-slate-900 dark:text-white font-bold">{skillVerificationRate}</strong></span>
            </div>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">✓ Authoritative identity fields locked by backend</span>
          </div>
        </div>
      </div>

      {/* Modal: Data Confidence vs Employability Score Explanation */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Data Confidence Score vs Employability Score
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white font-bold">✕</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-blue-600 dark:text-blue-400 text-sm mb-1">EMPLOYABILITY SCORE</h4>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  Estimates career readiness and technical skill strength based on course performance, projects, and coding assessments.
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mb-1">DATA CONFIDENCE SCORE</h4>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  Measures the reliability of the underlying evidence. High employability with low confidence indicates unverified claims.
                </p>
              </div>
            </div>

            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mt-4">Evidence Weighting Breakdown</h4>
            <div className="space-y-2">
              {explanation.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-slate-200">{item.category} ({item.weightPct}%)</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">{item.details}</p>
                  </div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{item.score}/100</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-right">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition cursor-pointer"
              >
                Close Explanation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
