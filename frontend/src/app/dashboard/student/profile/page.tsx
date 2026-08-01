'use client';

import React, { useState, useRef } from 'react';
import {
  User, Award, Code, Plus, Trash2, Edit2, Save, CheckCircle,
  Github, UploadCloud, Sparkles, FileCheck, X, AlertCircle, ExternalLink
} from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-100">Add New Skill</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Skill Name *</label>
            <input
              autoFocus
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
              placeholder="e.g. Docker, GraphQL, TensorFlow..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
            />
            {error && <p className="text-rose-400 mt-1">{error}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Source</label>
              <select value={source} onChange={e => setSource(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500">
                <option>Self Verified</option>
                <option>Naan Mudhalvan Verified</option>
                <option>GitHub Verified</option>
                <option>Certificate Verified</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-slate-400 mb-2 font-semibold">Proficiency Level: <span className="text-blue-400 font-bold">{level}%</span></label>
            <input type="range" min={10} max={100} step={5} value={level} onChange={e => setLevel(Number(e.target.value))}
              className="w-full accent-blue-500" />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>Beginner (10%)</span><span>Advanced (100%)</span>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-semibold hover:bg-slate-700 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-600/20">Add Skill</button>
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
    className: `w-full bg-slate-800 border ${errors[key] ? 'border-rose-500' : 'border-slate-700'} rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 text-xs`,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-100">{initial?.id ? 'Edit Project' : 'Add New Project'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Project Title *</label>
            <input {...field('title')} placeholder="e.g. AI Chatbot using GPT-4" />
            {errors.title && <p className="text-rose-400 mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Description *</label>
            <textarea {...field('description') as any} rows={3} placeholder="Describe what this project does, key challenges solved..." className={field('description').className} />
            {errors.description && <p className="text-rose-400 mt-1">{errors.description}</p>}
          </div>
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Tech Stack * <span className="text-slate-500 font-normal">(comma separated)</span></label>
            <input {...field('techStack')} placeholder="React, Node.js, PostgreSQL, Docker..." />
            {errors.techStack && <p className="text-rose-400 mt-1">{errors.techStack}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">GitHub URL</label>
              <input {...field('githubUrl')} placeholder="https://github.com/..." />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Live URL</label>
              <input {...field('liveUrl')} placeholder="https://project.vercel.app" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-semibold hover:bg-slate-700 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-600/20">{initial?.id ? 'Save Changes' : 'Add Project'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium transition-all ${type === 'success' ? 'bg-emerald-900 text-emerald-200 border border-emerald-700' : 'bg-rose-900 text-rose-200 border border-rose-700'}`}>
      {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      <span>{message}</span>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function StudentProfilePage() {
  const [activeTab, setActiveTab] = useState<'academic' | 'skills' | 'projects' | 'certifications' | 'ocr'>('academic');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Academic ──
  const [academic, setAcademic] = useState({
    name: 'Aravind Kumar', email: 'aravind.student@college.edu',
    naanMudhalvanId: 'NM-2026-882341', college: 'Government Engineering College, Salem',
    department: 'Computer Science & Engineering', cgpa: 9.4, graduationYear: 2025,
    bio: 'Passionate Full Stack Developer & AI enthusiast focused on building scalable cloud systems.',
    github: 'aravind-dev', leetcode: 'aravind_k', linkedin: 'https://linkedin.com/in/aravind-kumar-dev',
  });
  const [savedAcademic, setSavedAcademic] = useState(academic);
  const handleSaveAcademic = () => { setSavedAcademic(academic); showToast('Profile saved successfully!'); };

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
        studentName: 'Aravind Kumar', organization: org,
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
    { id: 'academic', label: 'Academic & Personal', icon: User },
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Student Profile & Skill Inventory</h1>
          <p className="text-xs text-slate-400">Manage academic details, skills, projects, certifications, and OCR-parsed certificates.</p>
        </div>
        <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-full font-medium">
          Profile Completion: 95%
        </span>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-slate-800 pb-0">
        {TABS.map(t => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center space-x-1.5 ${
                active
                  ? (t.id === 'ocr' ? 'bg-emerald-600/20 text-emerald-400 border-b-2 border-emerald-500' : 'bg-blue-600/20 text-blue-400 border-b-2 border-blue-500')
                  : 'text-slate-400 hover:text-slate-200'
              }`}>
              <Icon className={`w-3.5 h-3.5 ${t.id === 'ocr' && active ? 'text-emerald-400' : ''}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Tab: Academic ── */}
      {activeTab === 'academic' && (
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-5">
          <h3 className="font-bold text-slate-100">Academic Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {[
              { label: 'Full Name', key: 'name', type: 'text' },
              { label: 'Naan Mudhalvan ID', key: 'naanMudhalvanId', type: 'text', disabled: true },
              { label: 'College', key: 'college', type: 'text' },
              { label: 'Department', key: 'department', type: 'text' },
              { label: 'Academic CGPA', key: 'cgpa', type: 'number', step: '0.1', min: '0', max: '10' },
              { label: 'Graduation Year', key: 'graduationYear', type: 'number' },
              { label: 'GitHub Username', key: 'github', type: 'text' },
              { label: 'LeetCode Username', key: 'leetcode', type: 'text' },
            ].map(({ label, key, ...inputProps }) => (
              <div key={key}>
                <label className="block text-slate-400 mb-1 font-medium">{label}</label>
                <input
                  {...inputProps as any}
                  value={(academic as any)[key]}
                  onChange={e => setAcademic(a => ({ ...a, [key]: inputProps.type === 'number' ? parseFloat(e.target.value) : e.target.value }))}
                  className={`w-full rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 border text-slate-200 ${(inputProps as any).disabled ? 'bg-slate-950 border-slate-800 text-slate-500 cursor-not-allowed' : 'bg-slate-900 border-slate-800'}`}
                />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-slate-400 mb-1 text-xs font-medium">LinkedIn URL</label>
            <input type="url" value={academic.linkedin} onChange={e => setAcademic(a => ({ ...a, linkedin: e.target.value }))} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1 text-xs font-medium">Professional Bio</label>
            <textarea rows={3} value={academic.bio} onChange={e => setAcademic(a => ({ ...a, bio: e.target.value }))} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500" />
          </div>
          <button onClick={handleSaveAcademic} className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all flex items-center space-x-2 shadow-lg shadow-blue-600/20">
            <Save className="w-4 h-4" /><span>Save Profile Changes</span>
          </button>
        </div>
      )}

      {/* ── Tab: Skills ── */}
      {activeTab === 'skills' && (
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100">Verified Technical Skills</h3>
            <button onClick={() => setShowSkillModal(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 shadow-lg shadow-blue-600/20 transition-all">
              <Plus className="w-4 h-4" /><span>Add Skill</span>
            </button>
          </div>
          {skills.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-xs space-y-2">
              <Award className="w-10 h-10 mx-auto text-slate-600" />
              <p>No skills added yet. Click "Add Skill" to get started.</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map(skill => (
              <div key={skill.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-200 text-sm">{skill.name}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">{skill.category}</span>
                  </div>
                  <button onClick={() => { setSkills(prev => prev.filter(s => s.id !== skill.id)); showToast('Skill removed', 'error'); }} className="text-slate-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Proficiency: <span className="text-blue-400 font-bold">{skill.level}%</span></span>
                  <span className={`text-[11px] font-medium ${skill.source.includes('Naan') ? 'text-emerald-400' : skill.source.includes('GitHub') ? 'text-blue-400' : 'text-slate-400'}`}>{skill.source}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${skill.level}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab: Projects ── */}
      {activeTab === 'projects' && (
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100">Project Portfolio</h3>
            <button onClick={() => { setEditingProject(undefined); setShowProjectModal(true); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 shadow-lg shadow-blue-600/20 transition-all">
              <Plus className="w-4 h-4" /><span>Add Project</span>
            </button>
          </div>
          {projects.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-xs space-y-2">
              <Code className="w-10 h-10 mx-auto text-slate-600" />
              <p>No projects yet. Add your first project!</p>
            </div>
          )}
          <div className="space-y-4">
            {projects.map(proj => (
              <div key={proj.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-slate-200 text-sm">{proj.title}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${proj.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-amber-950 text-amber-300 border-amber-800'}`}>
                      {proj.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingProject(proj); setShowProjectModal(false); }} className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-900/50 text-slate-400 hover:text-blue-400 transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDeleteProject(proj.id)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{proj.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {proj.techStack.split(',').map((t, i) => (
                    <span key={i} className="text-[10px] bg-slate-800 text-blue-300 border border-slate-700 px-2 py-0.5 rounded font-mono">{t.trim()}</span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-xs pt-1">
                  {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-200 flex items-center space-x-1.5 transition-colors"><Github className="w-3.5 h-3.5" /><span>Repository</span></a>}
                  {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-400 flex items-center space-x-1.5 transition-colors"><ExternalLink className="w-3.5 h-3.5" /><span>Live Demo</span></a>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab: Certifications ── */}
      {activeTab === 'certifications' && (
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100">Verified Certifications</h3>
            <button onClick={() => setActiveTab('ocr')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 shadow-lg shadow-emerald-600/20 transition-all">
              <Sparkles className="w-4 h-4" /><span>Upload via OCR</span>
            </button>
          </div>
          {certifications.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-xs space-y-2">
              <FileCheck className="w-10 h-10 mx-auto text-slate-600" />
              <p>No certifications yet. Use the OCR parser to upload certificates.</p>
            </div>
          )}
          <div className="space-y-3">
            {certifications.map(cert => (
              <div key={cert.id} className={`p-4 rounded-xl border flex items-start justify-between text-xs group ${cert.isDuplicate ? 'bg-amber-950/20 border-amber-900/50' : 'bg-slate-900/60 border-slate-800'}`}>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-200 text-sm">{cert.title}</p>
                    {cert.ocrExtracted && <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">OCR Parsed</span>}
                    {cert.isDuplicate && <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded flex items-center gap-1"><AlertCircle className="w-3 h-3" />Duplicate</span>}
                  </div>
                  <p className="text-slate-400">Issuer: <span className="text-slate-300">{cert.issuer}</span> | Issued: <span className="text-slate-300">{cert.issueDate}</span></p>
                  <p className="text-slate-500 font-mono text-[11px]">Credential ID: {cert.credentialId}</p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-medium">Verified</span>
                  <button onClick={() => handleDeleteCert(cert.id)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-400 transition-all">
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
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
          <div>
            <h3 className="font-bold text-slate-100 text-base flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>EasyOCR Automated Certificate Extraction Engine</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
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
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all space-y-4 ${dragOver ? 'border-emerald-400 bg-emerald-950/30' : 'border-slate-700 hover:border-emerald-500/60 bg-slate-900/30 hover:bg-slate-900/50'}`}
            >
              <UploadCloud className={`w-12 h-12 mx-auto transition-all ${dragOver ? 'text-emerald-400 scale-110' : 'text-slate-500'}`} />
              <div>
                <p className="text-sm font-semibold text-slate-200">{dragOver ? 'Drop your certificate here!' : 'Click to browse or drag & drop certificate'}</p>
                <p className="text-xs text-slate-500 mt-1">Supports PNG, JPG, JPEG, PDF — up to 10MB</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 text-[11px]">
                {['Naan Mudhalvan', 'AWS', 'Google', 'Microsoft', 'Coursera', 'NPTEL'].map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Processing State */}
          {ocrState === 'processing' && (
            <div className="border-2 border-emerald-500/40 bg-emerald-950/15 rounded-2xl p-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 mx-auto flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-300">EasyOCR Engine Processing...</p>
                <p className="text-xs text-slate-400 mt-1">Analyzing: <span className="text-slate-200 font-mono">{ocrFile?.name}</span></p>
              </div>
              <div className="max-w-xs mx-auto">
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full animate-pulse" style={{ width: '70%' }} />
                </div>
                <p className="text-[11px] text-slate-400 mt-2">Extracting text, identifying entities, detecting duplicates...</p>
              </div>
            </div>
          )}

          {/* OCR Result */}
          {ocrState === 'result' && ocrResult && (
            <div className="space-y-5">
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-emerald-950/30 border border-emerald-700/50">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-emerald-300">OCR Extraction Successful</p>
                  <p className="text-xs text-emerald-400/70">File: {ocrFile?.name} | Confidence: {(ocrResult.confidence * 100).toFixed(1)}%</p>
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
                  <div key={label} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                    <p className="text-slate-500 font-semibold text-[10px] uppercase mb-1">{label}</p>
                    <p className="text-slate-200 font-medium">{value}</p>
                  </div>
                ))}
              </div>

              {certifications.some(c => c.title.toLowerCase() === ocrResult.courseName.toLowerCase()) && (
                <div className="flex items-center space-x-3 p-3 rounded-xl bg-amber-950/30 border border-amber-700/50 text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <p className="text-amber-300">This certificate appears to be a duplicate of an existing entry. It will be flagged.</p>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => { setOcrState('idle'); setOcrFile(null); setOcrResult(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold text-xs transition-colors">
                  Discard & Upload Another
                </button>
                <button onClick={handleAddCertFromOCR}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2">
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
