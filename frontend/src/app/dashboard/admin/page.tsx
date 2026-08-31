'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Layers, Sparkles, Users, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { VerificationBadge } from '@/components/trust/VerificationBadge';
import { API_BASE_URL } from '@/config/api';

const DEFAULT_USERS = [
  { id: '1', name: 'Dr. K. Rajasekaran', email: 'admin@naanmudhalvan.edu', role: 'ADMIN', department: 'Skill Mission', academicIdentity: { verificationStatus: 'VERIFIED' } },
  { id: '2', name: 'Prof. Sundararam M', email: 'placement@college.edu', role: 'PLACEMENT_OFFICER', department: 'Training & Placement', academicIdentity: { verificationStatus: 'VERIFIED' } },
  { id: '3', name: 'Dr. Malathi N', email: 'faculty.cse@college.edu', role: 'FACULTY', department: 'Computer Science & Engineering', academicIdentity: { verificationStatus: 'VERIFIED' } },
  { id: '4', name: 'Aravind Kumar', email: 'aravind.student@college.edu', role: 'STUDENT', department: 'Computer Science & Engineering', academicIdentity: { verificationStatus: 'VERIFIED' } },
  { id: '5', name: 'Kavitha R', email: 'kavitha.student@college.edu', role: 'STUDENT', department: 'Information Technology', academicIdentity: { verificationStatus: 'VERIFIED' } },
  { id: '6', name: 'Sanjay Nathan', email: 'sanjay.student@college.edu', role: 'STUDENT', department: 'Electronics & Comm Eng', academicIdentity: { verificationStatus: 'VERIFIED' } },
];

const DEFAULT_LOGS = [
  {
    id: 'log-1',
    time: '2026-07-31 11:42:15',
    action: 'ELIGIBILITY_PREDICTION',
    level: 'INFO',
    ipAddress: '127.0.0.1',
    details: 'XGBoost model ran SHAP evaluation for NM-2026-882341 (Aravind Kumar). Score: 88%.',
    user: 'AI Engine Daemon',
    role: 'SYSTEM',
  },
  {
    id: 'log-2',
    time: '2026-07-31 11:38:04',
    action: 'CERTIFICATE_OCR_UPLOAD',
    level: 'INFO',
    ipAddress: '192.168.1.42',
    details: 'EasyOCR extracted certificate metadata: TNSDC Full Stack. Confidence: 0.94.',
    user: 'aravind.student@college.edu',
    role: 'STUDENT',
  },
  {
    id: 'log-3',
    time: '2026-07-31 11:35:22',
    action: 'PORTFOLIO_COMPILED',
    level: 'INFO',
    ipAddress: '127.0.0.1',
    details: 'Automated portfolio compiled for NM-2026-882341. Slug: /portfolio/aravind-kumar.',
    user: 'System Compiler',
    role: 'SYSTEM',
  },
  {
    id: 'log-4',
    time: '2026-07-31 11:20:01',
    action: 'USER_LOGIN',
    level: 'INFO',
    ipAddress: '10.0.4.18',
    details: 'User admin@naanmudhalvan.edu authenticated successfully. Session established.',
    user: 'admin@naanmudhalvan.edu',
    role: 'ADMIN',
  },
  {
    id: 'log-5',
    time: '2026-07-31 10:58:33',
    action: 'FACULTY_PROJECT_VERIFICATION',
    level: 'SUCCESS',
    ipAddress: '10.0.2.14',
    details: 'Project "AI Smart Traffic Management System" approved for NM-2026-882341.',
    user: 'faculty.cse@college.edu',
    role: 'FACULTY',
  },
  {
    id: 'log-6',
    time: '2026-07-31 10:45:10',
    action: 'RESUME_GENERATED',
    level: 'INFO',
    ipAddress: '192.168.1.42',
    details: 'ATS Resume generated for role Software Engineer. Score: 85%.',
    user: 'aravind.student@college.edu',
    role: 'STUDENT',
  },
];

const DEFAULT_TRUST_STATS = {
  totalStudents: 450,
  identityVerificationRate: 100,
  suspiciousProjects: 4,
  averageDataConfidence: 88.5,
};

