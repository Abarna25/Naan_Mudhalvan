'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import {
  Sparkles,
  Code,
  FileText,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { TrustCenter } from '@/components/trust/TrustCenter';
import { VerificationBadge } from '@/components/trust/VerificationBadge';
import { SkillAssessmentModal } from '@/components/skills/SkillAssessmentModal';

export default function StudentDashboardPage() {
  const { user } = useAuthStore();

  const [trustData, setTrustData] = useState<any>(null);
  const [selectedSkillForAssessment, setSelectedSkillForAssessment] = useState<{ id: string; name: string } | null>(null);

  const fetchTrustData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/student/trust-center', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setTrustData(json.data);
      }
    } catch (e) {
      console.error('Failed to fetch trust data', e);
    }
  };

  useEffect(() => {
    fetchTrustData();
  }, []);

  const radarData = [
    { subject: 'Technical Readiness', score: 90, fullMark: 100 },
    { subject: 'Project Strength', score: 94, fullMark: 100 },
    { subject: 'Coding Readiness', score: 86, fullMark: 100 },
    { subject: 'Communication', score: 80, fullMark: 100 },
    { subject: 'Data Confidence', score: trustData?.overallDataConfidence || 96, fullMark: 100 },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 dark:from-blue-950 dark:via-indigo-950 dark:to-slate-950 border border-blue-200 dark:border-blue-500/20 p-6 md:p-8 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                Naan Mudhalvan Student Portal
              </span>
              <span className="text-xs text-blue-100 font-mono font-semibold">ID: {user?.naanMudhalvanId || 'NM-2026-882341'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Welcome back, {user?.name || 'Aravind Kumar'}! 👋
              <VerificationBadge status={trustData?.identityVerified ? 'VERIFIED' : 'SELF_DECLARED'} size="sm" />
            </h1>
            <p className="text-blue-100 dark:text-slate-300 text-sm max-w-2xl font-medium">
              Every claim on your profile is verified against institutional records, GitHub commit analysis, EasyOCR, or skill assessments.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard/student/eligibility"
              className="px-4 py-2.5 rounded-xl bg-white text-blue-800 font-bold text-xs hover:bg-slate-100 transition-all shadow-md flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>View XAI Breakdown</span>
            </Link>
            <Link
              href="/dashboard/student/portfolio"
              className="px-4 py-2.5 rounded-xl bg-blue-900/60 hover:bg-blue-900/80 text-white font-semibold text-xs border border-blue-400/30 transition-all flex items-center space-x-2"
            >
              <Code className="w-4 h-4 text-blue-300" />
              <span>Public Portfolio</span>
            </Link>
          </div>
        </div>
      </div>

      {/* TRUST CENTER CARD */}
      <TrustCenter
        dataConfidenceScore={trustData?.overallDataConfidence || 96}
        riskLevel={trustData?.fraudRisk?.riskLevel || 'LOW'}
        identityVerified={trustData?.identityVerified ?? true}
        academicVerified={trustData?.academicVerified ?? true}
        certificateVerificationRate={trustData?.certificateVerificationRate || '2/2'}
        projectVerificationRate={trustData?.projectVerificationRate || '2/2'}
        skillVerificationRate={trustData?.skillVerificationRate || '6/6'}
        scores={trustData?.scores || { identity: 100, academic: 100, skills: 94, projects: 91, certifications: 100, placement: 100, codingActivity: 95 }}
        explanation={trustData?.explanation || []}
        academicIdentity={trustData?.academicIdentity}
      />

      {/* Primary Dual Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Employability Score */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Employability Score</p>
              <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1.5">88%</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-3 font-medium">Estimated career & technical readiness</p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '88%' }}></div>
          </div>
        </div>

        {/* Metric 2: Data Confidence Score */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Data Confidence Score</p>
              <h3 className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1.5">{trustData?.overallDataConfidence || 96} / 100</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-3 font-medium">Reliability of profile claims evidence</p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${trustData?.overallDataConfidence || 96}%` }}></div>
          </div>
        </div>

        {/* ATS Resume Score */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">ATS Resume Score</p>
              <h3 className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1.5">85%</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-3 font-medium">Software Engineer ATS Template</p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Profile Completion</p>
              <h3 className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1.5">95%</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-3 font-medium">All major sections verified</p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '95%' }}></div>
          </div>
        </div>
      </div>

      {/* Verified Skills & Assessment CTA Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Skills Confidence & Evidence Badges</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Claim vs Demonstrated Skill Breakdown</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-white text-sm">Python</span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Assessment: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">92%</strong></p>
            </div>
            <VerificationBadge status="HIGH_CONFIDENCE" evidenceScore={94} size="sm" />
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-white text-sm">React.js</span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Verified GitHub Project</p>
            </div>
            <VerificationBadge status="VERIFIED" evidenceScore={88} size="sm" />
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-white text-sm">AWS</span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Claimed: <strong className="text-amber-600 dark:text-amber-400 font-bold">Self-Declared</strong></p>
            </div>
            <button
              onClick={() => setSelectedSkillForAssessment({ id: 'aws-skill-id', name: 'AWS' })}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Take Assessment
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Section: Radar Spectrum */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Readiness & Data Confidence Spectrum</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Multi-dimensional capability & trust benchmark</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#94a3b8" />
              <PolarAngleAxis dataKey="subject" stroke="#334155" tick={{ fontSize: 11, fontWeight: 'bold' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" />
              <Radar name="Student" dataKey="score" stroke="#2563eb" fill="#2563eb" fillOpacity={0.35} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Skill Assessment Modal */}
      {selectedSkillForAssessment && (
        <SkillAssessmentModal
          studentSkillId={selectedSkillForAssessment.id}
          skillName={selectedSkillForAssessment.name}
          onClose={() => setSelectedSkillForAssessment(null)}
          onSuccess={() => {
            fetchTrustData();
          }}
        />
      )}
    </div>
  );
}
