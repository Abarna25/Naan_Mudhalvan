'use client';

import React from 'react';
import {
  GraduationCap,
  Award,
  Code,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  CheckCircle,
  Sparkles,
  Download
} from 'lucide-react';

export default function PublicPortfolioPage({ params }: { params: { slug: string } }) {
  const student = {
    name: 'Aravind Kumar',
    title: 'Full Stack & Cloud Native Engineer',
    naanId: 'NM-2026-882341',
    college: 'Government Engineering College, Salem',
    department: 'Computer Science & Engineering',
    cgpa: '9.4 / 10.0',
    bio: 'Passionate computer science student specializing in cloud-native microservices, full-stack React/Node.js architecture, and AI vision pipelines. Aligned with Naan Mudhalvan Skill Standards.',
    email: 'aravind.student@college.edu',
    github: 'https://github.com/aravind-dev',
    linkedin: 'https://linkedin.com/in/aravind-kumar-dev',
    skills: [
      { name: 'React.js / Next.js', level: 90 },
      { name: 'Node.js & Express', level: 88 },
      { name: 'TypeScript', level: 85 },
      { name: 'Python & FastAPI', level: 92 },
      { name: 'PostgreSQL & Redis', level: 82 },
      { name: 'Docker & Microservices', level: 78 },
    ],
    projects: [
      {
        title: 'AI Smart Traffic Management System',
        description: 'Computer vision pipeline analyzing live camera streams using YOLOv8 and FastAPI backend with React UI dashboard.',
        tech: ['Python', 'OpenCV', 'YOLOv8', 'FastAPI', 'React'],
        stars: 28,
        github: 'https://github.com/aravind-dev/smart-traffic-ai',
      },
      {
        title: 'Cloud Native Microservices E-Commerce',
        description: 'High-throughput microservices architecture with Redis caching, Kafka messaging queue, and Docker deployment.',
        tech: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker'],
        stars: 42,
        github: 'https://github.com/aravind-dev/microservices-shop',
      },
    ],
    certifications: [
      { title: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', date: 'Nov 2025' },
      { title: 'Naan Mudhalvan Advanced Full Stack Mastery', issuer: 'TNSDC', date: 'Aug 2025' },
    ],
    codingStats: {
      leetcodeSolved: 245,
      leetcodeRating: 1820,
      githubRepos: 24,
      githubStars: 85,
      githubCommits: 580,
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 space-y-12 max-w-5xl mx-auto">
      {/* Top Banner & Header */}
      <header className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full font-medium flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Naan Mudhalvan Verified Student</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {student.naanId}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{student.name}</h1>
            <p className="text-blue-400 text-sm font-semibold">{student.title}</p>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">{student.bio}</p>
          </div>

          <div className="flex flex-col space-y-2">
            <a
              href="#contact"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Candidate</span>
            </a>
            <button className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 flex items-center justify-center space-x-2">
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download Resume</span>
            </button>
          </div>
        </div>

        {/* Academic Bar */}
        <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block">Institution</span>
            <span className="font-medium text-slate-200">{student.college}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Department</span>
            <span className="font-medium text-slate-200">{student.department}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Academic CGPA</span>
            <span className="font-bold text-emerald-400">{student.cgpa}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Social Links</span>
            <div className="flex space-x-3 mt-0.5">
              <a href={student.github} target="_blank" className="text-slate-400 hover:text-slate-200">
                <Github className="w-4 h-4" />
              </a>
              <a href={student.linkedin} target="_blank" className="text-slate-400 hover:text-slate-200">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Verified Skills */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <Award className="w-5 h-5 text-blue-400" />
          <span>Verified Technical Competencies</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {student.skills.map((s, idx) => (
            <div key={idx} className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-200">
                <span>{s.name}</span>
                <span className="text-blue-400">{s.level}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${s.level}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <Code className="w-5 h-5 text-emerald-400" />
          <span>Featured Projects</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {student.projects.map((p, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-100 text-sm">{p.title}</h3>
                  <span className="text-xs text-slate-400 font-mono">⭐ {p.stars}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {p.tech.map((t, tidx) => (
                    <span key={tidx} className="text-[10px] bg-slate-900 text-blue-300 border border-slate-800 px-2 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
                <a
                  href={p.github}
                  target="_blank"
                  className="text-xs text-slate-300 hover:text-white flex items-center space-x-1.5 pt-1"
                >
                  <Github className="w-4 h-4" />
                  <span>View GitHub Repository</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Naan Mudhalvan Certifications */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-amber-400" />
          <span>State & Industry Certifications</span>
        </h2>
        <div className="space-y-3">
          {student.certifications.map((c, idx) => (
            <div key={idx} className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-200">{c.title}</p>
                <p className="text-slate-400">Issued by {c.issuer} | {c.date}</p>
              </div>
              <span className="text-emerald-400 font-medium px-3 py-1 rounded bg-emerald-950/50 border border-emerald-800">
                Verified
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Contact */}
      <footer id="contact" className="glass-card p-6 rounded-2xl border border-slate-800 text-center space-y-2">
        <h3 className="font-bold text-slate-200 text-sm">Interested in hiring {student.name}?</h3>
        <p className="text-xs text-slate-400">Direct Contact: {student.email}</p>
        <p className="text-[11px] text-slate-500 pt-2">Powered by Naan Mudhalvan Automated Student Portfolio Compiler</p>
      </footer>
    </div>
  );
}
