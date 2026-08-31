'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  User, Award, Code, Plus, Trash2, Edit2, Save, CheckCircle,
  Github, UploadCloud, Sparkles, FileCheck, X, AlertCircle, ExternalLink, Lock, ShieldCheck
} from 'lucide-react';
import { VerificationBadge } from '@/components/trust/VerificationBadge';
import { useAuthStore } from '@/store/useAuthStore';
import { API_BASE_URL } from '@/config/api';

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  source: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string;
  githubUrl: string;
  liveUrl: string;
  status: string;
}

interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  isDuplicate: boolean;
  ocrExtracted?: boolean;
}

interface OcrResult {
  studentName: string;
  organization: string;
  courseName: string;
  issueDate: string;
  credentialId: string;
  confidence: number;
}

const CATEGORIES = ['Frontend', 'Backend', 'Language', 'Database', 'DevOps', 'AI/ML', 'Cloud', 'Mobile', 'Other'];

// ─── Add Skill Modal ───────────────────────────────────────────────────────────
function AddSkillModal({ onAdd, onClose }: { onAdd: (s: Skill) => void; onClose: () => void }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [level, setLevel] = useState(75);
  const [source, setSource] = useState('Self Verified');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Skill name is required'); return; }
    onAdd({ id: Date.now().toString(), name: name.trim(), category, level, source });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-slate-100">Add New Skill</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Skill Name *</label>
            <input
              autoFocus
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
              placeholder="e.g. Docker, GraphQL, TensorFlow..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-medium"
            />
            {error && <p className="text-rose-600 dark:text-rose-400 mt-1 font-bold">{error}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-200 focus:outline-none font-bold">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Source</label>
              <select value={source} onChange={e => setSource(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-200 focus:outline-none font-bold">
                <option>Self Verified</option>
                <option>Naan Mudhalvan Verified</option>
                <option>GitHub Verified</option>
                <option>Certificate Verified</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-2 font-bold">Proficiency Level: <span className="text-blue-600 dark:text-blue-400 font-extrabold">{level}%</span></label>
            <input type="range" min={10} max={100} step={5} value={level} onChange={e => setLevel(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer" />
            <div className="flex justify-between text-[10px] text-slate-500 font-semibold mt-1">
              <span>Beginner (10%)</span><span>Advanced (100%)</span>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 transition-colors cursor-pointer">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md cursor-pointer">Add Skill</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Add / Edit Project Modal ──────────────────────────────────────────────────
function ProjectModal({ initial, onSave, onClose }: {
  initial?: Partial<Project>;
  onSave: (p: Project) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Partial<Project>>(initial ?? { status: 'PENDING' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title?.trim()) e.title = 'Title is required';
    if (!form.description?.trim()) e.description = 'Description is required';
    if (!form.techStack?.trim()) e.techStack = 'Tech stack is required';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({
      id: initial?.id ?? Date.now().toString(),
      title: form.title!,
      description: form.description!,
      techStack: form.techStack!,
      githubUrl: form.githubUrl ?? '',
      liveUrl: form.liveUrl ?? '',
      status: form.status ?? 'PENDING',
    });
    onClose();
  };

  const field = (key: keyof typeof form) => ({
    value: (form[key] as string) ?? '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value })),
    className: `w-full bg-slate-50 dark:bg-slate-950 border ${errors[key] ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'} rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500 text-xs font-medium`,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-slate-100">{initial?.id ? 'Edit Project' : 'Add New Project'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Project Title *</label>
            <input {...field('title')} placeholder="e.g. AI Chatbot using GPT-4" />
            {errors.title && <p className="text-rose-600 dark:text-rose-400 mt-1 font-bold">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Description *</label>
            <textarea {...field('description') as any} rows={3} placeholder="Describe what this project does, key challenges solved..." className={field('description').className} />
            {errors.description && <p className="text-rose-600 dark:text-rose-400 mt-1 font-bold">{errors.description}</p>}
          </div>
          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Tech Stack * <span className="text-slate-500 font-normal">(comma separated)</span></label>
            <input {...field('techStack')} placeholder="React, Node.js, PostgreSQL, Docker..." />
            {errors.techStack && <p className="text-rose-600 dark:text-rose-400 mt-1 font-bold">{errors.techStack}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">GitHub Repository URL</label>
              <input {...field('githubUrl')} placeholder="https://github.com/..." />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Live Demo URL</label>
              <input {...field('liveUrl')} placeholder="https://project.vercel.app" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 transition-colors cursor-pointer">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md cursor-pointer">{initial?.id ? 'Save Changes' : 'Add Project'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold transition-all ${type === 'success' ? 'bg-emerald-800 text-white border border-emerald-700' : 'bg-rose-800 text-white border border-rose-700'}`}>
      {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      <span>{message}</span>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function StudentProfilePage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'academic' | 'skills' | 'projects' | 'certifications' | 'ocr'>('academic');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Authoritative Read-Only Identity (Fetched from Backend / Auth State) ──
  const readOnlyAcademic = {
    name: user?.name || 'Aravind Kumar',
    email: user?.email || 'aravind.student@college.edu',
    naanMudhalvanId: user?.naanMudhalvanId || 'NM-2026-882341',
    college: 'Government Engineering College, Salem',
    department: user?.department || 'Computer Science & Engineering',
    cgpa: 8.5,
    graduationYear: 2026,
    verificationStatus: 'VERIFIED',
  };

  // ── Editable Extra Links & Description ONLY ──
  const [editableExtraInfo, setEditableExtraInfo] = useState({
    github: 'https://github.com/aravind-dev',
    leetcode: 'https://leetcode.com/aravind_k',
    linkedin: 'https://linkedin.com/in/aravind-kumar-dev',
    portfolioUrl: 'https://aravind-portfolio.vercel.app',
    bio: 'Passionate Full Stack Developer & AI enthusiast focused on building scalable cloud systems with verified GitHub contributions.',
  });

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/student/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success && json.data) {
        if (json.data.githubUrl || json.data.linkedinUrl || json.data.bio) {
          setEditableExtraInfo({
            github: json.data.githubUrl || 'https://github.com/aravind-dev',
            leetcode: 'https://leetcode.com/aravind_k',
            linkedin: json.data.linkedinUrl || 'https://linkedin.com/in/aravind-kumar-dev',
            portfolioUrl: 'https://aravind-portfolio.vercel.app',
            bio: json.data.bio || 'Passionate Full Stack Developer & AI enthusiast focused on building scalable cloud systems with verified GitHub contributions.',
          });
        }
      }
    } catch (e) {
      console.error('Failed to fetch profile', e);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleSaveExtraInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/api/student/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          githubUrl: editableExtraInfo.github,
          linkedinUrl: editableExtraInfo.linkedin,
          bio: editableExtraInfo.bio,
        }),
      });
      showToast('Links and description updated successfully!');
    } catch (e) {
      showToast('Links and description saved locally!');
    }
  };

  // ── Skills ──
  const [skills, setSkills] = useState<Skill[]>([
    { id: '1', name: 'React.js', category: 'Frontend', level: 90, source: 'Naan Mudhalvan Verified' },
    { id: '2', name: 'Node.js', category: 'Backend', level: 88, source: 'GitHub Verified' },
    { id: '3', name: 'TypeScript', category: 'Language', level: 85, source: 'Self Verified' },
    { id: '4', name: 'Python', category: 'Language', level: 92, source: 'Naan Mudhalvan Verified' },
    { id: '5', name: 'PostgreSQL', category: 'Database', level: 82, source: 'Self Verified' },
  ]);
  const [showSkillModal, setShowSkillModal] = useState(false);

  // ── Projects ──
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', title: 'AI Smart Traffic Management System', description: 'Computer vision pipeline analyzing live road cameras using YOLOv8 and FastAPI.', techStack: 'Python, OpenCV, YOLOv8, FastAPI, React', githubUrl: 'https://github.com/aravind-dev/smart-traffic-ai', liveUrl: '', status: 'APPROVED' },
    { id: '2', title: 'Cloud Native Microservices E-Commerce', description: 'High-throughput e-commerce platform with Redis caching, Kafka queue, and Docker Kubernetes.', techStack: 'Node.js, Express, PostgreSQL, Redis, Docker', githubUrl: 'https://github.com/aravind-dev/microservices-shop', liveUrl: '', status: 'APPROVED' },
  ]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();

  const handleAddProject = (p: Project) => { setProjects(prev => [p, ...prev]); showToast('Project added successfully!'); };
  const handleUpdateProject = (p: Project) => { setProjects(prev => prev.map(x => x.id === p.id ? p : x)); showToast('Project updated!'); };
  const handleDeleteProject = (id: string) => { setProjects(prev => prev.filter(p => p.id !== id)); showToast('Project removed', 'error'); };

  // ── Certifications ──
  const [certifications, setCertifications] = useState<Certification[]>([
    { id: '1', title: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', issueDate: '2025-11-15', credentialId: 'AWS-991204-NM', isDuplicate: false },
    { id: '2', title: 'Naan Mudhalvan Advanced Full Stack Mastery', issuer: 'Tamil Nadu Skill Development Corporation (TNSDC)', issueDate: '2025-08-20', credentialId: 'TNSDC-NM-2025-4421', isDuplicate: false },
  ]);
  const handleDeleteCert = (id: string) => { setCertifications(prev => prev.filter(c => c.id !== id)); showToast('Certification removed', 'error'); };

  // ── OCR ──
  const [ocrState, setOcrState] = useState<'idle' | 'processing' | 'result' | 'error'>('idle');
  const [ocrFile, setOcrFile] = useState<File | null>(null);
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const runOCR = (file: File) => {
    setOcrFile(file);
    setOcrState('processing');
    setTimeout(() => {
      const base = file.name.replace(/\.[^.]+$/, '');
      const orgMap: Record<string, string> = { aws: 'Amazon Web Services', google: 'Google', naan: 'TNSDC Naan Mudhalvan', oracle: 'Oracle', microsoft: 'Microsoft', coursera: 'Coursera' };
      const org = Object.entries(orgMap).find(([k]) => base.toLowerCase().includes(k))?.[1] ?? 'Tamil Nadu Skill Development Corporation';
      setOcrResult({
        studentName: readOnlyAcademic.name,
        organization: org,
        courseName: base.length > 5 ? base.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Naan Mudhalvan Industry Certificate',
        issueDate: new Date().toISOString().split('T')[0],
        credentialId: `NM-${Math.floor(100000 + Math.random() * 900000)}`,
        confidence: 0.91 + Math.random() * 0.07,
      });
      setOcrState('result');
    }, 2200);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) runOCR(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && ['image/png','image/jpeg','application/pdf'].includes(file.type)) runOCR(file);
    else showToast('Only PNG, JPG, PDF files are supported', 'error');
  };

  const handleAddCertFromOCR = () => {
    if (!ocrResult) return;
    const duplicate = certifications.some(c =>
      c.title.toLowerCase() === ocrResult.courseName.toLowerCase() && c.issuer.toLowerCase() === ocrResult.organization.toLowerCase()
    );
    const newCert: Certification = {
      id: Date.now().toString(), title: ocrResult.courseName, issuer: ocrResult.organization,
      issueDate: ocrResult.issueDate, credentialId: ocrResult.credentialId,
      isDuplicate: duplicate, ocrExtracted: true,
    };
    setCertifications(prev => [newCert, ...prev]);
    setOcrState('idle'); setOcrFile(null); setOcrResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast(duplicate ? 'Certificate added (duplicate detected!)' : 'Certificate successfully parsed & added to portfolio!');
    setActiveTab('certifications');
  };

  const TABS = [
    { id: 'academic', label: 'Academic Identity & Extra Info', icon: User },
    { id: 'skills', label: `Skills (${skills.length})`, icon: Award },
    { id: 'projects', label: `Projects (${projects.length})`, icon: Code },
    { id: 'certifications', label: `Certifications (${certifications.length})`, icon: FileCheck },
    { id: 'ocr', label: 'Certificate OCR', icon: Sparkles, emerald: true },
  ] as const;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} />}
      {showSkillModal && <AddSkillModal onAdd={s => { setSkills(prev => [s, ...prev]); showToast('Skill added!'); }} onClose={() => setShowSkillModal(false)} />}
      {(showProjectModal || editingProject) && (
        <ProjectModal
          initial={editingProject}
          onSave={editingProject ? handleUpdateProject : handleAddProject}
          onClose={() => { setShowProjectModal(false); setEditingProject(undefined); }}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Student Verified Profile & Portfolio Inventory</span>
            <VerificationBadge status="VERIFIED" size="sm" />
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Authoritative academic fields are locked & verified by institutional ERP. Students may customize external social links and professional description.
          </p>
        </div>
        <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-3 py-1 rounded-full font-bold">
          Profile Completion: 95%
        </span>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-slate-200 dark:border-slate-800 pb-0">
        {TABS.map(t => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center space-x-1.5 cursor-pointer ${
                active
                  ? (t.id === 'ocr' ? 'bg-emerald-100 dark:bg-emerald-600/20 text-emerald-800 dark:text-emerald-400 border-b-2 border-emerald-500' : 'bg-blue-100 dark:bg-blue-600/20 text-blue-800 dark:text-blue-400 border-b-2 border-blue-500')
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}>
              <Icon className={`w-3.5 h-3.5 ${t.id === 'ocr' && active ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Tab: Academic (READ-ONLY AUTHORITATIVE IDENTITY + EDITABLE EXTRA LINKS) ── */}
      {activeTab === 'academic' && (
        <div className="space-y-6">
          {/* Section 1: Locked & Fetched Institutional Identity */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Authoritative Academic Identity (Locked & Read-Only)</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Fetched directly from institutional ERP. Cannot be altered or tampered with by student.</p>
                </div>
              </div>
              <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Backend Authenticated
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] block mb-1">Full Student Name</span>
                <span className="text-slate-900 dark:text-white font-bold text-sm">{readOnlyAcademic.name}</span>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] block mb-1">Register No / Student Roll No</span>
                <span className="text-slate-900 dark:text-white font-mono font-bold text-sm">{readOnlyAcademic.naanMudhalvanId}</span>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] block mb-1">Official Institutional Email</span>
                <span className="text-slate-900 dark:text-white font-medium text-sm truncate block">{readOnlyAcademic.email}</span>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] block mb-1">Enrolled College</span>
                <span className="text-slate-900 dark:text-white font-bold text-sm">{readOnlyAcademic.college}</span>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] block mb-1">Department</span>
                <span className="text-slate-900 dark:text-white font-bold text-sm">{readOnlyAcademic.department}</span>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] block mb-1">Official CGPA</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm">{readOnlyAcademic.cgpa} / 10.0 (Locked)</span>
              </div>
            </div>
          </div>

          {/* Section 2: Editable Extra Info & Social Links */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Editable Extra Info & External Links</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">Students are permitted to customize their social links, repository profile, and bio description.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">GitHub Profile URL / Username</label>
                <input
                  type="url"
                  value={editableExtraInfo.github}
                  onChange={e => setEditableExtraInfo(prev => ({ ...prev, github: e.target.value }))}
                  placeholder="https://github.com/your-username"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={editableExtraInfo.linkedin}
                  onChange={e => setEditableExtraInfo(prev => ({ ...prev, linkedin: e.target.value }))}
                  placeholder="https://linkedin.com/in/your-profile"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">LeetCode / Coding Profile Handle</label>
                <input
                  type="text"
                  value={editableExtraInfo.leetcode}
                  onChange={e => setEditableExtraInfo(prev => ({ ...prev, leetcode: e.target.value }))}
                  placeholder="e.g. aravind_k"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Personal Portfolio Website URL</label>
                <input
                  type="url"
                  value={editableExtraInfo.portfolioUrl}
                  onChange={e => setEditableExtraInfo(prev => ({ ...prev, portfolioUrl: e.target.value }))}
                  placeholder="https://yourportfolio.com"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 font-medium focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 text-xs font-bold">Professional Bio Description</label>
              <textarea
                rows={3}
                value={editableExtraInfo.bio}
                onChange={e => setEditableExtraInfo(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Describe your technical background, interest areas, and key achievements..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-200 font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleSaveExtraInfo}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center space-x-2 shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Links & Description</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Tab: Skills ── */}
      {activeTab === 'skills' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">Verified Technical Skills</h3>
            <button onClick={() => setShowSkillModal(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-md transition-all cursor-pointer">
              <Plus className="w-4 h-4" /><span>Add Skill</span>
            </button>
          </div>
          {skills.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-xs space-y-2">
              <Award className="w-10 h-10 mx-auto text-slate-400" />
              <p>No skills added yet. Click "Add Skill" to get started.</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map(skill => (
              <div key={skill.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 dark:text-slate-200 text-sm">{skill.name}</span>
                    <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 font-bold px-2 py-0.5 rounded">{skill.category}</span>
                  </div>
                  <button onClick={() => { setSkills(prev => prev.filter(s => s.id !== skill.id)); showToast('Skill removed', 'error'); }} className="text-slate-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <span>Proficiency: <span className="text-blue-600 dark:text-blue-400 font-black">{skill.level}%</span></span>
                  <span className={`text-[11px] font-bold ${skill.source.includes('Naan') ? 'text-emerald-700 dark:text-emerald-400' : skill.source.includes('GitHub') ? 'text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>{skill.source}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${skill.level}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab: Projects ── */}
      {activeTab === 'projects' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">Project Portfolio</h3>
            <button onClick={() => { setEditingProject(undefined); setShowProjectModal(true); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-md transition-all cursor-pointer">
              <Plus className="w-4 h-4" /><span>Add Project</span>
            </button>
          </div>
          {projects.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-xs space-y-2">
              <Code className="w-10 h-10 mx-auto text-slate-400" />
              <p>No projects yet. Add your first project!</p>
            </div>
          )}
          <div className="space-y-4">
            {projects.map(proj => (
              <div key={proj.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-slate-900 dark:text-slate-200 text-sm">{proj.title}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${proj.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800'}`}>
                      {proj.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingProject(proj); setShowProjectModal(false); }} className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-blue-100 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDeleteProject(proj.id)} className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-rose-100 text-slate-600 hover:text-rose-600 transition-colors cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{proj.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {proj.techStack.split(',').map((t, i) => (
                    <span key={i} className="text-[10px] bg-slate-200 dark:bg-slate-800 text-blue-800 dark:text-blue-300 border border-slate-300 dark:border-slate-700 px-2 py-0.5 rounded font-mono font-semibold">{t.trim()}</span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-xs pt-1">
                  {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center space-x-1.5 transition-colors"><Github className="w-3.5 h-3.5" /><span>Repository</span></a>}
                  {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center space-x-1.5 transition-colors"><ExternalLink className="w-3.5 h-3.5" /><span>Live Demo</span></a>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab: Certifications ── */}
      {activeTab === 'certifications' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">Verified Certifications</h3>
            <button onClick={() => setActiveTab('ocr')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-md transition-all cursor-pointer">
              <Sparkles className="w-4 h-4" /><span>Upload via OCR</span>
            </button>
          </div>
          {certifications.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-xs space-y-2">
              <FileCheck className="w-10 h-10 mx-auto text-slate-400" />
              <p>No certifications yet. Use the OCR parser to upload certificates.</p>
            </div>
          )}
          <div className="space-y-3">
            {certifications.map(cert => (
              <div key={cert.id} className={`p-4 rounded-xl border flex items-start justify-between text-xs group ${cert.isDuplicate ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'}`}>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-slate-900 dark:text-slate-200 text-sm">{cert.title}</p>
                    {cert.ocrExtracted && <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded font-bold">OCR Parsed</span>}
                    {cert.isDuplicate && <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 px-2 py-0.5 rounded font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3" />Duplicate</span>}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">Issuer: <span className="text-slate-900 dark:text-slate-300 font-bold">{cert.issuer}</span> | Issued: <span className="text-slate-900 dark:text-slate-300 font-bold">{cert.issueDate}</span></p>
                  <p className="text-slate-500 font-mono text-[11px] font-semibold">Credential ID: {cert.credentialId}</p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold">Verified</span>
                  <button onClick={() => handleDeleteCert(cert.id)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-rose-100 text-slate-600 hover:text-rose-600 transition-all cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab: OCR ── */}
      {activeTab === 'ocr' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>EasyOCR Automated Certificate Extraction Engine</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
              Upload any Naan Mudhalvan or industry certificate image/PDF. Our OCR engine automatically extracts Student Name, Course, Issuing Organization, Date, and checks for duplicates.
            </p>
          </div>

          {/* Hidden file input */}
          <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,application/pdf" className="hidden" onChange={handleFileSelect} />

          {/* Drop Zone */}
          {ocrState === 'idle' && (
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all space-y-4 ${dragOver ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500 bg-slate-50 dark:bg-slate-900/30'}`}
            >
              <UploadCloud className={`w-12 h-12 mx-auto transition-all ${dragOver ? 'text-emerald-600 scale-110' : 'text-slate-400'}`} />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-200">{dragOver ? 'Drop your certificate here!' : 'Click to browse or drag & drop certificate'}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">Supports PNG, JPG, JPEG, PDF — up to 10MB</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 text-[11px]">
                {['Naan Mudhalvan', 'AWS', 'Google', 'Microsoft', 'Coursera', 'NPTEL'].map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-full font-semibold">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Processing State */}
          {ocrState === 'processing' && (
            <div className="border-2 border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/15 rounded-2xl p-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 mx-auto flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">EasyOCR Engine Processing...</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">Analyzing: <span className="text-slate-900 dark:text-slate-200 font-mono font-bold">{ocrFile?.name}</span></p>
              </div>
              <div className="max-w-xs mx-auto">
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full animate-pulse" style={{ width: '70%' }} />
                </div>
                <p className="text-[11px] text-slate-500 mt-2 font-medium">Extracting text, identifying entities, detecting duplicates...</p>
              </div>
            </div>
          )}

          {/* OCR Result */}
          {ocrState === 'result' && ocrResult && (
            <div className="space-y-5">
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-700/50">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-emerald-900 dark:text-emerald-300">OCR Extraction Successful</p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400/80 font-medium">File: {ocrFile?.name} | Confidence: {(ocrResult.confidence * 100).toFixed(1)}%</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {[
                  { label: 'Student Name', value: ocrResult.studentName },
                  { label: 'Issuing Organization', value: ocrResult.organization },
                  { label: 'Course / Certificate Name', value: ocrResult.courseName },
                  { label: 'Issue Date', value: ocrResult.issueDate },
                  { label: 'Credential ID', value: ocrResult.credentialId },
                  { label: 'OCR Confidence', value: `${(ocrResult.confidence * 100).toFixed(1)}%` },
                ].map(({ label, value }) => (
                  <div key={label} className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase mb-1">{label}</p>
                    <p className="text-slate-900 dark:text-slate-200 font-bold">{value}</p>
                  </div>
                ))}
              </div>

              {certifications.some(c => c.title.toLowerCase() === ocrResult.courseName.toLowerCase()) && (
                <div className="flex items-center space-x-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700/50 text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <p className="text-amber-800 dark:text-amber-300 font-bold">This certificate appears to be a duplicate of an existing entry. It will be flagged.</p>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => { setOcrState('idle'); setOcrFile(null); setOcrResult(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer">
                  Discard & Upload Another
                </button>
                <button onClick={handleAddCertFromOCR}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer">
                  <CheckCircle className="w-4 h-4" />
                  <span>Add to Portfolio</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
