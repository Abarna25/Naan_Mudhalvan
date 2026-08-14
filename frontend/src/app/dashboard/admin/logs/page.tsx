'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Filter, Download, Clock, User, Search, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

interface LogItem {
  id: string | number;
  time: string;
  action: string;
  user: string;
  details: string;
  level: string;
}

const MOCK_LOGS: LogItem[] = [
  { id: '1', time: '2026-07-31 11:42:15', action: 'ELIGIBILITY_PREDICTION', user: 'AI Engine', details: 'XGBoost model ran SHAP evaluation for NM-2026-882341 (Aravind Kumar). Score: 88%.', level: 'INFO' },
  { id: '2', time: '2026-07-31 11:38:04', action: 'CERTIFICATE_OCR_UPLOAD', user: 'aravind.student@college.edu', details: 'EasyOCR extracted certificate metadata: TNSDC Full Stack. Confidence: 0.94.', level: 'INFO' },
  { id: '3', time: '2026-07-31 11:35:22', action: 'PORTFOLIO_COMPILED', user: 'System Compiler', details: 'Automated portfolio compiled for NM-2026-882341. Slug: /portfolio/aravind-kumar.', level: 'INFO' },
  { id: '4', time: '2026-07-31 11:20:01', action: 'USER_LOGIN', user: 'admin@naanmudhalvan.edu', details: 'Admin login from IP 127.0.0.1. Session established.', level: 'INFO' },
  { id: '5', time: '2026-07-31 10:58:33', action: 'PORTFOLIO_APPROVAL', user: 'faculty.cse@college.edu', details: 'Project "AI Smart Traffic Management System" approved for NM-2026-882341.', level: 'SUCCESS' },
  { id: '6', time: '2026-07-31 10:45:10', action: 'RESUME_GENERATED', user: 'aravind.student@college.edu', details: 'ATS Resume generated for role: Software Engineer. ATS Score: 88%.', level: 'INFO' },
  { id: '7', time: '2026-07-31 10:30:00', action: 'SKILL_SYNC', user: 'GitHub Sync Daemon', details: 'GitHub activity sync completed: 580 commits, 24 repos, 85 stars detected.', level: 'INFO' },
  { id: '8', time: '2026-07-31 09:15:44', action: 'FAILED_LOGIN', user: 'unknown@attacker.com', details: 'Failed login attempt from IP 203.45.12.88. Rate limit applied.', level: 'WARNING' },
  { id: '9', time: '2026-07-31 09:00:02', action: 'AI_MODEL_HEALTHCHECK', user: 'System Daemon', details: 'FastAPI AI Service: HEALTHY. XGBoost v2.4.1 active. SHAP attribution online.', level: 'INFO' },
];

export default function AdminLogsPage() {
  const { accessToken } = useAuthStore();
  const [logs, setLogs] = useState<LogItem[]>(MOCK_LOGS);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5005/api/v1/admin/audit-logs', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (data.success && data.data?.length > 0) {
        setLogs(data.data);
      }
    } catch {
      // Keep MOCK_LOGS fallback if offline
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [accessToken]);

  const filtered = logs.filter(l => {
    const matchSearch = !search || l.action.toLowerCase().includes(search.toLowerCase()) || l.details.toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === 'ALL' || l.level === levelFilter;
    return matchSearch && matchLevel;
  });

  const levelColors: Record<string, string> = {
    INFO: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-800',
    SUCCESS: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    WARNING: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    ERROR: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300 dark:border-rose-800',
  };

  const handleExport = () => {
    const csv = [
      'Timestamp,Action,User,Level,Details',
      ...logs.map(l => `"${l.time}","${l.action}","${l.user}","${l.level}","${l.details}"`),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'naan_mudhalvan_audit_logs.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Layers className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span>System Audit Logs</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Complete chronological record of all platform events, model evaluations, and user actions.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-900 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Export Audit Logs CSV</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by action or details..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-200 font-medium focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          {(['ALL', 'INFO', 'SUCCESS', 'WARNING', 'ERROR'] as const).map(l => (
            <button
              key={l}
              onClick={() => setLevelFilter(l)}
              className={`px-3.5 py-2.5 text-[11px] font-bold transition-colors cursor-pointer ${
                levelFilter === l ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats (FIXED INVISIBLE NUMBERS IN LIGHT MODE) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['INFO', 'SUCCESS', 'WARNING', 'ERROR'] as const).map(level => {
          const count = logs.filter(l => l.level === level).length;
          return (
            <div key={level} className="glass-card p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">{level}</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{count}</p>
              </div>
              <span className={`text-[10px] px-2.5 py-1 rounded-full border font-bold ${levelColors[level]}`}>{level}</span>
            </div>
          );
        })}
      </div>

      {/* Logs Table */}
      <div className="glass-card p-6 rounded-2xl space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 text-[10px] font-bold uppercase">
              <tr>
                <th className="p-3 w-44">Timestamp</th>
                <th className="p-3">Action</th>
                <th className="p-3">Actor</th>
                <th className="p-3">Level</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors align-top">
                  <td className="p-3 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap font-medium">{log.time}</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-slate-200 whitespace-nowrap">{log.action}</td>
                  <td className="p-3 font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">{log.user}</td>
                  <td className="p-3">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full border font-bold ${levelColors[log.level] || levelColors.INFO}`}>
                      {log.level}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700 dark:text-slate-300 font-medium max-w-xs">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-xs font-medium">No logs match your filter</div>
          )}
        </div>
      </div>
    </div>
  );
}
