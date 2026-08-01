'use client';

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import {
  Sparkles,
  Award,
  Code,
  FileText,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Github,
  Check,
  ChevronRight,
  Zap,
  BookOpen
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';

export default function StudentDashboardPage() {
  const { user } = useAuthStore();

  const radarData = [
    { subject: 'Technical Readiness', score: 90, fullMark: 100 },
    { subject: 'Project Strength', score: 94, fullMark: 100 },
    { subject: 'Coding Readiness', score: 86, fullMark: 100 },
    { subject: 'Communication', score: 80, fullMark: 100 },
    { subject: 'Naan Mudhalvan Certs', score: 92, fullMark: 100 },
  ];

  const explainabilityData = [
    { feature: 'Strong Projects', impact: 18, color: '#10b981' },
    { feature: 'GitHub Activity', impact: 14, color: '#10b981' },
    { feature: 'NM Certifications', impact: 12, color: '#10b981' },
    { feature: 'Academic CGPA', impact: 10, color: '#3b82f6' },
    { feature: 'Data Structures Gap', impact: -8, color: '#f43f5e' },
    { feature: 'System Communication', impact: -6, color: '#f43f5e' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900 border border-blue-500/20 p-6 md:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Naan Mudhalvan Student Portal
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {user?.naanMudhalvanId}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl">
              Your profile is compiled with real-time GitHub, LeetCode, and Naan Mudhalvan certificate analytics. Explainable AI rates your placement readiness at <span className="font-bold text-emerald-400">88% (Tier-1 Eligible)</span>.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard/student/eligibility"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-600/30 flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>View XAI Breakdown</span>
            </Link>
            <Link
              href="/dashboard/student/portfolio"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-all flex items-center space-x-2"
            >
              <Code className="w-4 h-4 text-blue-400" />
              <span>Public Portfolio</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Primary Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Employment Eligibility Score */}
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Employment Score</p>
              <h3 className="text-3xl font-black text-emerald-400 mt-1">88%</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 flex items-center">
            <span className="text-emerald-400 font-semibold mr-1">+4%</span> vs last month assessment
          </p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: '88%' }}></div>
          </div>
        </div>

        {/* Skill Score */}
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verified Skill Score</p>
              <h3 className="text-3xl font-black text-blue-400 mt-1">92 / 100</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">6 Skills verified via Naan Mudhalvan</p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-blue-400 h-full rounded-full" style={{ width: '92%' }}></div>
          </div>
        </div>

        {/* ATS Resume Score */}
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ATS Resume Score</p>
              <h3 className="text-3xl font-black text-indigo-400 mt-1">85%</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">Software Engineer ATS Template</p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-indigo-400 h-full rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Profile Completion</p>
              <h3 className="text-3xl font-black text-amber-400 mt-1">95%</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">All major sections verified</p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: '95%' }}></div>
          </div>
        </div>
      </div>

      {/* Analytics Section: Radar Chart & SHAP Feature Attributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Readiness Spectrum */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-100 text-base">Readiness Spectrum Analysis</h3>
              <p className="text-xs text-slate-400">Multi-dimensional capability benchmark</p>
            </div>
            <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">
              Naan Mudhalvan Standard
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                <Radar name="Aravind" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Explainable AI (SHAP) Feature Contributions */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-100 text-base">Explainable AI (XAI) Attribution</h3>
              <p className="text-xs text-slate-400">XGBoost model key positive & negative drivers</p>
            </div>
            <span className="text-[11px] bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-800">
              SHAP Verified
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {explainabilityData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">{item.feature}</span>
                  <span className={item.impact > 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {item.impact > 0 ? `+${item.impact}%` : `${item.impact}%`}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.abs(item.impact) * 4}%`,
                      backgroundColor: item.color,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Action Hub & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-slate-100 text-base flex items-center space-x-2">
            <Zap className="w-4 h-4 text-blue-400" />
            <span>Automated Integrations</span>
          </h3>

          <div className="space-y-2">
            <Link
              href="/dashboard/student/profile"
              className="w-full p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-xs text-slate-200 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Github className="w-4 h-4 text-slate-300" />
                <span>Sync GitHub & LeetCode Activity</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>

            <Link
              href="/dashboard/student/profile"
              className="w-full p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-xs text-slate-200 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Award className="w-4 h-4 text-amber-400" />
                <span>EasyOCR Certificate Parser</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>

            <Link
              href="/dashboard/student/resume"
              className="w-full p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-xs text-slate-200 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Generate ATS-Friendly PDF Resume</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>
          </div>
        </div>

        {/* Recommended Next Actions */}
        <div className="glass-card p-6 rounded-2xl lg:col-span-2 space-y-4">
          <h3 className="font-bold text-slate-100 text-base flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Recommended Actions for 90%+ Tier-1 Score</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-800">High Impact</span>
                <span className="text-xs text-emerald-400 font-semibold">+6% Score</span>
              </div>
              <h4 className="font-semibold text-slate-200 text-sm">Solve 30 Array/String Problems on LeetCode</h4>
              <p className="text-xs text-slate-400">Pushes your LeetCode problem count to 275+ meeting tier-1 benchmark.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800">Naan Mudhalvan</span>
                <span className="text-xs text-emerald-400 font-semibold">+4% Score</span>
              </div>
              <h4 className="font-semibold text-slate-200 text-sm">Complete Cloud Native DevOps Assessment</h4>
              <p className="text-xs text-slate-400">Verifies Docker & Kubernetes skill badge directly on your profile.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
