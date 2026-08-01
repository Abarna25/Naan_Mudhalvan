'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import {
  LayoutDashboard,
  UserCheck,
  Award,
  FileCode,
  Briefcase,
  Layers,
  Sparkles,
  Search,
  ShieldCheck,
  TrendingUp,
  Settings,
  LogOut,
  GraduationCap
} from 'lucide-react';

export const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const role = user.role;

  const studentLinks = [
    { href: '/dashboard/student', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/student/profile', label: 'Profile & Skills', icon: UserCheck },
    { href: '/dashboard/student/portfolio', label: 'Portfolio Compiler', icon: FileCode },
    { href: '/dashboard/student/resume', label: 'ATS Resume Studio', icon: Layers },
    { href: '/dashboard/student/eligibility', label: 'Explainable AI Engine', icon: Sparkles },
    { href: '/dashboard/student/roadmap', label: 'Career & Gap Roadmap', icon: TrendingUp },
  ];

  const facultyLinks = [
    { href: '/dashboard/faculty', label: 'Department Roster', icon: LayoutDashboard },
    { href: '/dashboard/faculty/approvals', label: 'Portfolio Approvals', icon: Award },
    { href: '/dashboard/faculty/analytics', label: 'Class Performance', icon: TrendingUp },
  ];

  const placementLinks = [
    { href: '/dashboard/placement', label: 'Placement Hub', icon: Briefcase },
    { href: '/dashboard/placement/readiness', label: 'Eligibility Analytics', icon: Sparkles },
    { href: '/dashboard/placement/candidates', label: 'Top Performers', icon: UserCheck },
  ];

  const adminLinks = [
    { href: '/dashboard/admin', label: 'User & RBAC Manager', icon: ShieldCheck },
    { href: '/dashboard/admin/logs', label: 'Audit Logs', icon: Layers },
    { href: '/dashboard/admin/ai-status', label: 'AI Engine Diagnostics', icon: Sparkles },
  ];

  let currentLinks = studentLinks;
  if (role === 'FACULTY') currentLinks = facultyLinks;
  if (role === 'PLACEMENT_OFFICER') currentLinks = placementLinks;
  if (role === 'ADMIN') currentLinks = adminLinks;

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white tracking-tight leading-tight text-sm">Naan Mudhalvan</h1>
            <p className="text-[11px] text-blue-400 font-medium">Portfolio & AI Engine</p>
          </div>
        </div>

        {/* Role Indicator */}
        <div className="px-5 py-3 bg-slate-900/50 border-b border-slate-800/60 flex items-center justify-between">
          <span className="text-xs text-slate-400">Active Role:</span>
          <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-blue-900/50 text-blue-300 border border-blue-700/50">
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
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-blue-400 text-sm">
            {user.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-slate-200 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 bg-rose-950/20 border border-rose-900/30 hover:bg-rose-950/40 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
