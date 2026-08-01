'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Award,
  Briefcase,
  Code,
  ArrowRight,
  Lock,
  UserCheck
} from 'lucide-react';

export default function LandingLoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<'STUDENT' | 'FACULTY' | 'PLACEMENT_OFFICER' | 'ADMIN'>('STUDENT');
  const [email, setEmail] = useState('aravind.student@college.edu');
  const [password, setPassword] = useState('password123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuth(
      {
        id: '1',
        name: selectedRole === 'STUDENT' ? 'Aravind Kumar' : selectedRole === 'FACULTY' ? 'Dr. Malathi N' : selectedRole === 'PLACEMENT_OFFICER' ? 'Prof. Sundararam M' : 'Dr. K. Rajasekaran',
        email,
        role: selectedRole,
        department: 'Computer Science & Engineering',
        naanMudhalvanId: 'NM-2026-882341',
      },
      'jwt-token'
    );

    if (selectedRole === 'STUDENT') router.push('/dashboard/student');
    else if (selectedRole === 'FACULTY') router.push('/dashboard/faculty');
    else if (selectedRole === 'PLACEMENT_OFFICER') router.push('/dashboard/placement');
    else if (selectedRole === 'ADMIN') router.push('/dashboard/admin');
  };

  const handleQuickDemo = (role: 'STUDENT' | 'FACULTY' | 'PLACEMENT_OFFICER' | 'ADMIN') => {
    setSelectedRole(role);
    if (role === 'STUDENT') setEmail('aravind.student@college.edu');
    if (role === 'FACULTY') setEmail('faculty.cse@college.edu');
    if (role === 'PLACEMENT_OFFICER') setEmail('placement@college.edu');
    if (role === 'ADMIN') setEmail('admin@naanmudhalvan.edu');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Bar */}
      <header className="max-w-7xl w-full mx-auto flex justify-between items-center py-4 border-b border-slate-800 z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white tracking-tight text-base">Naan Mudhalvan</h1>
            <p className="text-xs text-blue-400 font-medium">Portfolio & AI Engine</p>
          </div>
        </div>

        <span className="text-xs bg-blue-950 text-blue-300 border border-blue-800 px-3 py-1.5 rounded-full font-semibold flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Production Ready SaaS Platform</span>
        </span>
      </header>

      {/* Hero & Login Section */}
      <main className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12 z-10">
        {/* Left Hero */}
        <div className="space-y-6">
          <div className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Aligned with TNSDC Naan Mudhalvan Skill Initiative</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
            Automated Student Portfolios & <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">Explainable AI</span> Employability.
          </h2>

          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Automate student portfolio creation from GitHub, LeetCode, and EasyOCR certificate scans. Predict employment eligibility using XGBoost with SHAP feature attributions and generate personalized career roadmaps.
          </p>

          {/* Quick Portal Switch Demo Badges */}
          <div className="space-y-2 pt-2">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Instant 1-Click Role Login Demo:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleQuickDemo('STUDENT')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center space-x-1.5 ${
                  selectedRole === 'STUDENT' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 text-slate-300 border-slate-800'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Student Portal</span>
              </button>

              <button
                onClick={() => handleQuickDemo('FACULTY')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center space-x-1.5 ${
                  selectedRole === 'FACULTY' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 text-slate-300 border-slate-800'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Faculty Review</span>
              </button>

              <button
                onClick={() => handleQuickDemo('PLACEMENT_OFFICER')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center space-x-1.5 ${
                  selectedRole === 'PLACEMENT_OFFICER' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 text-slate-300 border-slate-800'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Placement Hub</span>
              </button>

              <button
                onClick={() => handleQuickDemo('ADMIN')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center space-x-1.5 ${
                  selectedRole === 'ADMIN' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 text-slate-300 border-slate-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Authentication Form Card */}
        <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl max-w-md w-full ml-auto">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">Sign In to Dashboard</h3>
            <p className="text-xs text-slate-400">Enter your credentials or select a role above for demo access.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">User Role</label>
              <select
                value={selectedRole}
                onChange={(e: any) => setSelectedRole(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
              >
                <option value="STUDENT">Student Portal</option>
                <option value="FACULTY">Faculty Portal</option>
                <option value="PLACEMENT_OFFICER">Placement Officer Hub</option>
                <option value="ADMIN">System Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2"
            >
              <span>Enter {selectedRole} Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 z-10 gap-2">
        <p>© 2026 Naan Mudhalvan Automated Portfolio & Employment Assessment Platform.</p>
        <p>Built with Next.js, Express, Prisma, XGBoost, and EasyOCR.</p>
      </footer>
    </div>
  );
}
