'use client';

import React, { useState } from 'react';
import { Award, Check, X, Clock, Filter, Search, RefreshCw, ChevronRight } from 'lucide-react';

interface ApprovalItem {
  id: string;
  studentName: string;
  naanId: string;
  type: 'project' | 'certification';
  itemTitle: string;
  submittedDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  details: string;
}

export default function FacultyApprovalsPage() {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');

  const [items, setItems] = useState<ApprovalItem[]>([
    {
      id: '1',
      studentName: 'Sanjay Nathan',
      naanId: 'NM-2026-441209',
      type: 'project',
      itemTitle: 'Hospital Management System - MERN Stack',
      submittedDate: '2026-07-28',
      status: 'PENDING',
      details: 'Full stack web application with patient scheduling, doctor appointment, and billing module.',
    },
    {
      id: '2',
      studentName: 'Deepika S',
      naanId: 'NM-2026-553872',
      type: 'certification',
      itemTitle: 'Naan Mudhalvan Advanced Data Science Module',
      submittedDate: '2026-07-29',
      status: 'PENDING',
      details: 'Issued by TNSDC. Covers Python for ML, Pandas, Numpy, and Scikit-learn.',
    },
    {
      id: '3',
      studentName: 'Murugan R',
      naanId: 'NM-2026-773211',
      type: 'project',
      itemTitle: 'Distributed Inventory Tracker with Redis',
      submittedDate: '2026-07-27',
      status: 'PENDING',
      details: 'Microservice-based inventory management with real-time stock sync via Redis pub/sub.',
    },
    {
      id: '4',
      studentName: 'Aravind Kumar',
      naanId: 'NM-2026-882341',
      type: 'project',
      itemTitle: 'AI Smart Traffic Management System',
      submittedDate: '2026-07-20',
      status: 'APPROVED',
      details: 'YOLOv8 traffic CV pipeline with FastAPI backend — Tier 1 quality project.',
    },
    {
      id: '5',
      studentName: 'Kavitha R',
      naanId: 'NM-2026-993120',
      type: 'certification',
      itemTitle: 'AWS Certified Cloud Practitioner',
      submittedDate: '2026-07-18',
      status: 'APPROVED',
      details: 'Official AWS cert verified via credential ID.',
    },
  ]);

  const handleApprove = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'APPROVED' } : i));
  };

  const handleReject = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'REJECTED' } : i));
  };

  const filtered = items.filter(i => {
    const matchesFilter = filter === 'ALL' || i.status === filter;
    const matchesSearch = !searchQuery ||
      i.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.itemTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = items.filter(i => i.status === 'PENDING').length;
  const approvedCount = items.filter(i => i.status === 'APPROVED').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
            <Award className="w-6 h-6 text-amber-400" />
            <span>Portfolio Approval Workflow</span>
          </h1>
          <p className="text-xs text-slate-400">Review and approve student projects and certifications for portfolio verification.</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-amber-950 text-amber-300 border border-amber-800 px-3 py-1 rounded-full font-semibold">
            {pendingCount} Pending Review
          </span>
          <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-full font-semibold">
            {approvedCount} Approved
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name or item title..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex rounded-xl overflow-hidden border border-slate-800">
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 text-xs font-semibold transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="glass-card p-12 rounded-2xl border border-slate-800 text-center space-y-3">
            <Filter className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-slate-400 text-sm font-medium">No items match your filter</p>
            <button onClick={() => { setFilter('ALL'); setSearchQuery(''); }} className="text-xs text-blue-400 hover:text-blue-300">
              Clear filters
            </button>
          </div>
        )}

        {filtered.map((item) => (
          <div
            key={item.id}
            className={`glass-card p-5 rounded-2xl border transition-all ${
              item.status === 'PENDING'
                ? 'border-amber-900/50 bg-amber-950/10'
                : item.status === 'APPROVED'
                ? 'border-emerald-900/50 bg-emerald-950/10'
                : 'border-rose-900/50 bg-rose-950/10 opacity-70'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${
                    item.type === 'project'
                      ? 'bg-blue-950 text-blue-300 border-blue-800'
                      : 'bg-indigo-950 text-indigo-300 border-indigo-800'
                  }`}>
                    {item.type}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${
                    item.status === 'PENDING'
                      ? 'bg-amber-950 text-amber-300 border-amber-800'
                      : item.status === 'APPROVED'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-rose-950 text-rose-300 border-rose-800'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-100 text-sm">{item.itemTitle}</h3>
                <p className="text-xs text-slate-400">{item.details}</p>

                <div className="flex items-center space-x-4 text-xs pt-1">
                  <span className="text-slate-300 font-medium">{item.studentName}</span>
                  <span className="text-slate-500 font-mono">{item.naanId}</span>
                  <span className="text-slate-500 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Submitted {item.submittedDate}</span>
                  </span>
                </div>
              </div>

              {item.status === 'PENDING' && (
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleReject(item.id)}
                    className="px-3 py-1.5 bg-rose-950/50 hover:bg-rose-950 text-rose-300 text-xs font-semibold rounded-xl border border-rose-900 flex items-center space-x-1.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-colors shadow-lg shadow-emerald-600/20"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
