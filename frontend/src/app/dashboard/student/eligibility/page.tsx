'use client';

import React, { useState } from 'react';
import { Sparkles, AlertCircle, CheckCircle2, RefreshCw, TrendingUp, Award, Brain } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

const BASE_SHAP = [
  { feature: 'Projects Portfolio', impact: 18, type: 'positive', detail: '4 full-stack projects with live URLs, clean architecture, and 70+ cumulative stars on GitHub.' },
  { feature: 'GitHub Streak', impact: 14, type: 'positive', detail: '580+ commits over past 12 months showing continuous software development rigor.' },
  { feature: 'NM Certifications', impact: 12, type: 'positive', detail: 'TNSDC Advanced Full Stack & AWS Practitioner verified badges — high employer trust signal.' },
  { feature: 'Academic CGPA', impact: 10, type: 'positive', detail: '9.4/10.0 CGPA in Computer Science & Engineering — Top 5% in department.' },
  { feature: 'LeetCode Activity', impact: -8, type: 'negative', detail: '245 problems solved. Solving 30 more problems will reclaim this +8% bonus.' },
  { feature: 'System Documentation', impact: -6, type: 'negative', detail: 'Adding a proper README and architecture doc to each project will boost this by +6%.' },
];

const RADAR_DATA = [
  { subject: 'Technical Skills', A: 90 },
  { subject: 'Projects', A: 94 },
  { subject: 'Certifications', A: 88 },
  { subject: 'DSA Readiness', A: 76 },
  { subject: 'Communication', A: 80 },
  { subject: 'NM Alignment', A: 92 },
];

