'use client';

import React, { useState, useCallback } from 'react';
import { FileText, Sparkles, RefreshCw, Printer, CheckCircle, AlertTriangle, Info } from 'lucide-react';

// ─── Role-specific resume data ────────────────────────────────────────────────
const ROLE_DATA: Record<string, {
  title: string;
  summary: string;
  skills: { label: string; value: string }[];
  projects: { name: string; tech: string; bullets: string[] }[];
  missingKeywords: { text: string; severity: 'error' | 'warn' }[];
  atsScore: number;
  atsGrade: string;
}> = {
  'Software Engineer': {
    title: 'Software Engineer (Full Stack)',
    summary: 'Highly analytical Full Stack Software Engineering candidate with 9.4 CGPA in Computer Science & Engineering. Demonstrated expertise in React/Next.js and Node.js architectures. Author of 4+ applications with 70+ GitHub stars. Naan Mudhalvan Skill Mission verified.',
    skills: [
      { label: 'Languages', value: 'TypeScript, JavaScript, Python, C++, SQL' },
      { label: 'Frontend', value: 'React.js, Next.js (App Router), HTML5/CSS3, Redux' },
      { label: 'Backend & Cloud', value: 'Node.js, Express.js, FastAPI, PostgreSQL, Redis, Docker, REST APIs' },
      { label: 'Tools', value: 'Git, GitHub, LeetCode (245 solved), AWS Practitioner, Prisma ORM' },
    ],
    projects: [
      { name: 'AI Smart Traffic Management System | Python, FastAPI, YOLOv8, React', tech: '2025', bullets: ['Engineered real-time computer vision pipeline analyzing live road cameras with YOLOv8, reducing wait times by 22%.', 'Architected REST APIs in FastAPI with React dashboard displaying live camera telemetry.'] },
      { name: 'Cloud Native Microservices E-Commerce | Node.js, PostgreSQL, Redis', tech: '2025', bullets: ['Designed modular microservice architecture handling product catalog, authentication, and payments.', 'Integrated Redis caching reducing API response latency from 180ms to 24ms.'] },
    ],
    missingKeywords: [
      { text: 'Docker / Kubernetes', severity: 'error' },
      { text: 'CI/CD Pipelines (Jenkins/GitHub Actions)', severity: 'error' },
      { text: 'Unit Testing (Jest/Pytest)', severity: 'warn' },
    ],
    atsScore: 88,
    atsGrade: 'A+',
  },
  'AI Engineer': {
    title: 'AI / Machine Learning Engineer',
    summary: 'AI-focused engineering candidate with 9.4 CGPA, specializing in Python-based ML pipelines, computer vision, and NLP. Hands-on with PyTorch, TensorFlow, XGBoost, and SHAP explainability. Naan Mudhalvan Advanced Data Science certified.',
    skills: [
      { label: 'ML Frameworks', value: 'PyTorch, TensorFlow, Scikit-learn, XGBoost, SHAP' },
      { label: 'Languages', value: 'Python, C++, SQL, JavaScript' },
      { label: 'AI Tools', value: 'OpenCV, YOLOv8, HuggingFace Transformers, LangChain, EasyOCR' },
      { label: 'MLOps', value: 'FastAPI, Docker, MLflow, Jupyter, Pandas, NumPy, Matplotlib' },
    ],
    projects: [
      { name: 'AI Smart Traffic Vision Pipeline | Python, YOLOv8, OpenCV, FastAPI', tech: '2025', bullets: ['Built real-time object detection pipeline processing 30fps camera feeds, achieving 94.2% mAP on custom dataset.', 'Deployed REST inference API with FastAPI serving 1,200+ requests/hour with 42ms avg latency.'] },
      { name: 'Explainable Employment Eligibility Predictor | XGBoost, SHAP', tech: '2025', bullets: ['Designed tabular XGBoost model achieving 94.2% accuracy on 500-student dataset.', 'Integrated SHAP attribution for per-feature explanations displayed in interactive dashboard.'] },
    ],
    missingKeywords: [
      { text: 'LLM Fine-tuning / RAG Pipeline', severity: 'error' },
      { text: 'MLflow / Model Versioning', severity: 'error' },
      { text: 'Cloud AI (AWS SageMaker / GCP Vertex)', severity: 'warn' },
    ],
    atsScore: 91,
    atsGrade: 'A+',
  },
  'Data Analyst': {
    title: 'Data Analyst',
    summary: 'Data-driven analyst with 9.4 CGPA and hands-on experience in SQL, Python analytics, and Power BI. Skilled in transforming raw data into business insights through exploratory analysis, visualization, and statistical modeling. Naan Mudhalvan certified.',
    skills: [
      { label: 'Analytics', value: 'Python (Pandas, NumPy, Matplotlib, Seaborn), R, Excel, Power BI' },
      { label: 'Databases', value: 'PostgreSQL, MySQL, SQLite, BigQuery' },
      { label: 'Statistics', value: 'Hypothesis Testing, Regression Analysis, A/B Testing, Forecasting' },
      { label: 'Tools', value: 'Jupyter Notebook, Tableau, Looker, dbt, Git' },
    ],
    projects: [
      { name: 'Student Employability Analytics Dashboard | Python, Pandas, Power BI', tech: '2025', bullets: ['Analyzed placement records of 500+ students to identify top skill gaps and department performance trends.', 'Built interactive Power BI dashboards consumed by placement officers and college management.'] },
      { name: 'Traffic Congestion Prediction Using Time-Series | Python, Scikit-learn', tech: '2025', bullets: ['Applied ARIMA and Prophet models to predict peak-hour congestion with 87% accuracy.', 'Delivered weekly automated reports via Python email pipeline.'] },
    ],
    missingKeywords: [
      { text: 'Power BI DAX / Measures', severity: 'error' },
      { text: 'dbt / Data Warehouse experience', severity: 'warn' },
      { text: 'Apache Spark / Big Data', severity: 'warn' },
    ],
    atsScore: 84,
    atsGrade: 'A',
  },
  'Frontend Developer': {
    title: 'Frontend Developer (React / Next.js)',
    summary: 'Creative Frontend Developer with 9.4 CGPA, expert in building pixel-perfect, accessible web applications using React.js and Next.js App Router. Proficient in CSS animations, performance optimization, and state management with Redux/Zustand.',
    skills: [
      { label: 'Core', value: 'React.js 19, Next.js 15 (App Router), TypeScript, JavaScript (ES2024)' },
      { label: 'Styling', value: 'Tailwind CSS, CSS Modules, Framer Motion, SCSS, styled-components' },
      { label: 'State & APIs', value: 'Zustand, Redux Toolkit, TanStack Query (React Query), REST, GraphQL' },
      { label: 'Tools', value: 'Vite, Webpack, Storybook, Playwright, Jest, Figma, Git' },
    ],
    projects: [
      { name: 'Naan Mudhalvan Portfolio SaaS | React, Next.js, TailwindCSS, Recharts', tech: '2025', bullets: ['Built enterprise-grade SaaS dashboard with role-based portals, dark mode, and Recharts analytics.', 'Achieved 98 Lighthouse performance score via React Suspense, lazy loading, and ISR.'] },
      { name: 'Real-Time Traffic Dashboard UI | React, WebSockets, D3.js', tech: '2025', bullets: ['Designed animated real-time canvas-based traffic map with D3.js force simulation.', 'Implemented WebSocket updates at 2-second intervals with smooth React state reconciliation.'] },
    ],
    missingKeywords: [
      { text: 'Web Accessibility (WCAG 2.1)', severity: 'error' },
      { text: 'Micro-Frontend Architecture', severity: 'warn' },
      { text: 'Playwright / E2E Testing', severity: 'warn' },
    ],
    atsScore: 90,
    atsGrade: 'A+',
  },
  'Backend Developer': {
    title: 'Backend Developer (Node.js / Python)',
    summary: 'Backend engineering candidate with 9.4 CGPA specializing in Node.js microservices, PostgreSQL schema design, and FastAPI-based AI inference APIs. Strong in REST API design, Redis caching, JWT security, and container-native deployments.',
    skills: [
      { label: 'Languages', value: 'TypeScript, Python, SQL, Bash' },
      { label: 'Backend', value: 'Node.js, Express.js, FastAPI, Prisma ORM, REST APIs, GraphQL' },
      { label: 'Databases', value: 'PostgreSQL, MySQL, Redis, MongoDB, SQLite' },
      { label: 'DevOps & Security', value: 'Docker, GitHub Actions, JWT/OAuth2, bcrypt, Helmet.js, rate limiting' },
    ],
    projects: [
      { name: 'Cloud Native Microservices E-Commerce | Node.js, PostgreSQL, Redis, Docker', tech: '2025', bullets: ['Architected 6-service microservice system with service discovery and API gateway.', 'Reduced response latency by 87% via Redis caching and query optimization on 10M+ row tables.'] },
      { name: 'FastAPI AI Inference Service | Python, XGBoost, SHAP, Docker', tech: '2025', bullets: ['Built production FastAPI service handling 1,400+ daily AI prediction requests with 41ms P95 latency.', 'Implemented JWT RBAC middleware and rate limiting protecting 12 secure API endpoints.'] },
    ],
    missingKeywords: [
      { text: 'Kubernetes / Helm Charts', severity: 'error' },
      { text: 'Apache Kafka / Message Queues', severity: 'error' },
      { text: 'gRPC / Protobuf', severity: 'warn' },
    ],
    atsScore: 86,
    atsGrade: 'A',
  },
};

