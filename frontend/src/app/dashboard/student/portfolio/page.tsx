'use client';

import React, { useState } from 'react';
import { FileCode, Copy, ExternalLink, Check, RefreshCw, Eye, Globe, Lock, Sparkles } from 'lucide-react';

type Theme = 'modern' | 'minimal' | 'gradient';
type Section = 'academic' | 'projects' | 'certifications' | 'skills' | 'coding';

const THEMES: { id: Theme; label: string; desc: string }[] = [
  { id: 'modern', label: 'Enterprise Glass', desc: 'Sleek dark theme with glassmorphism — recommended for top companies.' },
  { id: 'minimal', label: 'Minimalist Mono', desc: 'Clean charcoal layout optimised for software engineers & startups.' },
  { id: 'gradient', label: 'Vibrant Emerald', desc: 'Vivid accent gradients aligned with Naan Mudhalvan colours.' },
];

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'academic', label: 'Academic Details & CGPA' },
  { id: 'projects', label: 'GitHub Projects' },
  { id: 'certifications', label: 'Certifications & Awards' },
  { id: 'skills', label: 'Technical Skills' },
  { id: 'coding', label: 'LeetCode / Coding Profiles' },
];

export default function PortfolioCompilerPage() {
  const [slug, setSlug] = useState('aravind-kumar');
  const [theme, setTheme] = useState<Theme>('modern');
  const [isPublic, setIsPublic] = useState(true);
  const [sections, setSections] = useState<Record<Section, boolean>>({
    academic: true, projects: true, certifications: true, skills: true, coding: true,
  });
  const [copied, setCopied] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compiled, setCompiled] = useState(false);
  const [slugError, setSlugError] = useState('');

  const publicUrl = `http://localhost:3005/portfolio/${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validateSlug = (val: string) => {
    const clean = val.replace(/[^a-z0-9-]/g, '');
    setSlug(clean);
    setCompiled(false);
    if (clean.length < 3) setSlugError('Slug must be at least 3 characters.');
    else if (clean.startsWith('-') || clean.endsWith('-')) setSlugError('Slug cannot start or end with a dash.');
    else setSlugError('');
  };

  const toggleSection = (id: Section) => {
    setSections(prev => ({ ...prev, [id]: !prev[id] }));
    setCompiled(false);
  };

  const handleCompile = () => {
    if (slugError || slug.length < 3) return;
    setIsCompiling(true);
    setTimeout(() => { setIsCompiling(false); setCompiled(true); }, 1500);
  };

  const enabledCount = Object.values(sections).filter(Boolean).length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
            <FileCode className="w-6 h-6 text-blue-400" />
            <span>Automated Portfolio Compiler</span>
          </h1>
          <p className="text-xs text-slate-400">Compile your academic records, GitHub projects, and Naan Mudhalvan certificates into a shareable public portfolio.</p>
        </div>
        <div className="flex items-center space-x-3">
          {compiled && (
            <a href={`/portfolio/${slug}`} target="_blank" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl flex items-center space-x-2 transition-all shadow-lg shadow-blue-600/20">
              <ExternalLink className="w-4 h-4" />
              <span>View Portfolio</span>
            </a>
          )}
          <button
            onClick={handleCompile}
            disabled={isCompiling || !!slugError}
            className={`px-4 py-2 text-white font-semibold text-xs rounded-xl flex items-center space-x-2 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed ${compiled ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'}`}
          >
            {isCompiling ? <RefreshCw className="w-4 h-4 animate-spin" /> : compiled ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            <span>{isCompiling ? 'Compiling...' : compiled ? 'Re-Compile' : 'Compile Portfolio'}</span>
          </button>
        </div>
      </div>

      {/* Compiled Success Banner */}
      {compiled && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl border border-emerald-700/60 bg-emerald-950/25">
          <div className="flex items-center space-x-3 text-sm">
            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-emerald-300">Portfolio compiled successfully!</p>
              <p className="text-emerald-400/70 text-xs font-mono">{publicUrl}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={handleCopy} className="px-3 py-2 text-xs font-semibold bg-emerald-900/50 hover:bg-emerald-800/60 text-emerald-300 border border-emerald-700 rounded-xl flex items-center space-x-1.5 transition-colors">
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
            <a href={`/portfolio/${slug}`} target="_blank" className="px-3 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center space-x-1.5 transition-colors">
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </a>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Panel */}
        <div className="space-y-5">
          {/* Slug */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-100">Portfolio URL & Visibility</h3>
            <div>
              <label className="block text-slate-400 mb-1.5 text-xs font-semibold">Public Slug</label>
              <div className="flex items-center rounded-xl overflow-hidden border border-slate-700 focus-within:border-blue-500 transition-colors">
                <span className="bg-slate-800 px-3 py-2.5 text-slate-500 font-mono text-xs whitespace-nowrap border-r border-slate-700">localhost:3005/portfolio/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={e => validateSlug(e.target.value.toLowerCase())}
                  placeholder="your-name"
                  className="flex-1 bg-slate-900 px-3 py-2.5 text-xs text-slate-200 focus:outline-none font-mono"
                />
              </div>
              {slugError && <p className="text-rose-400 text-[11px] mt-1.5">{slugError}</p>}
              {!slugError && slug.length >= 3 && <p className="text-emerald-400 text-[11px] mt-1.5">✓ Slug available: /portfolio/{slug}</p>}
            </div>

            <div>
              <label className="block text-slate-400 mb-2 text-xs font-semibold">Visibility</label>
              <div className="flex rounded-xl overflow-hidden border border-slate-800">
                <button onClick={() => setIsPublic(true)} className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors ${isPublic ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}>
                  <Globe className="w-3.5 h-3.5" /><span>Public</span>
                </button>
                <button onClick={() => setIsPublic(false)} className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors ${!isPublic ? 'bg-slate-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}>
                  <Lock className="w-3.5 h-3.5" /><span>Private</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                {isPublic ? '✓ Anyone with the link can view your portfolio' : '🔒 Only you and approved viewers can access'}
              </p>
            </div>
          </div>

          {/* Theme Picker */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-100">Design Theme</h3>
            <div className="space-y-3">
              {THEMES.map(t => (
                <div key={t.id} onClick={() => { setTheme(t.id); setCompiled(false); }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${theme === t.id ? 'bg-blue-950/40 border-blue-500' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
                  <div className="flex items-center justify-between">
                    <h4 className={`font-bold text-sm ${theme === t.id ? 'text-blue-300' : 'text-slate-300'}`}>{t.label}</h4>
                    {theme === t.id && <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold">Selected</span>}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section Picker */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100">Portfolio Sections</h3>
            <span className="text-xs text-blue-400 font-semibold">{enabledCount}/{SECTIONS.length} enabled</span>
          </div>
          <p className="text-xs text-slate-400">Toggle which sections appear in your public portfolio.</p>

          <div className="space-y-3">
            {SECTIONS.map(sec => (
              <div key={sec.id}
                onClick={() => toggleSection(sec.id)}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${sections[sec.id] ? 'bg-emerald-950/20 border-emerald-800/60' : 'bg-slate-900 border-slate-800 opacity-60'}`}>
                <span className={`text-sm font-medium ${sections[sec.id] ? 'text-slate-200' : 'text-slate-500'}`}>{sec.label}</span>
                <div className={`w-10 h-5 rounded-full relative transition-all ${sections[sec.id] ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${sections[sec.id] ? 'left-5.5 left-[22px]' : 'left-0.5'}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Preview Stats */}
          <div className="border-t border-slate-800 pt-4 grid grid-cols-3 gap-3 text-center text-xs">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <p className="text-slate-400 font-semibold text-[10px] uppercase">Projects</p>
              <p className="text-white font-bold text-lg">4</p>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <p className="text-slate-400 font-semibold text-[10px] uppercase">Certs</p>
              <p className="text-white font-bold text-lg">5</p>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <p className="text-slate-400 font-semibold text-[10px] uppercase">Skills</p>
              <p className="text-white font-bold text-lg">12</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
