'use client';

import React, { useState } from 'react';
import { Sparkles, Filter, Search, TrendingUp, Users, Star, Download, ChevronDown } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function PlacementReadinessPage() {
  const [minScore, setMinScore] = useState(0);
  const [dept, setDept] = useState('ALL');

  const trendData = [
    { month: 'Jan', eligibleCount: 280, avgScore: 75 },
    { month: 'Feb', eligibleCount: 310, avgScore: 78 },
    { month: 'Mar', eligibleCount: 340, avgScore: 80 },
    { month: 'Apr', eligibleCount: 370, avgScore: 82 },
    { month: 'May', eligibleCount: 390, avgScore: 83 },
    { month: 'Jun', eligibleCount: 380, avgScore: 84.4 },
  ];

  const readinessSegments = [
    { label: 'Tier-1 Ready (90%+)', count: 45, color: '#10b981', pct: '10%' },
    { label: 'Tier-1 Eligible (80–89%)', count: 145, color: '#3b82f6', pct: '32%' },
    { label: 'Tier-2 Ready (70–79%)', count: 145, color: '#8b5cf6', pct: '32%' },
    { label: 'Upskilling Needed (<70%)', count: 115, color: '#f59e0b', pct: '26%' },
  ];

  const allStudents = [
    { name: 'Kavitha R', dept: 'IT', score: 92, cgpa: 9.2, projects: 5, certs: 7, tier: 'Tier-1 Ready' },
    { name: 'Aravind Kumar', dept: 'CSE', score: 88, cgpa: 9.4, projects: 4, certs: 5, tier: 'Tier-1 Eligible' },
    { name: 'Sanjay Nathan', dept: 'ECE', score: 85, cgpa: 8.9, projects: 5, certs: 6, tier: 'Tier-1 Eligible' },
    { name: 'Deepika S', dept: 'CSE', score: 83, cgpa: 8.7, projects: 4, certs: 4, tier: 'Tier-2 Ready' },
    { name: 'Murugan R', dept: 'IT', score: 80, cgpa: 8.5, projects: 3, certs: 4, tier: 'Tier-2 Ready' },
    { name: 'Priya V', dept: 'EEE', score: 76, cgpa: 8.1, projects: 2, certs: 3, tier: 'Tier-2 Ready' },
  ];

  const filteredStudents = allStudents.filter(
    s => s.score >= minScore && (dept === 'ALL' || s.dept === dept)
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span>Placement Eligibility Analytics</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Predictive readiness scoring, tier distribution, and trend forecasting for corporate drives.</p>
        </div>
      </div>

      {/* Readiness Tier Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {readinessSegments.map((seg, idx) => (
          <div key={idx} className="glass-card p-5 rounded-2xl space-y-2">
            <div className="flex justify-between items-start">
              <p className="text-xs text-slate-700 dark:text-slate-400 font-bold leading-tight">{seg.label}</p>
              <span className="text-xs font-black" style={{ color: seg.color }}>{seg.pct}</span>
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{seg.count}</h3>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: seg.pct, backgroundColor: seg.color }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Trend Area Chart */}
      <div className="glass-card p-6 rounded-2xl space-y-3">
        <h3 className="font-bold text-slate-900 dark:text-slate-100">Placement Eligibility Trend (Jan–Jun 2026)</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="countGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="eligibleCount" stroke="#10b981" fill="url(#countGrad)" strokeWidth={2.5} name="Eligible Students" />
              <Area type="monotone" dataKey="avgScore" stroke="#3b82f6" fill="url(#scoreGrad)" strokeWidth={2.5} name="Avg Score %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interactive Filter Table */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="font-bold text-slate-900 dark:text-slate-100">Student Readiness Filter</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center space-x-2 text-xs">
              <label className="text-slate-700 dark:text-slate-400 font-bold">Min Score:</label>
              <select
                value={minScore}
                onChange={e => setMinScore(Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-900 dark:text-slate-200 font-bold focus:outline-none"
              >
                <option value={0}>All Scores</option>
                <option value={70}>70%+ (Tier-2)</option>
                <option value={80}>80%+ (Tier-1 Eligible)</option>
                <option value={90}>90%+ (Tier-1 Ready)</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <label className="text-slate-700 dark:text-slate-400 font-bold">Dept:</label>
              <select
                value={dept}
                onChange={e => setDept(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-900 dark:text-slate-200 font-bold focus:outline-none"
              >
                <option value="ALL">All Depts</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 text-[10px] font-bold uppercase">
              <tr>
                <th className="p-3">Student Name</th>
                <th className="p-3">Dept</th>
                <th className="p-3">CGPA</th>
                <th className="p-3">Eligibility</th>
                <th className="p-3">Projects</th>
                <th className="p-3">Certs</th>
                <th className="p-3">Tier Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{s.name}</td>
                  <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">{s.dept}</td>
                  <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">{s.cgpa}</td>
                  <td className="p-3 font-black text-emerald-600 dark:text-emerald-400">{s.score}%</td>
                  <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">{s.projects}</td>
                  <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">{s.certs}</td>
                  <td className="p-3">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${
                      s.score >= 90 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' :
                      s.score >= 80 ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-800' :
                      'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300 border-violet-300 dark:border-violet-800'
                    }`}>
                      {s.tier}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-xs font-medium">No students match current filters</div>
          )}
        </div>
      </div>
    </div>
  );
}
