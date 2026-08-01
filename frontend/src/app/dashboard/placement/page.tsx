'use client';

import React from 'react';
import { Briefcase, Download, TrendingUp, Users, Award, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export default function PlacementDashboardPage() {
  const deptData = [
    { department: 'CSE', ready: 108, total: 120 },
    { department: 'IT', ready: 95, total: 110 },
    { department: 'ECE', ready: 92, total: 115 },
    { department: 'EEE', ready: 85, total: 105 },
  ];

  const pieData = [
    { name: 'Tier 1 Ready (90%+)', value: 145, color: '#10b981' },
    { name: 'Tier 2 Ready (80-89%)', value: 235, color: '#3b82f6' },
    { name: 'Requires Upskilling (<80%)', value: 70, color: '#f59e0b' },
  ];

  const handleExportCSV = () => {
    window.open('http://localhost:5005/api/v1/placement/export-csv', '_blank');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
            <Briefcase className="w-6 h-6 text-emerald-400" />
            <span>Placement Officer Analytics & Recruitment Hub</span>
          </h1>
          <p className="text-xs text-slate-400">Institutional Placement Readiness, Company Eligibility Filtering, and CSV Reporting.</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export Excel / CSV Report</span>
        </button>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Candidates</span>
          <h3 className="text-3xl font-black text-white mt-1">450</h3>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">Placement Readiness Rate</span>
          <h3 className="text-3xl font-black text-emerald-400 mt-1">84.4%</h3>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">Tier-1 Company Eligible</span>
          <h3 className="text-3xl font-black text-blue-400 mt-1">145</h3>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">Avg Employment Score</span>
          <h3 className="text-3xl font-black text-indigo-400 mt-1">82.8%</h3>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Placement Readiness Bar Chart */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-100 text-base">Department Readiness Comparison</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData}>
                <XAxis dataKey="department" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Bar dataKey="ready" fill="#10b981" radius={[4, 4, 0, 0]} name="Placement Ready" />
                <Bar dataKey="total" fill="#334155" radius={[4, 4, 0, 0]} name="Total Enrolled" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tier 1 vs Tier 2 Eligibility Pie */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-100 text-base">Corporate Placement Tier Distribution</h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
