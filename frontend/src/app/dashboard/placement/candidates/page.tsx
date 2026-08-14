'use client';

import React, { useState } from 'react';
import { Users, Star, Github, Linkedin, Mail, Search, Download, ExternalLink, Award, Code, Trophy } from 'lucide-react';

const candidates = [
  {
    rank: 1,
    name: 'Kavitha R',
    dept: 'Information Technology',
    naanId: 'NM-2026-993120',
    score: 92,
    cgpa: 9.2,
    projects: 5,
    certs: 7,
    topSkills: ['React', 'Node.js', 'TypeScript', 'AWS'],
    email: 'kavitha@college.edu',
    github: 'kavitha-r-dev',
    linkedin: 'kavitha-r',
    tier: 'Tier-1 Ready',
    topProject: 'AI Resume Parser SaaS Platform',
  },
  {
    rank: 2,
    name: 'Aravind Kumar',
    dept: 'Computer Science & Engineering',
    naanId: 'NM-2026-882341',
    score: 88,
    cgpa: 9.4,
    projects: 4,
    certs: 5,
    topSkills: ['Python', 'FastAPI', 'React', 'Docker'],
    email: 'aravind.student@college.edu',
    github: 'aravind-dev',
    linkedin: 'aravind-kumar-dev',
    tier: 'Tier-1 Eligible',
    topProject: 'AI Smart Traffic Management System',
  },
  {
    rank: 3,
    name: 'Sanjay Nathan',
    dept: 'Electronics & Communication Eng',
    naanId: 'NM-2026-441209',
    score: 85,
    cgpa: 8.9,
    projects: 5,
    certs: 6,
    topSkills: ['Java', 'Spring Boot', 'PostgreSQL', 'Microservices'],
    email: 'sanjay.nathan@college.edu',
    github: 'sanjay-dev',
    linkedin: 'sanjay-nathan-cs',
    tier: 'Tier-1 Eligible',
    topProject: 'Hospital Management Microservices',
  },
  {
    rank: 4,
    name: 'Deepika S',
    dept: 'Computer Science & Engineering',
    naanId: 'NM-2026-553872',
    score: 83,
    cgpa: 8.7,
    projects: 4,
    certs: 4,
    topSkills: ['Python', 'TensorFlow', 'FastAPI', 'React'],
    email: 'deepika.s@college.edu',
    github: 'deepika-ai',
    linkedin: 'deepika-s-ai',
    tier: 'Tier-2 Ready',
    topProject: 'Sign Language Recognition Using CNN',
  },
  {
    rank: 5,
    name: 'Murugan R',
    dept: 'Information Technology',
    naanId: 'NM-2026-773211',
    score: 80,
    cgpa: 8.5,
    projects: 3,
    certs: 4,
    topSkills: ['Node.js', 'Redis', 'Docker', 'MongoDB'],
    email: 'murugan.r@college.edu',
    github: 'murugan-dev',
    linkedin: 'murugan-r-dev',
    tier: 'Tier-2 Ready',
    topProject: 'Distributed Inventory Tracker with Redis',
  },
];

export default function TopCandidatesPage() {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('ALL');

  const filtered = candidates.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase());
    const matchTier = tierFilter === 'ALL' || c.tier === tierFilter;
    return matchSearch && matchTier;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <span>Top Performing Candidates</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Institution-wide leaderboard sorted by XAI Employment Eligibility Score.</p>
        </div>
        <button
          onClick={() => window.open('http://localhost:5005/api/v1/placement/export-csv', '_blank')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center space-x-2 shadow-md transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search candidates by name..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-200 font-medium focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          {(['ALL', 'Tier-1 Ready', 'Tier-1 Eligible', 'Tier-2 Ready'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTierFilter(t)}
              className={`px-3.5 py-2.5 text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                tierFilter === t ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((c) => (
          <div key={c.rank} className="glass-card p-6 rounded-2xl space-y-4 relative">
            {/* Rank Badge */}
            <div className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-md ${
              c.rank === 1 ? 'bg-amber-500 text-white' :
              c.rank === 2 ? 'bg-slate-400 text-white' :
              c.rank === 3 ? 'bg-amber-700 text-white' :
              'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}>
              {c.rank}
            </div>

            {/* Avatar & Info */}
            <div className="flex items-center space-x-3 pr-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-md">
                {c.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{c.name}</h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">{c.dept}</p>
                <p className="text-[11px] text-slate-500 font-mono font-semibold">{c.naanId}</p>
              </div>
            </div>

            {/* Score & Tier Metrics */}
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Eligibility</p>
                <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{c.score}%</p>
              </div>
              <div className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">CGPA</p>
                <p className="text-xl font-black text-blue-600 dark:text-blue-400">{c.cgpa}</p>
              </div>
              <div className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Certs</p>
                <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">{c.certs}</p>
              </div>
            </div>

            {/* Tier Badge */}
            <div>
              <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                c.tier === 'Tier-1 Ready' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' :
                c.tier === 'Tier-1 Eligible' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-800' :
                'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300 border-violet-300 dark:border-violet-800'
              }`}>
                {c.tier}
              </span>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5">
              {c.topSkills.map((skill, idx) => (
                <span key={idx} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded font-bold">
                  {skill}
                </span>
              ))}
            </div>

            {/* TOP PROJECT CONTAINER (FIXED CONTRAST & BACKGROUND) */}
            <div className="text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-1">
              <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase">Top Project</p>
              <p className="text-slate-900 dark:text-slate-100 font-bold">{c.topProject}</p>
            </div>

            {/* Contact Actions */}
            <div className="flex items-center space-x-2 pt-1">
              <a href={`mailto:${c.email}`} className="flex-1 py-2 text-center text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Contact</span>
              </a>
              <a
                href={`/portfolio/${c.github}`}
                target="_blank"
                className="flex-1 py-2 text-center text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Portfolio</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