const ROLES = Object.keys(ROLE_DATA);

export default function ResumeStudioPage() {
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [appliedRole, setAppliedRole] = useState('Software Engineer');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(true);

  const roleChanged = targetRole !== appliedRole;
  const data = ROLE_DATA[appliedRole];

  const handleOptimize = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      setAppliedRole(targetRole);
      setIsGenerating(false);
      setGenerated(true);
    }, 1400);
  }, [targetRole]);

  const handlePrint = () => window.print();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
            <FileText className="w-6 h-6 text-indigo-400" />
            <span>ATS Resume Studio & Optimizer</span>
          </h1>
          <p className="text-xs text-slate-400">Generate ATS-friendly resumes tailored for your target role with keyword optimization.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={handlePrint} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 flex items-center space-x-2 transition-colors">
            <Printer className="w-4 h-4 text-indigo-400" />
            <span>Print / PDF Export</span>
          </button>
          <button
            onClick={handleOptimize}
            disabled={isGenerating}
            className={`px-4 py-2 text-white text-xs font-semibold rounded-xl flex items-center space-x-2 shadow-lg transition-all ${
              roleChanged ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isGenerating ? 'Optimizing...' : roleChanged ? 'Apply & Re-Optimize' : 'Re-Optimize Resume'}</span>
          </button>
        </div>
      </div>

      {/* Role Changed Banner */}
      {roleChanged && !isGenerating && (
        <div className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-emerald-950/40 border border-emerald-700/60 text-xs text-emerald-300 animate-fadeIn">
          <Info className="w-4 h-4 shrink-0" />
          <span>Role changed to <strong>{targetRole}</strong>. Click <strong>Apply & Re-Optimize</strong> to regenerate your resume for this role.</span>
        </div>
      )}

      {/* Controls & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Role Selector */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Job Role</label>
          <select
            value={targetRole}
            onChange={e => setTargetRole(e.target.value)}
            className={`w-full border rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 bg-slate-900 transition-colors ${roleChanged ? 'border-emerald-600/60' : 'border-slate-800'}`}
          >
            {ROLES.map(r => <option key={r} value={r}>{r === 'AI Engineer' ? 'AI / ML Engineer' : r === 'Software Engineer' ? 'Software Engineer (Full Stack)' : r}</option>)}
          </select>
          <div className="text-[11px] text-slate-500">
            Currently showing: <span className="text-indigo-400 font-semibold">{appliedRole}</span>
          </div>
        </div>

        {/* ATS Score */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">ATS Match Score</span>
            <h3 className={`text-4xl font-black mt-1 transition-all ${data.atsScore >= 88 ? 'text-emerald-400' : data.atsScore >= 80 ? 'text-blue-400' : 'text-amber-400'}`}>
              {data.atsScore}%
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              {data.atsScore >= 88 ? 'High probability of passing ATS filters' : 'Good — minor gaps to address'}
            </p>
          </div>
          <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-bold text-xl transition-all ${data.atsScore >= 88 ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-blue-500/10 border-blue-500/40 text-blue-400'}`}>
            {data.atsGrade}
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 uppercase font-semibold">Missing Keywords for <span className="text-indigo-400">{appliedRole}</span></span>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {data.missingKeywords.map((kw, i) => (
              <span key={i} className={`text-[11px] px-2.5 py-0.5 rounded border font-medium ${kw.severity === 'error' ? 'bg-rose-950 text-rose-300 border-rose-800' : 'bg-amber-950 text-amber-300 border-amber-800'}`}>
                {kw.text}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 pt-1">Add these skills to your profile to boost ATS score by ~{data.missingKeywords.length * 3}%</p>
        </div>
      </div>

      {/* Resume Preview */}
      <div id="resume-preview" className="p-8 rounded-2xl border border-slate-300 bg-white text-slate-900 max-w-4xl mx-auto space-y-5 text-xs shadow-2xl print:shadow-none print:border-0">

        {/* Header */}
        <div className="border-b-2 border-slate-900 pb-3 text-center space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 tracking-widest uppercase">Aravind Kumar</h2>
          <p className="text-blue-700 font-semibold text-sm">{data.title} | Naan Mudhalvan Verified</p>
          <p className="text-slate-600">
            aravind.student@college.edu &nbsp;|&nbsp; +91 98401 23456 &nbsp;|&nbsp;
            <a href="https://github.com/aravind-dev" className="text-blue-600">github.com/aravind-dev</a> &nbsp;|&nbsp;
            <a href="https://linkedin.com/in/aravind-kumar-dev" className="text-blue-600">linkedin.com/in/aravind-kumar</a>
          </p>
        </div>

        {/* Summary */}
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-0.5 text-sm uppercase tracking-wider">Professional Summary</h3>
          <p className="text-slate-700 leading-relaxed">{data.summary}</p>
        </div>

        {/* Education */}
        <div className="space-y-2">
          <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-0.5 text-sm uppercase tracking-wider">Education</h3>
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-slate-900">Government Engineering College, Salem — Anna University</p>
              <p className="text-slate-600">B.E. Computer Science & Engineering &nbsp; | &nbsp; CGPA: 9.4 / 10.0</p>
              <p className="text-slate-600">Naan Mudhalvan Skill Mission — Advanced Full Stack + Data Science Tracks</p>
            </div>
            <span className="text-slate-500 whitespace-nowrap ml-4">2021 – 2025</span>
          </div>
        </div>

        {/* Technical Skills */}
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-0.5 text-sm uppercase tracking-wider">Technical Skills</h3>
          <div className="space-y-0.5">
            {data.skills.map((s, i) => (
              <p key={i} className="text-slate-700">
                <strong className="text-slate-900">{s.label}:</strong> {s.value}
              </p>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-0.5 text-sm uppercase tracking-wider">Key Projects</h3>
          {data.projects.map((proj, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{proj.name}</span>
                <span className="ml-2 whitespace-nowrap">{proj.tech}</span>
              </div>
              <ul className="list-disc list-inside text-slate-700 space-y-0.5 pl-2">
                {proj.bullets.map((b, j) => <li key={j}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-0.5 text-sm uppercase tracking-wider">Certifications</h3>
          <p className="text-slate-700">• AWS Certified Cloud Practitioner – Amazon Web Services (Nov 2025)</p>
          <p className="text-slate-700">• Naan Mudhalvan Advanced Full Stack Mastery – TNSDC (Aug 2025)</p>
          <p className="text-slate-700">• Naan Mudhalvan Advanced Data Science – TNSDC (Jun 2025)</p>
        </div>

        {/* Coding Profiles */}
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-0.5 text-sm uppercase tracking-wider">Competitive Programming</h3>
          <p className="text-slate-700">• LeetCode: <strong>245 problems solved</strong> | Max Rating: 1820 (aravind_k)</p>
          <p className="text-slate-700">• GitHub: <strong>580 commits | 24 public repositories | 85 total stars</strong></p>
        </div>
      </div>

      {/* Optimization Tips */}
      <div className="glass-card p-5 rounded-2xl border border-indigo-900/40 bg-indigo-950/15 space-y-3">
        <h3 className="font-bold text-indigo-300 text-sm flex items-center space-x-2">
          <Sparkles className="w-4 h-4" />
          <span>AI Optimization Tips for {appliedRole}</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {data.missingKeywords.map((kw, i) => (
            <div key={i} className={`p-3 rounded-xl border flex items-start space-x-2 ${kw.severity === 'error' ? 'bg-rose-950/30 border-rose-800/50 text-rose-300' : 'bg-amber-950/30 border-amber-800/50 text-amber-300'}`}>
              {kw.severity === 'error' ? <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> : <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />}
              <div>
                <p className="font-bold">{kw.text}</p>
                <p className="text-[11px] opacity-70 mt-0.5">{kw.severity === 'error' ? 'High priority — add to skills' : 'Recommended addition'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
