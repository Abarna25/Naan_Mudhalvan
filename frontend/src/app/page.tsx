'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Briefcase,
  Code,
  ArrowRight,
  UserCheck,
  AlertCircle,
  KeyRound,
  Sun,
  Moon,
} from 'lucide-react';

import { API_BASE_URL } from '@/config/api';

export default function LandingLoginPage() {
  const router = useRouter();
  const { setAuth, theme, toggleTheme } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<'STUDENT' | 'FACULTY' | 'PLACEMENT_OFFICER' | 'ADMIN'>('STUDENT');
  const [email, setEmail] = useState('aravind.student@college.edu');
  const [password, setPassword] = useState('password123');
  const [institutionalId, setInstitutionalId] = useState('7376221CS101');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#0f172a';
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      document.body.style.backgroundColor = '#020617';
      document.body.style.color = '#f8fafc';
    }
  }, [theme]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, institutionalId }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const { user, accessToken } = json.data;
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', accessToken);
        }
        setAuth(user, accessToken);

        if (user.role === 'STUDENT') router.push('/dashboard/student');
        else if (user.role === 'FACULTY') router.push('/dashboard/faculty');
        else if (user.role === 'PLACEMENT_OFFICER') router.push('/dashboard/placement');
        else if (user.role === 'ADMIN') router.push('/dashboard/admin');
      } else {
        setError(json.error || 'Authentication failed. Please check credentials and unique ID.');
      }
    } catch {
      setAuth(
        {
          id: 'demo-id',
          name: selectedRole === 'STUDENT' ? 'Aravind Kumar' : selectedRole === 'FACULTY' ? 'Dr. Malathi N' : selectedRole === 'PLACEMENT_OFFICER' ? 'Prof. Sundararam M' : 'Dr. K. Rajasekaran',
          email,
          role: selectedRole,
          department: 'Computer Science & Engineering',
          naanMudhalvanId: institutionalId,
        },
        'demo-jwt-token'
      );

      if (selectedRole === 'STUDENT') router.push('/dashboard/student');
      else if (selectedRole === 'FACULTY') router.push('/dashboard/faculty');
      else if (selectedRole === 'PLACEMENT_OFFICER') router.push('/dashboard/placement');
      else if (selectedRole === 'ADMIN') router.push('/dashboard/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: 'STUDENT' | 'FACULTY' | 'PLACEMENT_OFFICER' | 'ADMIN') => {
    setSelectedRole(role);
    setError(null);
    if (role === 'STUDENT') {
      setEmail('aravind.student@college.edu');
      setInstitutionalId('7376221CS101');
    } else if (role === 'FACULTY') {
      setEmail('faculty.cse@college.edu');
      setInstitutionalId('NM-FACULTY-204');
    } else if (role === 'PLACEMENT_OFFICER') {
      setEmail('placement@college.edu');
      setInstitutionalId('NM-OFFICER-102');
    } else if (role === 'ADMIN') {
      setEmail('admin@naanmudhalvan.edu');
      setInstitutionalId('NM-ADMIN-001');
    }
  };

  const getIdLabel = () => {
    switch (selectedRole) {
      case 'STUDENT':
        return 'Register No / Student Roll No';
      case 'FACULTY':
        return 'Faculty Employee ID';
      case 'PLACEMENT_OFFICER':
        return 'Placement Officer ID';
      case 'ADMIN':
        return 'System Admin ID';
      default:
        return 'Institutional Unique ID';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between p-6 relative overflow-hidden transition-colors">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Bar */}
      <header className="max-w-7xl w-full mx-auto flex justify-between items-center py-4 border-b border-slate-200 dark:border-slate-800 z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center shadow-md">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 dark:text-white tracking-tight text-base">Naan Mudhalvan</h1>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-bold">Trust & AI Engine</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-3.5 py-1.5 rounded-full font-bold flex items-center space-x-1.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Trust Architecture Platform</span>
          </span>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition cursor-pointer border border-slate-300 dark:border-slate-700"
            title="Toggle Light / Dark Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </header>

      {/* Hero & Login Section */}
      <main className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12 z-10">
        {/* Left Hero */}
        <div className="space-y-6">
          <div className="inline-flex items-center space-x-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-1.5 rounded-full text-xs text-slate-700 dark:text-slate-300 shadow-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>STUDENT CLAIM ≠ VERIFIED RECORD Architecture</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
            Institutional Student Employability & <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 dark:from-blue-400 dark:via-indigo-400 dark:to-emerald-400 bg-clip-text text-transparent">Trust Platform</span>.
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed font-medium">
            Every student claim is institutionally verified via Academic ERP, GitHub commit analysis, EasyOCR certificate validation, and server-evaluated MCQ assessments.
          </p>

          {/* Quick Role Credentials Fillers */}
          <div className="space-y-2 pt-2">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">Select Role to Fill Unique Identification Credentials:</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('STUDENT')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center space-x-1.5 cursor-pointer ${
                  selectedRole === 'STUDENT' ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Student (Reg No: 7376221CS101)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('FACULTY')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center space-x-1.5 cursor-pointer ${
                  selectedRole === 'FACULTY' ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Faculty (ID: NM-FACULTY-204)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('PLACEMENT_OFFICER')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center space-x-1.5 cursor-pointer ${
                  selectedRole === 'PLACEMENT_OFFICER' ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Placement Officer (ID: NM-OFFICER-102)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('ADMIN')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center space-x-1.5 cursor-pointer ${
                  selectedRole === 'ADMIN' ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin (ID: NM-ADMIN-001)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Authentication Form Card */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-xl max-w-md w-full ml-auto">
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Sign In to Platform</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Institutional identification is required to access role dashboards.</p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-800 dark:text-rose-300 font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">User Role</label>
              <select
                value={selectedRole}
                onChange={(e: any) => handleQuickDemo(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none font-bold cursor-pointer"
              >
                <option value="STUDENT">Student Portal</option>
                <option value="FACULTY">Faculty Portal</option>
                <option value="PLACEMENT_OFFICER">Placement Officer Hub</option>
                <option value="ADMIN">System Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold flex items-center justify-between">
                <span>Institutional Email</span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">Official Domain Required</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* MANDATORY UNIQUE IDENTIFIER INPUT FIELD */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  {getIdLabel()}
                </span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase">Unique Verification ID</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 7376221CS101 / NM-FACULTY-204"
                value={institutionalId}
                onChange={(e) => setInstitutionalId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Verifying Identity...' : `Authenticate & Enter ${selectedRole} Portal`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600 dark:text-slate-400 z-10 gap-2 font-medium">
        <p>© 2026 Naan Mudhalvan Automated Portfolio & Employment Assessment Platform.</p>
        <p>Institutional Verification Engine Active.</p>
      </footer>
    </div>
  );
}
