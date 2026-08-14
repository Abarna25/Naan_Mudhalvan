'use client';

import React, { useState } from 'react';
import { Map, TrendingUp, BookOpen, ExternalLink, Youtube, CheckCircle, Clock, AlertTriangle, ChevronRight, Sparkles } from 'lucide-react';

const ROLE_DATA: Record<string, {
  overallGap: number;
  strengths: string[];
  gapItems: {
    skill: string;
    currentLevel: number;
    requiredLevel: number;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    resources: { title: string; type: 'gfg' | 'youtube'; url: string; duration: string }[];
  }[];
  roadmap: {
    week: string;
    title: string;
    tasks: string[];
    milestone?: string;
    completed: boolean;
  }[];
}> = {

  'Software Engineer': {
    overallGap: 22,
    strengths: ['React.js (90%)', 'Node.js (88%)', 'TypeScript (85%)', 'Python (92%)', 'PostgreSQL (82%)'],
    gapItems: [
      {
        skill: 'Docker & Containerization', currentLevel: 35, requiredLevel: 80, priority: 'CRITICAL',
        resources: [
          { title: 'Docker Tutorial for Beginners', type: 'gfg', url: 'https://www.geeksforgeeks.org/docker-tutorial/', duration: '2h read' },
          { title: 'Docker Crash Course for Absolute Beginners', type: 'youtube', url: 'https://www.youtube.com/watch?v=pg19Z8LL06w', duration: '1h 5m' },
          { title: 'Docker Compose Tutorial', type: 'gfg', url: 'https://www.geeksforgeeks.org/docker-compose/', duration: '45m read' },
        ],
      },
      {
        skill: 'CI/CD Pipelines (GitHub Actions)', currentLevel: 20, requiredLevel: 75, priority: 'CRITICAL',
        resources: [
          { title: 'CI/CD Pipeline Tutorial', type: 'gfg', url: 'https://www.geeksforgeeks.org/what-is-ci-cd/', duration: '30m read' },
          { title: 'GitHub Actions Full Course', type: 'youtube', url: 'https://www.youtube.com/watch?v=R8_veQiYBjI', duration: '1h 20m' },
          { title: 'DevOps CI/CD Pipeline using Jenkins', type: 'youtube', url: 'https://www.youtube.com/watch?v=m0a2CzgLNsc', duration: '50m' },
        ],
      },
      {
        skill: 'Unit Testing (Jest / Pytest)', currentLevel: 45, requiredLevel: 75, priority: 'HIGH',
        resources: [
          { title: 'Jest Testing Tutorial', type: 'gfg', url: 'https://www.geeksforgeeks.org/jest-tutorial/', duration: '1h read' },
          { title: 'JavaScript Unit Testing with Jest', type: 'youtube', url: 'https://www.youtube.com/watch?v=ajiAl5UNzBU', duration: '42m' },
          { title: 'Pytest Full Course', type: 'youtube', url: 'https://www.youtube.com/watch?v=cHYq1MRoyI0', duration: '55m' },
        ],
      },
    ],
    roadmap: [
      { week: 'Week 1', title: 'Docker Fundamentals', tasks: ['Complete Docker GFG tutorial', 'Containerize existing Node.js app', 'Write docker-compose for multi-service setup', 'Push images to DockerHub'], milestone: 'Docker Ready', completed: false },
      { week: 'Week 2', title: 'CI/CD with GitHub Actions', tasks: ['Set up GitHub Actions workflow for Node.js', 'Add linting and test steps', 'Automate Docker build & push', 'Deploy to Railway via CI'], milestone: 'CI/CD Pipeline Live', completed: false },
      { week: 'Week 3', title: 'Testing Strategy', tasks: ['Write Jest unit tests for API controllers', 'Add Pytest tests for Python services', 'Achieve 70% code coverage', 'Integrate coverage report in CI'], completed: false },
      { week: 'Week 4', title: 'Portfolio Polish & Applications', tasks: ['Update GitHub README with new skills', 'Record 2-min demo video of Docker project', 'Apply to 10+ Software Engineer roles', 'Complete 20 LeetCode problems'], milestone: 'Job-Ready Portfolio', completed: false },
    ],
  },

  'AI Engineer': {
    overallGap: 28,
    strengths: ['Python (92%)', 'YOLOv8/OpenCV (85%)', 'XGBoost (88%)', 'FastAPI (84%)', 'SHAP XAI (82%)'],
    gapItems: [
      {
        skill: 'LLM Fine-tuning / RAG Pipeline', currentLevel: 10, requiredLevel: 80, priority: 'CRITICAL',
        resources: [
          { title: 'LangChain RAG Pipeline Tutorial', type: 'gfg', url: 'https://www.geeksforgeeks.org/langchain-tutorial/', duration: '1.5h read' },
          { title: 'RAG with LangChain & OpenAI Full Course', type: 'youtube', url: 'https://www.youtube.com/watch?v=sVcwVQRHIc8', duration: '2h 10m' },
          { title: 'Fine-Tuning LLMs with HuggingFace', type: 'youtube', url: 'https://www.youtube.com/watch?v=eC6Hd1hFvos', duration: '1h 30m' },
        ],
      },
      {
        skill: 'MLflow / Model Versioning', currentLevel: 15, requiredLevel: 70, priority: 'HIGH',
        resources: [
          { title: 'MLflow Tutorial for Beginners', type: 'gfg', url: 'https://www.geeksforgeeks.org/mlflow/', duration: '45m read' },
          { title: 'MLflow Crash Course', type: 'youtube', url: 'https://www.youtube.com/watch?v=ksYIVDue8ak', duration: '45m' },
          { title: 'ML Model Tracking with MLflow', type: 'youtube', url: 'https://www.youtube.com/watch?v=859OxXrt_TI', duration: '1h' },
        ],
      },
      {
        skill: 'Cloud AI (AWS SageMaker)', currentLevel: 25, requiredLevel: 70, priority: 'MEDIUM',
        resources: [
          { title: 'AWS SageMaker Tutorial', type: 'gfg', url: 'https://www.geeksforgeeks.org/aws-sagemaker/', duration: '1h read' },
          { title: 'AWS SageMaker Full Course', type: 'youtube', url: 'https://www.youtube.com/watch?v=uQc8Itd4UTs', duration: '2h 30m' },
          { title: 'Deploy ML Model on AWS SageMaker', type: 'youtube', url: 'https://www.youtube.com/watch?v=Ki3THHiKGvw', duration: '55m' },
        ],
      },
    ],
    roadmap: [
      { week: 'Week 1', title: 'LangChain & RAG Foundations', tasks: ['Complete LangChain GFG tutorial', 'Build a simple QA chatbot with PDF', 'Integrate ChromaDB as vector store', 'Deploy RAG API on FastAPI'], milestone: 'RAG Chatbot Live', completed: false },
      { week: 'Week 2', title: 'LLM Fine-tuning with HuggingFace', tasks: ['Set up HuggingFace account & Spaces', 'Fine-tune DistilBERT on custom NLP task', 'Evaluate model with F1/BLEU score', 'Push model to HuggingFace Hub'], completed: false },
      { week: 'Week 3', title: 'MLflow Experiment Tracking', tasks: ['Set up MLflow tracking server', 'Log XGBoost model runs & parameters', 'Add model versioning to eligibility model', 'Compare experiment results in UI'], milestone: 'MLOps Pipeline', completed: false },
      { week: 'Week 4', title: 'AWS SageMaker Deployment', tasks: ['Create SageMaker notebook instance', 'Train model in SageMaker Studio', 'Deploy endpoint with auto-scaling', 'Build AI project portfolio page'], milestone: 'Cloud AI Deployed', completed: false },
    ],
  },

  'Data Analyst': {
    overallGap: 30,
    strengths: ['Python Pandas (88%)', 'SQL (82%)', 'PostgreSQL (82%)', 'Data Visualization (75%)', 'Statistics (72%)'],
    gapItems: [
      {
        skill: 'Power BI / Advanced DAX', currentLevel: 20, requiredLevel: 80, priority: 'CRITICAL',
        resources: [
          { title: 'Power BI Tutorial for Beginners', type: 'gfg', url: 'https://www.geeksforgeeks.org/power-bi-tutorial/', duration: '2h read' },
          { title: 'Power BI Full Course 2024', type: 'youtube', url: 'https://www.youtube.com/watch?v=TmhQCQr_0aA', duration: '3h' },
          { title: 'DAX Measures & Calculated Columns', type: 'youtube', url: 'https://www.youtube.com/watch?v=hB-M_3ySAcs', duration: '1h 20m' },
        ],
      },
      {
        skill: 'dbt (Data Build Tool)', currentLevel: 10, requiredLevel: 65, priority: 'HIGH',
        resources: [
          { title: 'dbt Tutorial — Analytics Engineering', type: 'gfg', url: 'https://www.geeksforgeeks.org/dbt-data-build-tool/', duration: '1h read' },
          { title: 'dbt Full Course for Beginners', type: 'youtube', url: 'https://www.youtube.com/watch?v=toSAAgLUHuk', duration: '2h 15m' },
          { title: 'Modern Data Stack with dbt & BigQuery', type: 'youtube', url: 'https://www.youtube.com/watch?v=ueVy2N54lyc', duration: '1h' },
        ],
      },
      {
        skill: 'Apache Spark / PySpark', currentLevel: 15, requiredLevel: 60, priority: 'MEDIUM',
        resources: [
          { title: 'PySpark Tutorial for Beginners', type: 'gfg', url: 'https://www.geeksforgeeks.org/pyspark-tutorial/', duration: '1.5h read' },
          { title: 'Apache Spark with Python (PySpark)', type: 'youtube', url: 'https://www.youtube.com/watch?v=_C8kWso4ne4', duration: '2h 30m' },
          { title: 'Big Data Processing with PySpark', type: 'youtube', url: 'https://www.youtube.com/watch?v=EB8lfdxpirM', duration: '1h 10m' },
        ],
      },
    ],
    roadmap: [
      { week: 'Week 1', title: 'Power BI Mastery', tasks: ['Install Power BI Desktop & explore UI', 'Connect to PostgreSQL database', 'Build an interactive placement dashboard', 'Learn DAX: CALCULATE, FILTER, SUMX'], milestone: 'Power BI Dashboard Live', completed: false },
      { week: 'Week 2', title: 'SQL Advanced Techniques', tasks: ['Master window functions (RANK, LEAD, LAG)', 'Write CTEs and recursive queries', 'Optimize slow queries with EXPLAIN ANALYZE', 'Build a SQL portfolio on GitHub'], completed: false },
      { week: 'Week 3', title: 'dbt Analytics Engineering', tasks: ['Set up dbt project on Postgres', 'Write staging and mart models', 'Add dbt tests (not_null, unique, referential)', 'Deploy dbt on GitHub Actions'], milestone: 'Modern Data Stack', completed: false },
      { week: 'Week 4', title: 'PySpark Basics & Certification', tasks: ['Complete PySpark course on YouTube', 'Process 1M-row CSV dataset with Spark', 'Build analytics pipeline notebook', 'Apply for Data Analyst internships'], milestone: 'Big Data Ready', completed: false },
    ],
  },

  'Frontend Developer': {
    overallGap: 18,
    strengths: ['React.js (90%)', 'TypeScript (85%)', 'Next.js (88%)', 'CSS/Tailwind (88%)', 'Zustand (80%)'],
    gapItems: [
      {
        skill: 'Web Accessibility (WCAG 2.1)', currentLevel: 30, requiredLevel: 75, priority: 'HIGH',
        resources: [
          { title: 'Web Accessibility Tutorial — WCAG', type: 'gfg', url: 'https://www.geeksforgeeks.org/web-accessibility/', duration: '1h read' },
          { title: 'Web Accessibility (A11Y) Full Course', type: 'youtube', url: 'https://www.youtube.com/watch?v=e2nkq3h1P68', duration: '1h 30m' },
          { title: 'ARIA Attributes and Semantic HTML', type: 'youtube', url: 'https://www.youtube.com/watch?v=0hqhAIjE_8I', duration: '45m' },
        ],
      },
      {
        skill: 'Playwright / E2E Testing', currentLevel: 20, requiredLevel: 65, priority: 'HIGH',
        resources: [
          { title: 'Playwright Testing Tutorial', type: 'gfg', url: 'https://www.geeksforgeeks.org/playwright-tutorial/', duration: '45m read' },
          { title: 'Playwright Tutorial for Beginners', type: 'youtube', url: 'https://www.youtube.com/watch?v=wGr5rz8WGCE', duration: '1h 15m' },
          { title: 'E2E Testing React App with Playwright', type: 'youtube', url: 'https://www.youtube.com/watch?v=0K8b7NMGqLU', duration: '55m' },
        ],
      },
      {
        skill: 'Micro-Frontend Architecture', currentLevel: 15, requiredLevel: 60, priority: 'MEDIUM',
        resources: [
          { title: 'Micro Frontends Architecture', type: 'gfg', url: 'https://www.geeksforgeeks.org/micro-frontend-architecture/', duration: '1h read' },
          { title: 'Micro Frontends with Module Federation', type: 'youtube', url: 'https://www.youtube.com/watch?v=lKKsjpH09dU', duration: '1h 20m' },
          { title: 'Webpack Module Federation Guide', type: 'youtube', url: 'https://www.youtube.com/watch?v=s_Fs4AXsTnA', duration: '1h' },
        ],
      },
    ],
    roadmap: [
      { week: 'Week 1', title: 'Accessibility & Semantic HTML', tasks: ['Audit existing projects with Lighthouse', 'Add ARIA roles to all interactive elements', 'Fix keyboard navigation on modals', 'Score 95+ Accessibility in Lighthouse'], milestone: 'A11Y Compliant', completed: false },
      { week: 'Week 2', title: 'Playwright E2E Testing', tasks: ['Install Playwright in React project', 'Write 10 E2E tests for core user flows', 'Add Playwright to GitHub Actions CI', 'Integrate with test reporting dashboard'], completed: false },
      { week: 'Week 3', title: 'React Performance & Optimization', tasks: ['Audit bundle size with webpack-bundle-analyzer', 'Implement React.lazy and Suspense', 'Add image optimization with next/image', 'Achieve 95+ Lighthouse Performance'], milestone: 'Optimized App', completed: false },
      { week: 'Week 4', title: 'Portfolio & Job Applications', tasks: ['Deploy Storybook component library', 'Create personal portfolio website', 'Record screen demos of best UI projects', 'Apply to 10+ Frontend positions'], milestone: 'Portfolio Live', completed: false },
    ],
  },

  'Backend Developer': {
    overallGap: 25,
    strengths: ['Node.js (88%)', 'PostgreSQL (82%)', 'FastAPI (84%)', 'Redis (78%)', 'JWT/Auth (85%)'],
    gapItems: [
      {
        skill: 'Kubernetes / Helm Charts', currentLevel: 10, requiredLevel: 70, priority: 'CRITICAL',
        resources: [
          { title: 'Kubernetes Tutorial for Beginners', type: 'gfg', url: 'https://www.geeksforgeeks.org/kubernetes-tutorial/', duration: '2h read' },
          { title: 'Kubernetes Crash Course for Absolute Beginners', type: 'youtube', url: 'https://www.youtube.com/watch?v=s_o8dwzRlu4', duration: '1h 15m' },
          { title: 'Kubernetes Full Course 2024', type: 'youtube', url: 'https://www.youtube.com/watch?v=KVBON1lA9N8', duration: '3h' },
        ],
      },
      {
        skill: 'Apache Kafka / Message Queues', currentLevel: 15, requiredLevel: 65, priority: 'CRITICAL',
        resources: [
          { title: 'Apache Kafka Tutorial', type: 'gfg', url: 'https://www.geeksforgeeks.org/apache-kafka/', duration: '1.5h read' },
          { title: 'Apache Kafka Crash Course', type: 'youtube', url: 'https://www.youtube.com/watch?v=ZJJHm_bd9Zo', duration: '1h 10m' },
          { title: 'Kafka with Node.js Producer & Consumer', type: 'youtube', url: 'https://www.youtube.com/watch?v=jItIQ-UvFI4', duration: '55m' },
        ],
      },
      {
        skill: 'gRPC / Protocol Buffers', currentLevel: 10, requiredLevel: 55, priority: 'MEDIUM',
        resources: [
          { title: 'gRPC Tutorial for Beginners', type: 'gfg', url: 'https://www.geeksforgeeks.org/grpc/', duration: '1h read' },
          { title: 'gRPC Crash Course — Concepts & Demo', type: 'youtube', url: 'https://www.youtube.com/watch?v=Yw4rkaTc0f8', duration: '1h' },
          { title: 'gRPC with Node.js — Full Tutorial', type: 'youtube', url: 'https://www.youtube.com/watch?v=fl9AZieRUaw', duration: '1h 20m' },
        ],
      },
    ],
    roadmap: [
      { week: 'Week 1', title: 'Kubernetes Foundations', tasks: ['Install minikube & kubectl locally', 'Deploy existing Node.js app to K8s cluster', 'Write Deployment, Service, and ConfigMap YAMLs', 'Explore Helm chart structure'], milestone: 'First K8s Deployment', completed: false },
      { week: 'Week 2', title: 'Apache Kafka Integration', tasks: ['Set up Kafka with Docker Compose', 'Build Node.js Kafka producer service', 'Implement consumer for async order processing', 'Monitor topics in Kafka UI'], completed: false },
      { week: 'Week 3', title: 'gRPC Microservice Communication', tasks: ['Define .proto schema for user service', 'Build gRPC server in Node.js', 'Implement gRPC client in Python FastAPI', 'Benchmark gRPC vs REST latency'], milestone: 'Microservice Mesh', completed: false },
      { week: 'Week 4', title: 'Production Deployment & CKA Prep', tasks: ['Set up production Kubernetes on DigitalOcean', 'Configure ingress with cert-manager (HTTPS)', 'Add horizontal pod autoscaling', 'Study for Certified Kubernetes Administrator (CKA)'], milestone: 'Production K8s Live', completed: false },
    ],
  },
};

