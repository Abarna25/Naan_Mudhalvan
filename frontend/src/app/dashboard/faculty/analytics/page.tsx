'use client';

import React, { useState } from 'react';
import { TrendingUp, Users, Award, AlertTriangle, ArrowUp, CheckCircle, X, Sparkles, Clock, BookOpen, Send, Check } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { useAuthStore } from '@/store/useAuthStore';

interface StudentIntervention {
  name: string;
  cgpa: number;
  score: number;
  missingAreas: string;
}

interface AssignedRoadmapInfo {
  targetRole: string;
  timelineWeeks: number;
  assignedAt: string;
}

const ROLES = ['Software Engineer', 'AI Engineer', 'Data Analyst', 'Frontend Developer', 'Backend Developer'];

export default function FacultyAnalyticsPage() {
  const { accessToken } = useAuthStore();
  const [selectedStudent, setSelectedStudent] = useState<StudentIntervention | null>(null);
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [timelineWeeks, setTimelineWeeks] = useState(4);
  const [facultyNotes, setFacultyNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [assignedRoadmaps, setAssignedRoadmaps] = useState<Record<string, AssignedRoadmapInfo>>({
    'Raju M': { targetRole: 'Software Engineer', timelineWeeks: 4, assignedAt: '2026-07-30' },
  });

  const skillDistribution = [
    { skill: 'React / Frontend', count: 28, color: '#3b82f6' },
    { skill: 'Node.js / Backend', count: 24, color: '#8b5cf6' },
    { skill: 'Python / AI', count: 32, color: '#10b981' },
    { skill: 'Java / DSA', count: 38, color: '#f59e0b' },
    { skill: 'Cloud / DevOps', count: 16, color: '#06b6d4' },
  ];

  const topPerformers = [
    { name: 'Aravind Kumar', cgpa: 9.4, score: 88, projects: 4, certs: 5, rank: 1 },
    { name: 'Kavitha R', cgpa: 9.2, score: 92, projects: 3, certs: 4, rank: 2 },
    { name: 'Sanjay Nathan', cgpa: 8.9, score: 85, projects: 3, certs: 3, rank: 3 },
    { name: 'Deepika S', cgpa: 8.7, score: 83, projects: 2, certs: 4, rank: 4 },
    { name: 'Murugan R', cgpa: 8.5, score: 80, projects: 3, certs: 2, rank: 5 },
  ];

  const interventionNeeded: StudentIntervention[] = [
    { name: 'Praveen S', cgpa: 7.1, score: 62, missingAreas: 'DSA, GitHub Activity, Certifications' },
    { name: 'Meena K', cgpa: 7.4, score: 68, missingAreas: 'NM Certifications, Projects' },
    { name: 'Raju M', cgpa: 6.9, score: 59, missingAreas: 'All Skill Modules, Resume' },
  ];

  const trendData = [
    { month: 'Jan', avgScore: 65, completed: 80 },
    { month: 'Feb', avgScore: 70, completed: 88 },
    { month: 'Mar', avgScore: 76, completed: 92 },
    { month: 'Apr', avgScore: 81, completed: 96 },
    { month: 'May', avgScore: 83, completed: 98 },
    { month: 'Jun', avgScore: 84.5, completed: 124 },
  ];

  const radarData = [
    { subject: 'Technical Skills', score: 88, fullMark: 100 },
    { subject: 'Project Count', score: 82, fullMark: 100 },
    { subject: 'Certifications', score: 90, fullMark: 100 },
    { subject: 'DSA Readiness', score: 74, fullMark: 100 },
    { subject: 'Communication', score: 78, fullMark: 100 },
  ];

  const handleOpenAssignModal = (student: StudentIntervention) => {
    setSelectedStudent(student);
    setFacultyNotes(`Priority intervention for ${student.name}. Please complete weekly milestones targeting: ${student.missingAreas}.`);
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    setIsSubmitting(true);
    try {
      await fetch('http://localhost:5005/api/v1/faculty/assign-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          studentName: selectedStudent.name,
          targetRole,
          missingAreas: selectedStudent.missingAreas,
          timelineWeeks,
          notes: facultyNotes,
        }),
      });

      setAssignedRoadmaps(prev => ({
        ...prev,
        [selectedStudent.name]: {
          targetRole,
          timelineWeeks,
          assignedAt: new Date().toISOString().split('T')[0],
        },
      }));

      setToastMessage(`✓ Tailored ${timelineWeeks}-week roadmap assigned to ${selectedStudent.name}!`);
      setTimeout(() => setToastMessage(null), 4000);
      setSelectedStudent(null);
    } catch {
      setAssignedRoadmaps(prev => ({
        ...prev,
        [selectedStudent.name]: {
          targetRole,
          timelineWeeks,
          assignedAt: new Date().toISOString().split('T')[0],
        },
      }));
      setToastMessage(`✓ Roadmap assigned to ${selectedStudent.name}!`);
      setTimeout(() => setToastMessage(null), 4000);
      setSelectedStudent(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getActionModules = (missing: string) => {
    const modules: string[] = [];
    const lower = missing.toLowerCase();
    if (lower.includes('dsa')) modules.push('Algorithms & DSA Practice (30-Day LeetCode Plan)');
    if (lower.includes('github')) modules.push('GitHub Commits & Portfolio README Accelerator');
    if (lower.includes('cert')) modules.push('Naan Mudhalvan TNSDC Verified Certificate Track');
    if (lower.includes('project')) modules.push('Cloud Microservices / AI Full Stack Project Build');
    if (lower.includes('resume')) modules.push('ATS Resume Studio Keyword Optimization');
    if (lower.includes('skill')) modules.push('Technical Skill Assessment Refresh');
    return modules.length > 0 ? modules : ['Curated Skill Gap Action Plan'];
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-4 py-3 rounded-xl bg-emerald-800 text-white border border-emerald-700 shadow-2xl text-xs font-bold animate-fadeIn">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Assign Roadmap Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Assign Intervention Roadmap</h3>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between font-bold text-slate-900 dark:text-slate-200">
                <span>{selectedStudent.name}</span>
                <span className="text-rose-600 dark:text-rose-400 font-extrabold">Eligibility Score: {selectedStudent.score}%</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium">CGPA: {selectedStudent.cgpa} | Dept: Computer Science & Engineering</p>
              <div className="flex items-center space-x-1.5 pt-1">
                <span className="text-slate-500 font-bold">Identified Gaps:</span>
                <span className="text-rose-700 dark:text-rose-300 font-bold">{selectedStudent.missingAreas}</span>
              </div>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Target Job Role</label>
                <select
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-200 font-bold focus:outline-none focus:border-indigo-500"
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Intervention Timeline</label>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 4, 6, 8].map(w => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setTimelineWeeks(w)}
                      className={`py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                        timelineWeeks === w ? 'bg-indigo-600 text-white border-indigo-500 shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {w} Weeks
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-2 font-bold">Automated Action Modules (Based on Identified Gaps)</label>
                <div className="space-y-2">
                  {getActionModules(selectedStudent.missingAreas).map((mod, idx) => (
                    <div key={idx} className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-indigo-200 dark:border-indigo-900/40 text-indigo-900 dark:text-indigo-200 font-semibold">
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{mod}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Faculty Instructions / Guidance Notes</label>
                <textarea
                  rows={3}
                  value={facultyNotes}
                  onChange={e => setFacultyNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-200 font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Assign & Dispatch Roadmap</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Class Performance Analytics</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Department-wide student progress, top performers, and intervention alerts.</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl">
          <p className="text-xs text-slate-700 dark:text-slate-400 font-bold uppercase tracking-wider">Dept Students</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">124</h3>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-bold flex items-center"><ArrowUp className="w-3 h-3 mr-1" />+4 this semester</p>
        </div>
        <div className="glass-card p-5 rounded-2xl">
          <p className="text-xs text-slate-700 dark:text-slate-400 font-bold uppercase tracking-wider">Avg Eligibility</p>
          <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">84.5%</h3>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-bold flex items-center"><ArrowUp className="w-3 h-3 mr-1" />+8% vs Jan baseline</p>
        </div>
        <div className="glass-card p-5 rounded-2xl">
          <p className="text-xs text-slate-700 dark:text-slate-400 font-bold uppercase tracking-wider">Tier-1 Ready</p>
          <h3 className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">42</h3>
          <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 font-bold">Score ≥ 85%</p>
        </div>
        <div className="glass-card p-5 rounded-2xl">
          <p className="text-xs text-slate-700 dark:text-slate-400 font-bold uppercase tracking-wider">Needs Intervention</p>
          <h3 className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-1">8</h3>
          <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 font-bold flex items-center"><AlertTriangle className="w-3 h-3 mr-1" />Score below 70%</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Trend Line Chart */}
        <div className="glass-card p-6 rounded-2xl space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-slate-100">Class Eligibility Score Trend (Jan–Jun 2026)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[60, 90]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="avgScore" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: '#3b82f6' }} name="Avg Score %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Radar */}
        <div className="glass-card p-6 rounded-2xl space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-slate-100">Department Skill Readiness Spectrum</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar name="Department" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Skill Distribution Bar */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-slate-100">Primary Skill Distribution Across CSE Department</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={skillDistribution} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="skill" type="category" tick={{ fontSize: 11 }} width={120} />
              <Tooltip />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} fill="#3b82f6" name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performers Table */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>Department Top Performers</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 text-[10px] font-bold uppercase">
              <tr>
                <th className="p-3">Rank</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">CGPA</th>
                <th className="p-3">Eligibility Score</th>
                <th className="p-3">Projects</th>
                <th className="p-3">Certifications</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {topPerformers.map((s) => (
                <tr key={s.rank} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                      s.rank === 1 ? 'bg-amber-500 text-white' :
                      s.rank === 2 ? 'bg-slate-400 text-white' :
                      s.rank === 3 ? 'bg-amber-700 text-white' :
                      'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {s.rank}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{s.name}</td>
                  <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">{s.cgpa}</td>
                  <td className="p-3 font-black text-emerald-600 dark:text-emerald-400">{s.score}%</td>
                  <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">{s.projects}</td>
                  <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">{s.certs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Intervention Needed */}
      <div className="glass-card p-6 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/10 space-y-4">
        <h3 className="font-bold text-rose-800 dark:text-rose-300 flex items-center space-x-2 text-base">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          <span>Students Requiring Immediate Intervention</span>
        </h3>
        <div className="space-y-3">
          {interventionNeeded.map((s, idx) => {
            const assigned = assignedRoadmaps[s.name];
            return (
              <div key={idx} className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">{s.name}</p>
                    {assigned && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        Roadmap Active ({assigned.timelineWeeks} Wks)
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">
                    CGPA: <strong className="text-slate-900 dark:text-slate-200">{s.cgpa}</strong> | Eligibility: <span className="text-rose-600 dark:text-rose-400 font-extrabold">{s.score}%</span>
                  </p>
                  <p className="text-rose-700 dark:text-rose-300 font-bold">Missing Gaps: {s.missingAreas}</p>
                </div>
                <button
                  onClick={() => handleOpenAssignModal(s)}
                  className={`px-4 py-2 text-[11px] font-bold rounded-xl border transition-all flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer ${
                    assigned
                      ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/60 hover:bg-emerald-200'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 shadow-md'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{assigned ? `✓ Re-Assign Roadmap` : 'Assign Roadmap'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
