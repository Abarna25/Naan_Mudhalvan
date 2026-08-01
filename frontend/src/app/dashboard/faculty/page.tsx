'use client';

import React, { useState } from 'react';
import { UserCheck, Award, AlertTriangle, Check, X, Search, Filter } from 'lucide-react';

export default function FacultyDashboardPage() {
  const [students, setStudents] = useState([
    { id: '1', name: 'Aravind Kumar', cgpa: 9.4, projects: 4, certs: 5, score: 88, status: 'APPROVED' },
    { id: '2', name: 'Kavitha R', cgpa: 9.2, projects: 3, certs: 4, score: 92, status: 'APPROVED' },
    { id: '3', name: 'Sanjay Nathan', cgpa: 8.9, projects: 3, certs: 3, score: 85, status: 'PENDING' },
    { id: '4', name: 'Praveen S', cgpa: 7.1, projects: 1, certs: 1, score: 62, status: 'NEEDS_INTERVENTION' },
  ]);

  const handleApprove = (id: string) => {
    setStudents(students.map(s => s.id === id ? { ...s, status: 'APPROVED' } : s));
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
            <UserCheck className="w-6 h-6 text-blue-400" />
            <span>Faculty Monitoring & Portfolio Approval Portal</span>
          </h1>
          <p className="text-xs text-slate-400">Department: Computer Science & Engineering | Total Students: 124</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs bg-blue-950 text-blue-300 border border-blue-800 px-3 py-1 rounded-full font-medium">
            92% Portfolios Approved
          </span>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Students</span>
          <h3 className="text-3xl font-black text-white mt-1">124</h3>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">Average Eligibility Score</span>
          <h3 className="text-3xl font-black text-emerald-400 mt-1">84.5%</h3>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">Pending Approvals</span>
          <h3 className="text-3xl font-black text-amber-400 mt-1">6</h3>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">Intervention Needed</span>
          <h3 className="text-3xl font-black text-rose-400 mt-1">4</h3>
        </div>
      </div>

      {/* Roster Table */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-100 text-base">Student Portfolio Verification Queue</h3>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search student..."
                className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="p-3">Student Name</th>
                <th className="p-3">CGPA</th>
                <th className="p-3">Projects</th>
                <th className="p-3">Certifications</th>
                <th className="p-3">Eligibility Score</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-semibold text-slate-100">{s.name}</td>
                  <td className="p-3 font-mono">{s.cgpa}</td>
                  <td className="p-3">{s.projects}</td>
                  <td className="p-3">{s.certs}</td>
                  <td className="p-3 font-bold text-emerald-400">{s.score}%</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      s.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      s.status === 'PENDING' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    {s.status === 'PENDING' && (
                      <button
                        onClick={() => handleApprove(s.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-medium flex items-center space-x-1 inline-flex"
                      >
                        <Check className="w-3 h-3" />
                        <span>Approve</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
