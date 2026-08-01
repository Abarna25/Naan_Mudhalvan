# Naan Mudhalvan Automated Student Portfolio Compiler
## & Predictive Employment Eligibility Assessment Engine

A production-ready full-stack SaaS platform built for Tamil Nadu state skill development aligned with the **Naan Mudhalvan initiative**.

---

## 🚀 Quick Start

### 1. Backend (Express.js + Prisma + SQLite)
```bash
cd backend
npm install
npx prisma db push
npm run prisma:seed
npm run dev
# → Running on http://localhost:5005
# → Swagger Docs at http://localhost:5005/api/v1/docs
```

### 2. Frontend (Next.js 14)
```bash
cd frontend
npm install
npx next dev -p 3005
# → Running on http://localhost:3005
```

### 3. AI Service (FastAPI + Python)
```bash
cd ai_service
pip install -r requirements.txt
python main.py
# → Running on http://localhost:8000
# → API Docs at http://localhost:8000/docs
```

---

## 🔑 Demo Credentials (All with password: `password123`)

| Role | Email |
|------|-------|
| **Student** | `aravind.student@college.edu` |
| **Faculty** | `faculty.cse@college.edu` |
| **Placement Officer** | `placement@college.edu` |
| **Admin** | `admin@naanmudhalvan.edu` |

Or use the **1-Click Role Switcher** on the landing page.

---

## 🏗️ Architecture

```
frontend/ (Next.js 14 App Router - Port 3005)
  └── src/
      ├── app/
      │   ├── page.tsx                    # Landing / Login Page
      │   ├── dashboard/
      │   │   ├── student/                # Student Portal
      │   │   │   ├── page.tsx            # Dashboard with XAI + Recharts
      │   │   │   ├── profile/            # Profile & Skills (CRUD + OCR)
      │   │   │   ├── portfolio/          # Portfolio Compiler Config
      │   │   │   ├── resume/             # ATS Resume Studio
      │   │   │   ├── eligibility/        # Explainable AI Engine (SHAP)
      │   │   │   └── roadmap/            # Career & Skill Gap Roadmap
      │   │   ├── faculty/
      │   │   │   ├── page.tsx            # Faculty Roster + Approvals
      │   │   │   ├── approvals/          # Portfolio Approval Workflow
      │   │   │   └── analytics/          # Class Performance Analytics
      │   │   ├── placement/
      │   │   │   ├── page.tsx            # Placement Hub Dashboard
      │   │   │   ├── readiness/          # Eligibility Tier Analytics
      │   │   │   └── candidates/         # Top Performer Cards
      │   │   └── admin/
      │   │       ├── page.tsx            # RBAC + AI Model Status
      │   │       ├── logs/               # Filterable Audit Log Table
      │   │       └── ai-status/          # AI Diagnostics + Throughput
      │   └── portfolio/[slug]/           # Public Portfolio View
      ├── components/
      │   ├── layout/Sidebar.tsx          # Role-based navigation
      │   ├── layout/Header.tsx           # Search, notifications, role switcher
      │   └── search/SearchModal.tsx      # Global search modal (⌘K)
      └── store/useAuthStore.ts           # Zustand auth + theme state

backend/ (Express.js + TypeScript + Prisma - Port 5005)
  ├── src/
  │   ├── index.ts                        # Server entry + Swagger docs
  │   ├── routes/api.ts                   # All /api/v1/* routes
  │   ├── controllers/
  │   │   ├── authController.ts           # Register/Login/Refresh JWT
  │   │   ├── studentController.ts        # Profile/Skills/Projects CRUD
  │   │   ├── portfolioController.ts      # Portfolio compiler + public slug
  │   │   ├── resumeController.ts         # ATS resume generator + optimizer
  │   │   ├── assessmentController.ts     # XAI prediction + skill gap + roadmap
  │   │   ├── facultyController.ts        # Department monitoring + approvals
  │   │   ├── placementController.ts      # Analytics + CSV export
  │   │   ├── adminController.ts          # RBAC + audit logs + AI status
  │   │   └── searchController.ts         # Global multi-entity search
  │   └── middlewares/
  │       ├── auth.ts                     # JWT authenticate + authorize roles
  │       └── error.ts                    # Global error handler
  └── prisma/
      ├── schema.prisma                   # Full DB schema (17 models)
      └── seed.ts                         # Rich seed data

ai_service/ (FastAPI + Python - Port 8000)
  ├── main.py                             # FastAPI app with 5 endpoints
  ├── models.py                           # Pydantic request/response schemas
  └── services/
      ├── resume_parser.py                # NLP skill extraction + ATS scoring
      ├── certificate_ocr.py              # EasyOCR heuristic extraction
      ├── eligibility_model.py            # XGBoost prediction + SHAP XAI
      └── recommendation_engine.py        # Skill gap + career roadmap
```