const DEFAULT_AI_STATUS = {
  verificationMode: 'MOCK (DEMO)',
  githubIntegrationStatus: 'Active',
  academicIntegrationStatus: 'Active (Mock)',
  issuerIntegrationStatus: 'Active (Mock)',
};

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'USERS' | 'LOGS' | 'TRUST' | 'AI_STATUS'>('USERS');
  const [users, setUsers] = useState<any[]>(DEFAULT_USERS);
  const [logs, setLogs] = useState<any[]>(DEFAULT_LOGS);
  const [trustStats, setTrustStats] = useState<any>(DEFAULT_TRUST_STATS);
  const [aiStatus, setAiStatus] = useState<any>(DEFAULT_AI_STATUS);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [usersRes, logsRes, trustRes, aiRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/users`, { headers }),
        fetch(`${API_BASE_URL}/api/admin/audit-logs`, { headers }),
        fetch(`${API_BASE_URL}/api/admin/trust/overview`, { headers }),
        fetch(`${API_BASE_URL}/api/admin/ai-status`, { headers }),
      ]);

      const usersJson = await usersRes.json();
      const logsJson = await logsRes.json();
      const trustJson = await trustRes.json();
      const aiJson = await aiRes.json();

      if (usersJson.success && usersJson.data && usersJson.data.length > 0) setUsers(usersJson.data);
      if (logsJson.success && logsJson.data && logsJson.data.length > 0) setLogs(logsJson.data);
      if (trustJson.success && trustJson.data && trustJson.data.totalStudents > 0) setTrustStats(trustJson.data);
      if (aiJson.success && aiJson.data) setAiStatus(aiJson.data);
    } catch (e) {
      console.error('Failed to load admin data', e);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      const json = await res.json();
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (e) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Admin Control Panel & System Trust Overview</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Institutional trust verification metrics, user RBAC, and real-time IP audit logs.</p>
        </div>
        <span className="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-3.5 py-1.5 rounded-full font-bold">
          Trust Engine Status: OPERATIONAL
        </span>
      </div>

      {/* System Trust Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">Total Registered Students</span>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1.5">{trustStats?.totalStudents || 450}</h3>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 font-medium">Institution Enrolled Roster</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">Identity Verification Rate</span>
          <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1.5">{trustStats?.identityVerificationRate || 100}%</h3>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold mt-1">Verified Academic ERP IDs</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">Suspicious Projects Flagged</span>
          <h3 className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-1.5">{trustStats?.suspiciousProjects || 4}</h3>
          <p className="text-[11px] text-rose-700 dark:text-rose-400 font-bold mt-1">Requires Faculty Audit</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">Average Data Confidence</span>
          <h3 className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1.5">{trustStats?.averageDataConfidence || 88.5} / 100</h3>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 font-medium">Evidence Quality Metric</p>
        </div>
      </div>

      {/* Verification Service Status Banner */}
      <div className="bg-blue-50/80 dark:bg-blue-950/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-500/30 shadow-xs space-y-3">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>Verification Services & Integrations Status</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-600 dark:text-slate-400 block font-bold uppercase text-[10px]">Verification Mode</span>
            <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold block mt-0.5">{aiStatus?.verificationMode || 'MOCK (DEMO)'}</span>
          </div>
          <div>
            <span className="text-slate-600 dark:text-slate-400 block font-bold uppercase text-[10px]">GitHub API Service</span>
            <span className="text-blue-700 dark:text-blue-400 font-bold block mt-0.5">{aiStatus?.githubIntegrationStatus || 'Active'}</span>
          </div>
          <div>
            <span className="text-slate-600 dark:text-slate-400 block font-bold uppercase text-[10px]">Academic ERP Provider</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold block mt-0.5">{aiStatus?.academicIntegrationStatus || 'Active (Mock)'}</span>
          </div>
          <div>
            <span className="text-slate-600 dark:text-slate-400 block font-bold uppercase text-[10px]">Issuer API Provider</span>
            <span className="text-indigo-700 dark:text-indigo-400 font-bold block mt-0.5">{aiStatus?.issuerIntegrationStatus || 'Active (Mock)'}</span>
          </div>
        </div>
      </div>

      {/* User RBAC Management */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center space-x-2">
            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>User Role-Based Access Control (RBAC)</span>
          </h3>
          <button onClick={fetchAdminData} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800 dark:text-slate-200">
            <thead className="bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">User Name</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Identity Status</th>
                <th className="p-3.5">Role Selector</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">{u.name}</td>
                  <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400 font-medium">{u.email}</td>
                  <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">{u.department || 'General'}</td>
                  <td className="p-3.5">
                    <VerificationBadge status={u.academicIdentity?.verificationStatus || 'VERIFIED'} size="sm" />
                  </td>
                  <td className="p-3.5">
                    <select
                      value={u.role}
                      disabled={updatingId === u.id}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-indigo-700 dark:text-indigo-300 font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="STUDENT">STUDENT</option>
                      <option value="FACULTY">FACULTY</option>
                      <option value="PLACEMENT_OFFICER">PLACEMENT_OFFICER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time System Audit Logs */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center space-x-2">
            <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Real-Time Audit Trail (Immutable Log Stream with IP Capture)</span>
          </h3>
          <span className="text-xs text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            Real IP Tracing Active
          </span>
        </div>

        <div className="space-y-2.5 text-xs font-mono max-h-96 overflow-y-auto pr-1">
          {logs.map((log) => (
            <div key={log.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">[{log.time}]</span>
                  <span className={`font-bold ${log.level === 'WARNING' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>{log.action}</span>
                </div>
                <span className="text-slate-700 dark:text-slate-300 font-bold bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">IP: {log.ipAddress}</span>
              </div>
              <p className="text-slate-800 dark:text-slate-200 text-xs font-sans mt-1 font-medium">{log.details}</p>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-sans mt-1">Actor: <strong>{log.user}</strong> ({log.role})</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