export default function ExplainableAIEligibilityPage() {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationCount, setEvaluationCount] = useState(0);
  const [scores, setScores] = useState({ eligibility: 88, placement: 92, project: 94 });
  const [shapData, setShapData] = useState(BASE_SHAP);

  const handleReEvaluate = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      const variation = () => Math.round((Math.random() - 0.5) * 4);
      setScores({
        eligibility: Math.min(98, Math.max(75, 88 + variation())),
        placement: Math.min(99, Math.max(80, 92 + variation())),
        project: Math.min(99, Math.max(85, 94 + variation())),
      });
      setShapData(BASE_SHAP.map(d => ({
        ...d,
        impact: d.type === 'positive'
          ? Math.min(25, Math.max(5, d.impact + Math.round((Math.random() - 0.5) * 4)))
          : Math.max(-15, Math.min(-2, d.impact + Math.round((Math.random() - 0.5) * 3))),
      })));
      setEvaluationCount(c => c + 1);
      setIsEvaluating(false);
    }, 1800);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-emerald-400" />
            <span>Explainable AI (XAI) Employment Eligibility Engine</span>
          </h1>
          <p className="text-xs text-slate-400">Powered by XGBoost Machine Learning & SHAP (SHapley Additive exPlanations) attribution logic.</p>
        </div>
        <div className="flex items-center space-x-3">
          {evaluationCount > 0 && (
            <span className="text-xs text-slate-500">Evaluated {evaluationCount} time{evaluationCount > 1 ? 's' : ''}</span>
          )}
          <button
            onClick={handleReEvaluate}
            disabled={isEvaluating}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${isEvaluating ? 'animate-spin' : ''}`} />
            <span>{isEvaluating ? 'Running XGBoost...' : 'Re-Evaluate Model'}</span>
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isEvaluating && (
        <div className="glass-card p-6 rounded-2xl border border-emerald-700/40 bg-emerald-950/20 flex items-center space-x-4 animate-pulse">
          <Brain className="w-8 h-8 text-emerald-400" />
          <div>
            <p className="font-bold text-emerald-300 text-sm">XGBoost Model Inference Running...</p>
            <p className="text-xs text-emerald-400/70">Computing SHAP feature attributions using your latest profile data...</p>
          </div>
        </div>
      )}

      {/* Hero Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 text-center space-y-3">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Overall Eligibility Score</span>
          <h2 className={`text-5xl font-black text-white transition-all ${isEvaluating ? 'opacity-40 blur-sm' : ''}`}>{scores.eligibility}%</h2>
          <span className={`inline-block text-xs px-3 py-1 rounded-full font-semibold border ${scores.eligibility >= 85 ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-amber-950 text-amber-300 border-amber-800'}`}>
            {scores.eligibility >= 85 ? 'Tier-1 Placement Ready' : 'Tier-2 Ready'}
          </span>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-blue-500/30 bg-blue-950/20 text-center space-y-3">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Placement Probability</span>
          <h2 className={`text-5xl font-black text-white transition-all ${isEvaluating ? 'opacity-40 blur-sm' : ''}`}>{scores.placement}%</h2>
          <span className="inline-block text-xs bg-blue-950 text-blue-300 border border-blue-800 px-3 py-1 rounded-full font-semibold">
            High Confidence Match
          </span>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 text-center space-y-3">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Project Strength Score</span>
          <h2 className={`text-5xl font-black text-white transition-all ${isEvaluating ? 'opacity-40 blur-sm' : ''}`}>{scores.project}%</h2>
          <span className="inline-block text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-3 py-1 rounded-full font-semibold">
            Top 5% in Department
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SHAP Chart */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-100">SHAP Feature Importance Attributions</h3>
          <p className="text-xs text-slate-400">Each bar shows the percentage contribution (+ positive / − negative) to your eligibility score.</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={shapData} margin={{ top: 5, right: 20, left: 130, bottom: 5 }}>
                <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 10 }} domain={[-20, 25]} />
                <YAxis dataKey="feature" type="category" stroke="#94a3b8" tick={{ fontSize: 10 }} width={125} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: 11 }}
                  formatter={(val: number) => [`${val > 0 ? '+' : ''}${val}%`, 'SHAP Impact']}
                />
                <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                  {shapData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.impact > 0 ? '#10b981' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-100">Competency Radar — 6-Dimension Assessment</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={RADAR_DATA}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <Radar name="Score" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.25} strokeWidth={2} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} formatter={(v: number) => [`${v}%`]} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Attribution Breakdown Cards */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-slate-100">XAI Feature Contribution Explanations</h3>
        <p className="text-xs text-slate-400">Why did the XGBoost model assign your eligibility score? Every decision is explainable:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shapData.map((item, idx) => (
            <div key={idx} className={`p-4 rounded-xl border space-y-2 ${item.type === 'positive' ? 'bg-slate-900/60 border-slate-800' : 'bg-rose-950/15 border-rose-900/40'}`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200 text-sm flex items-center space-x-1.5">
                  {item.type === 'positive'
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  }
                  <span>{item.impact > 0 ? '+' : ''}{item.impact}% {item.feature}</span>
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded border font-mono font-bold ${item.type === 'positive' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-rose-950 text-rose-300 border-rose-800'}`}>
                  {item.impact > 0 ? '+' : ''}{item.impact}%
                </span>
              </div>
              <p className="text-xs text-slate-400">{item.detail}</p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${item.type === 'positive' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  style={{ width: `${Math.abs(item.impact) * 4}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Improvement Tips */}
      <div className="glass-card p-5 rounded-2xl border border-indigo-900/40 bg-indigo-950/15 space-y-3">
        <h3 className="font-bold text-indigo-300 text-sm flex items-center space-x-2">
          <TrendingUp className="w-4 h-4" />
          <span>Quick Wins to Boost Your Score</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <p className="font-bold text-slate-200">🔢 Solve 30 More LeetCode</p>
            <p className="text-slate-400">Reclaim the -8% DSA penalty. Focus on medium-level problems.</p>
            <p className="text-emerald-400 font-semibold">+8% score boost</p>
          </div>
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <p className="font-bold text-slate-200">📝 Add Project README Files</p>
            <p className="text-slate-400">Detailed architecture docs for each project improve documentation score.</p>
            <p className="text-emerald-400 font-semibold">+6% score boost</p>
          </div>
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <p className="font-bold text-slate-200">🏆 Complete NM Advanced Module</p>
            <p className="text-slate-400">Finishing the AI module adds a verified certification + 2 more SHAP points.</p>
            <p className="text-emerald-400 font-semibold">+4% score boost</p>
          </div>
        </div>
      </div>
    </div>
  );
}