---

## 🔌 API Endpoints

### Auth
- `POST /api/v1/auth/register` — Register user
- `POST /api/v1/auth/login` — Login + get JWT
- `POST /api/v1/auth/refresh-token` — Refresh access token
- `GET /api/v1/auth/me` — Get current user

### Student
- `GET/PUT /api/v1/student/profile` — Full profile CRUD
- `POST/DELETE /api/v1/student/skills` — Skills management
- `POST/PUT/DELETE /api/v1/student/projects` — Projects CRUD
- `POST/DELETE /api/v1/student/certifications` — Certifications CRUD
- `POST /api/v1/student/sync-external` — GitHub/LeetCode sync

### Assessment (XAI)
- `POST /api/v1/assessment/predict` — Run XGBoost eligibility prediction
- `GET /api/v1/assessment/skill-gap` — Skill gap for target role
- `GET /api/v1/assessment/roadmap` — Career roadmap generator

### Portfolio & Resume
- `GET /api/v1/portfolio/public/:slug` — Public portfolio viewer
- `POST /api/v1/portfolio/config` — Portfolio settings
- `POST /api/v1/resume/generate` — Generate ATS resume
- `POST /api/v1/resume/optimize` — ATS optimizer + keyword analysis

### Faculty, Placement, Admin
- `GET /api/v1/faculty/students` — Department roster
- `POST /api/v1/faculty/approve` — Approve project/certificate
- `GET /api/v1/placement/dashboard` — Placement analytics
- `GET /api/v1/placement/export-csv` — Download placement report
- `GET /api/v1/admin/users` — All users RBAC
- `GET /api/v1/admin/audit-logs` — System logs
- `GET /api/v1/admin/ai-status` — AI model health

### Search
- `GET /api/v1/search?q=term` — Global search

### AI Service (FastAPI)
- `POST /api/v1/ai/parse-resume` — Resume NLP extraction
- `POST /api/v1/ai/ocr-certificate` — Certificate OCR parsing
- `POST /api/v1/ai/predict-eligibility` — XGBoost + SHAP
- `POST /api/v1/ai/skill-gap` — Skill gap analysis
- `POST /api/v1/ai/career-roadmap` — Personalized roadmap

---

## ✅ Features Implemented

- [x] **Authentication** — JWT access + refresh tokens, bcrypt, RBAC middleware
- [x] **4 Role Portals** — Student, Faculty, Placement Officer, Admin
- [x] **Student Profile CRUD** — Academic, skills, projects, certifications
- [x] **EasyOCR Certificate Parser** — Heuristic extraction engine
- [x] **GitHub/LeetCode Sync** — Automated activity data collection
- [x] **Portfolio Compiler** — Auto-generated public portfolio with shareable slug
- [x] **ATS Resume Studio** — Role-specific resume with score + keyword analysis
- [x] **Explainable AI (XAI)** — XGBoost + SHAP feature attribution display
- [x] **Skill Gap Analysis** — Missing skills vs target role with resources
- [x] **Career Roadmap** — Weekly plan + monthly milestones
- [x] **Faculty Approval Workflow** — Projects/cert approval with filter
- [x] **Placement Analytics** — Tier distribution, trends, candidate filter
- [x] **Top Candidates Leaderboard** — Detailed card view with contact actions
- [x] **Admin Panel** — RBAC management, system logs, AI diagnostics
- [x] **Audit Log Viewer** — Filterable log table with CSV export
- [x] **Global Search** — ⌘K modal across students, projects, skills, certs
- [x] **Notifications Dropdown** — In-app notification center
- [x] **Dark Mode** — Premium charcoal slate enterprise theme
- [x] **Recharts Analytics** — Radar, Bar, Area, Line, Pie charts throughout
- [x] **Swagger API Docs** — http://localhost:5005/api/v1/docs
- [x] **Prisma ORM + SQLite** — 17-model schema with seeds
- [x] **CSV Export** — Placement report download

---

## 🚢 Production Deployment

| Service | Platform | Notes |
|---------|----------|-------|
| Frontend | Vercel | `cd frontend && vercel deploy` |
| Backend | Railway | Set DATABASE_URL to Supabase PG |
| AI Service | Railway | `python main.py` with gunicorn |
| Database | Supabase | Change `provider` to `postgresql` in schema.prisma |
