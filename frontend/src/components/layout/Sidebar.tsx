'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import {
  LayoutDashboard,
  UserCheck,
  Award,
  FileCode,
  Briefcase,
  Layers,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  LogOut,
  GraduationCap,
} from 'lucide-react';

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const role = user.role;

  const handleSignOut = () => {
    logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const studentLinks = [
    { href: '/dashboard/student', label: 'Dashboard & Trust Center', icon: LayoutDashboard },
    { href: '/dashboard/student/profile', label: 'Profile & Skills', icon: UserCheck },
    { href: '/dashboard/student/portfolio', label: 'Portfolio Compiler', icon: FileCode },
    { href: '/dashboard/student/resume', label: 'ATS Resume Studio', icon: Layers },
    { href: '/dashboard/student/eligibility', label: 'Explainable AI Engine', icon: Sparkles },
    { href: '/dashboard/student/roadmap', label: 'Career & Gap Roadmap', icon: TrendingUp },
  ];

  const facultyLinks = [
    { href: '/dashboard/faculty', label: 'Verification Queue', icon: LayoutDashboard },
    { href: '/dashboard/faculty/approvals', label: 'Portfolio Approvals', icon: Award },
    { href: '/dashboard/faculty/analytics', label: 'Class Analytics', icon: TrendingUp },
  ];

  const placementLinks = [
    { href: '/dashboard/placement', label: 'Placement Hub & Queue', icon: Briefcase },
    { href: '/dashboard/placement/readiness', label: 'Readiness Analytics', icon: Sparkles },
    { href: '/dashboard/placement/candidates', label: 'Candidate Roster', icon: UserCheck },
  ];

  const adminLinks = [
    { href: '/dashboard/admin', label: 'User & RBAC Manager', icon: ShieldCheck },
    { href: '/dashboard/admin/logs', label: 'IP Audit Logs', icon: Layers },
    { href: '/dashboard/admin/ai-status', label: 'AI Engine Diagnostics', icon: Sparkles },
  ];

  let currentLinks = studentLinks;
  if (role === 'FACULTY') currentLinks = facultyLinks;
  if (role === 'PLACEMENT_OFFICER') currentLinks = placementLinks;
  if (role === 'ADMIN') currentLinks = adminLinks;

  return (
    <aside className="w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between h-screen sticky top-0 transition-colors">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 dark:text-white tracking-tight leading-tight text-sm">Naan Mudhalvan</h1>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">Trust & AI Engine</p>
          </div>
        </div>

        {/* Role Indicator */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800/60 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">Authenticated Role:</span>
          <span className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50">
            {role}
          </span>
        </div>

        {/* Nav Links */}
        <nav className="p-3 space-y-1">
          {currentLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-600/15 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Sign Out */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 flex items-center justify-center font-bold text-blue-700 dark:text-blue-400 text-sm">
            {user.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