const ROLES = Object.keys(ROLE_DATA);

const PRIORITY_STYLES = {
  CRITICAL: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300 dark:border-rose-800',
  HIGH: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800',
  MEDIUM: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-800',
};

export default function CareerRoadmapPage() {
  const [selectedRole, setSelectedRole] = useState('Software Engineer');
  const [appliedRole, setAppliedRole] = useState('Software Engineer');
  const [isLoading, setIsLoading] = useState(false);
  const [roadmapStatus, setRoadmapStatus] = useState<Record<string, boolean>>({});

  const roleChanged = selectedRole !== appliedRole;
  const data = ROLE_DATA[appliedRole];

  const handleApplyRole = () => {
    setIsLoading(true);
    setRoadmapStatus({});
    setTimeout(() => {
      setAppliedRole(selectedRole);
      setIsLoading(false);
    }, 1000);
  };

  const toggleTask = (weekIndex: number) => {
    const key = `${appliedRole}-${weekIndex}`;
    setRoadmapStatus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const completedWeeks = data.roadmap.filter((_, i) => roadmapStatus[`${appliedRole}-${i}`]).length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Map className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Career Roadmap & Skill Gap Analyzer</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Role-specific skill gap analysis with curated GeeksForGeeks & YouTube learning resources.</p>
        </div>
      </div>

      {/* Role Selector */}
      <div className="glass-card p-5 rounded-2xl space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-slate-200 text-sm">Select Target Career Role</h3>
        <div className="flex flex-wrap gap-2">
          {ROLES.map(role => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                selectedRole === role
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
        {roleChanged && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 text-xs text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/50 rounded-xl px-4 py-2.5 flex items-center space-x-2 font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Role changed to <strong>{selectedRole}</strong>. Generate a new roadmap for this role.</span>
            </div>
            <button
              onClick={handleApplyRole}
              disabled={isLoading}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer disabled:opacity-60"
            >
              {isLoading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Generating...</span></> : <><Sparkles className="w-4 h-4" /><span>Generate Roadmap</span></>}
            </button>
          </div>
        )}
        {!roleChanged && (
          <p className="text-[11px] text-slate-500 font-medium">Showing roadmap for: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{appliedRole}</span></p>
        )}
      </div>

      {/* Overview Stat Row (HIGH CONTRAST LIGHT MODE METRICS) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl text-center space-y-1">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Skill Gap Score</p>
          <h3 className="text-3xl font-black text-rose-600 dark:text-rose-400">{data.overallGap}%</h3>
          <p className="text-[11px] text-slate-500 font-medium">To reach {appliedRole} level</p>
        </div>
        <div className="glass-card p-5 rounded-2xl text-center space-y-1">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Gap Skills</p>
          <h3 className="text-3xl font-black text-amber-600 dark:text-amber-400">{data.gapItems.length}</h3>
          <p className="text-[11px] text-slate-500 font-medium">To be addressed</p>
        </div>
        <div className="glass-card p-5 rounded-2xl text-center space-y-1">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Resources</p>
          <h3 className="text-3xl font-black text-blue-600 dark:text-blue-400">{data.gapItems.reduce((acc, g) => acc + g.resources.length, 0)}</h3>
          <p className="text-[11px] text-slate-500 font-medium">Curated links</p>
        </div>
        <div className="glass-card p-5 rounded-2xl text-center space-y-1">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Weeks Progress</p>
          <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{completedWeeks}/{data.roadmap.length}</h3>
          <p className="text-[11px] text-slate-500 font-medium">Weeks complete</p>
        </div>
      </div>

      {/* Strengths Banner */}
      <div className="glass-card p-5 rounded-2xl border border-emerald-300 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/15 space-y-3">
        <h3 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Your Strengths for {appliedRole}</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {data.strengths.map((s, i) => (
            <span key={i} className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-3 py-1 rounded-full font-bold">
              ✓ {s}
            </span>
          ))}
        </div>
      </div>

      {/* Skill Gap Analysis */}
      <div className="space-y-4">
        <h2 className="font-bold text-slate-900 dark:text-slate-100 text-lg flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          <span>Skill Gap Analysis — {appliedRole}</span>
        </h2>

        {data.gapItems.map((gap, idx) => (
          <div key={idx} className="glass-card p-6 rounded-2xl space-y-4">
            {/* Gap Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-slate-900 dark:text-slate-200">{gap.skill}</h3>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${PRIORITY_STYLES[gap.priority]}`}>
                  {gap.priority}
                </span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Gap: <span className="text-rose-600 dark:text-rose-400 font-extrabold">{gap.requiredLevel - gap.currentLevel}%</span> to close
              </div>
            </div>

            {/* Gap Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-400">Current Level: <span className="text-slate-900 dark:text-slate-200">{gap.currentLevel}%</span></span>
                <span className="text-slate-600 dark:text-slate-400">Required: <span className="text-emerald-600 dark:text-emerald-400">{gap.requiredLevel}%</span></span>
              </div>
              <div className="relative w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-700"
                  style={{ width: `${gap.currentLevel}%` }} />
                <div className="absolute top-0 h-full border-r-2 border-emerald-500 dark:border-emerald-400 border-dashed"
                  style={{ left: `${gap.requiredLevel}%` }} />
              </div>
              <div className="text-[11px] text-slate-500 font-semibold flex justify-between">
                <span>Your Level</span>
                <span className="text-emerald-600 dark:text-emerald-400">Target Level</span>
              </div>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Curated Learning Resources</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {gap.resources.map((res, rIdx) => (
                  <a
                    key={rIdx}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-start gap-3 p-3.5 rounded-xl border transition-all hover:scale-[1.02] shadow-xs ${
                      res.type === 'gfg'
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50 hover:border-emerald-400'
                        : 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/50 hover:border-rose-400'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${res.type === 'gfg' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                      {res.type === 'gfg'
                        ? <span className="text-white font-bold text-[10px]">GFG</span>
                        : <Youtube className="w-4 h-4 text-white" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-white transition-colors leading-tight line-clamp-2">{res.title}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-[10px] font-bold ${res.type === 'gfg' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                          {res.type === 'gfg' ? 'GeeksForGeeks' : 'YouTube'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />{res.duration}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 shrink-0 mt-0.5 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Career Roadmap Timeline */}
      <div className="space-y-4">
        <h2 className="font-bold text-slate-900 dark:text-slate-100 text-lg flex items-center space-x-2">
          <Map className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>4-Week Career Roadmap — {appliedRole}</span>
        </h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />

          <div className="space-y-4">
            {data.roadmap.map((week, wIdx) => {
              const key = `${appliedRole}-${wIdx}`;
              const done = !!roadmapStatus[key];
              return (
                <div key={wIdx} className="md:pl-16 relative">
                  {/* Circle on timeline */}
                  <div className={`absolute left-0 top-6 w-12 h-12 rounded-full border-2 hidden md:flex items-center justify-center font-bold text-xs z-10 transition-all ${
                    done ? 'bg-emerald-600 border-emerald-400 text-white shadow-md' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-400'
                  }`}>
                    {done ? <CheckCircle className="w-5 h-5" /> : wIdx + 1}
                  </div>

                  <div className={`glass-card p-5 rounded-2xl border transition-all ${done ? 'border-emerald-300 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/10' : ''}`}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{week.week}</span>
                          {week.milestone && (
                            <span className="text-[10px] bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 px-2.5 py-0.5 rounded-full font-bold">
                              🏆 {week.milestone}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-slate-200">{week.title}</h3>
                      </div>
                      <button
                        onClick={() => toggleTask(wIdx)}
                        className={`shrink-0 px-3.5 py-1.5 text-[11px] font-bold rounded-xl border transition-all cursor-pointer ${
                          done ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {done ? '✓ Completed' : 'Mark Done'}
                      </button>
                    </div>
                    <ul className="space-y-1.5">
                      {week.tasks.map((task, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-400 font-medium">
                          <ChevronRight className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${done ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <span className={done ? 'line-through opacity-60' : ''}>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
