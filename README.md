<div align="center">

# Intelligent Career Analytics Platform with Explainable AI and Career Digital Twin
### Evidence-Based Student Employability Intelligence & Trust Engine

> **CORE ARCHITECTURE PRINCIPLE: `STUDENT CLAIM ≠ VERIFIED RECORD`**

[![Next.js](https://img.shields.io/badge/Next.js-15.0-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.19-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.10-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![XGBoost](https://img.shields.io/badge/XGBoost-v2.4-FF6F00?style=for-the-badge&logo=xgboost&logoColor=white)](https://xgboost.readthedocs.io/)
[![SHAP](https://img.shields.io/badge/SHAP-XAI-8B5CF6?style=for-the-badge)](https://shap.readthedocs.io/)

---

An enterprise-grade, institutional student portfolio platform powered by a **Trust Architecture & Anti-Fraud Engine**.  
Eliminates unverified resume claims through automated evidence verification, machine learning eligibility scoring, explainable AI (SHAP), ATS resume optimization, automated portfolio compilation, and an immutable real-time IP audit trail.

[Features](#-key-platform-features) • [Trust Workflow](#-trust-architecture-workflow) • [Demo Credentials](#-demo-accounts--test-scenarios) • [Quickstart](#-quickstart--local-setup) • [Architecture](#-project-structure)

</div>

---

## 🌟 Why Naan Mudhalvan Trust Platform?

Traditional student resume platforms rely on **self-declared claims**, creating verification bottlenecks for placement officers and employers.  

**Naan Mudhalvan solves this by introducing a Dual-Metric Engine**:
1. 📈 **Employability Score (0–100%)**: Machine learning prediction of corporate job readiness based on verified projects, GitHub commit velocity, and skill assessments.
2. 🛡️ **Data Confidence Score (0–100%)**: Mathematical trustworthiness rating computed from SHA-256 certificate hashes, roll number ERP validation, and faculty audit signatures.

---

## ⚡ Key Platform Features

### 1. 🤖 Explainable AI (XAI) Employability Engine
- **XGBoost ML Pipeline**: Evaluates student profile features against employer readiness benchmarks.
- **SHAP (SHapley Additive exPlanations)**: Breaks down exactly *why* a student received their score (e.g., `+18% Projects Portfolio`, `+14% GitHub Streak`, `-8% LeetCode Activity`).
- **Interactive Competency Radar**: 6-dimension assessment comparing Technical Skills, DSA, Projects, Certifications, Communication, and Naan Mudhalvan Alignment.

### 2. 📄 ATS Resume Studio & Keyword Optimizer
- **Role-Tailored Resumes**: Instant resume generation for *Software Engineer*, *AI Engineer*, *Data Analyst*, *Frontend Developer*, and *Backend Developer*.
- **ATS Match Score & Grade**: Real-time evaluation (e.g., `88% A+`) against corporate ATS filters.
- **Missing Keyword Analyzer**: Highlights missing high-impact technical keywords (e.g., `Docker/Kubernetes`, `CI/CD Pipelines`, `Unit Testing`) with 1-click optimization.
- **Print & PDF Export**: Instant pixel-perfect print layout.

### 3. 🌐 Automated Portfolio Compiler
- **Shareable Public Slugs**: Generates clean public portfolio URLs (`/portfolio/aravind-kumar`).
- **Section Visibility Toggles**: Enable or disable sections (*Academic Details*, *GitHub Projects*, *Certifications*, *LeetCode Profiles*).
- **Dual-Theme Engine**: Seamless toggle between *Enterprise Glass*, *Minimalist Mono*, and *Vibrant Emerald*.

### 4. 🗺️ 4-Week Career & Skill Gap Roadmap
- **Automated Gap Analysis**: Identifies exact delta between current skill level and required employer benchmarks.
- **Curated Learning Resources**: Direct links to top-tier **GeeksForGeeks** tutorials and **YouTube** crash courses.
- **Interactive Milestone Checklist**: 4-week task tracker with completion badges.

### 5. 🛡️ Trust Architecture & Anti-Fraud Engine
- **Read-Only Authoritative Identity**: Name, Roll Number (`7376221CS101`), Department, CGPA, and College Name are locked from server ERP records and cannot be edited by students.
- **SHA-256 Certificate Fingerprinting**: Prevents duplicate certificate submissions across profiles (`CREDENTIAL_REUSE_SUSPECTED`).
- **EasyOCR Validation**: Automated extraction of certificate metadata and verification QR codes.
- **GitHub 100-Point Evidence Engine**: Inspects repo creation dates, commit volume, committer email alignment, and flags single-commit repositories.
- **Server-Side MCQ Skill Testing**: Random questions, timed attempts, and automated confidence score boosting.

### 6. 🏛️ Scope-Limited Faculty & Placement Officer Portals
- **Department Scope Boundary**: Faculty members can only review and verify students within their assigned department.
- **Mandatory Audit Rationale**: Requires written reasoning for `REJECT`, `APPROVE`, or `FLAG_FOR_ADMIN`.
- **Verified Placement Hub**: Corporate placement analytics and CSV exports filtered strictly by verified offer letters.
- **Real-Time IP Audit Logs**: Immutable system event logging with actor role, target user, action, and client IP tracking.

---

## 📐 Trust Architecture Workflow

```text
                      ┌─────────────────────────────────────────┐
                      │              STUDENT CLAIM              │
                      └────────────────────┬────────────────────┘
                                           │
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │           EVIDENCE COLLECTION           │
                      │ (SHA-256 Hash, QR Code, GitHub API, ERP)│
                      └────────────────────┬────────────────────┘
                                           │
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │          AUTOMATED VERIFICATION         │
                      │ (EasyOCR Check, Repo Velocity, Dups)    │
                      └────────────────────┬────────────────────┘
                                           │
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │       FACULTY / PLACEMENT REVIEW        │
                      │ (Department Scope, Mandatory Audit Log) │
                      └────────────────────┬────────────────────┘
                                           │
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │             VERIFIED RECORD             │
                      └────────────────────┬────────────────────┘
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    ▼                                             ▼
     ┌─────────────────────────────┐               ┌─────────────────────────────┐
     │     EMPLOYABILITY SCORE     │               │    DATA CONFIDENCE SCORE    │
     │   (XGBoost ML Readiness)    │               │  (Evidence Trust 0–100%)    │
     └─────────────────────────────┘               └─────────────────────────────┘
```

---

## 🔑 Demo Accounts & Test Scenarios

The platform includes pre-seeded demonstration accounts tailored for testing all workflows:

| Role | Institutional Email | Unique ID | Credentials / Scenario Details |
| :--- | :--- | :--- | :--- |
| 🧑‍🎓 **Student (Verified)** | `aravind.student@college.edu` | `7376221CS101` | **96% Data Confidence**, 88% Employability score, Amazon SDE Offer Verified |
| 🧑‍🎓 **Student (Unverified)** | `kavitha.student@college.edu` | `7376221CS102` | **42% Data Confidence**, Self-declared claims, single commit flag |
| 🧑‍🏫 **Faculty Member** | `faculty.cse@college.edu` | `NM-FACULTY-204` | **CSE Department Scope**, verification queue & audit log controls |
| 💼 **Placement Officer** | `placement@college.edu` | `NM-OFFICER-102` | **Institutional Placement Hub**, verified candidate roster & CSV export |
| 🛡️ **System Admin** | `admin@naanmudhalvan.edu` | `NM-ADMIN-001` | **System Audit Logs**, FastAPI AI diagnostics & real-time IP log stream |

*Default password for all demo accounts:* `password123`

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- **Node.js** v18+ & **npm**
- **Python** 3.9+ (for FastAPI ML Service)

### 1. Repository Setup
```bash
git clone https://github.com/Abarna25/Naan_Mudhalvan.git
cd Naan_Mudhalvan
```

### 2. Run Backend API (Express.js & Prisma)
```bash
cd backend
npm install
cp .env.example .env
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
# Backend API listening at http://localhost:5000 (Swagger docs at /api/v1/docs)
```

### 3. Run Frontend Web App (Next.js 15 & Tailwind)
```bash
cd ../frontend
npm install
npm run dev
# Web application live at http://localhost:3000
```

### 4. Run AI Engine (FastAPI & XGBoost/SHAP)
```bash
cd ../ai_service
pip install -r requirements.txt
python main.py
# AI Inference API listening at http://localhost:8000
```

---

## 🛠️ Tech Stack & System Architecture

### Frontend Application
- **Framework**: Next.js 15 (App Router, Server Components)
- **Styling**: Tailwind CSS v3.4 (Custom Naan Mudhalvan Design Tokens)
- **State Management**: Zustand v4.5
- **Data Visualization**: Recharts v2.12
- **Icons**: Lucide React

### Backend API & Database
- **Runtime**: Node.js & Express.js (TypeScript)
- **ORM & DB**: Prisma ORM with SQLite (Dev) / PostgreSQL (Prod)
- **Authentication**: JWT, bcrypt, RBAC middleware
- **API Documentation**: Swagger UI / OpenAPI 3.0

### Machine Learning & AI Microservice
- **Framework**: FastAPI (Python 3.10)
- **ML Pipeline**: XGBoost v2.4, SHAP v0.45, Scikit-learn
- **OCR Engine**: EasyOCR, OpenCV, PyTorch

---

## 📁 Project Structure

```text
Naan_Mudhalvan/
├── frontend/                     # Next.js 15 Web Application
│   ├── src/
│   │   ├── app/                  # App Router Pages & Role Dashboards
│   │   │   ├── page.tsx          # Landing & Authentication Page
│   │   │   └── dashboard/
│   │   │       ├── student/      # Student Eligibility, Portfolio, Resume, Roadmap
│   │   │       ├── faculty/      # Faculty Queue & Department Analytics
│   │   │       ├── placement/    # Placement Officer Candidate Roster & CSV
│   │   │       └── admin/        # System Audit Logs & AI Engine Diagnostics
│   │   ├── components/           # UI Components & Dual-Theme Controls
│   │   └── store/                # Zustand Auth & Theme Store
├── backend/                      # Express.js TypeScript API
│   ├── prisma/                   # Database Schema & Seed Data
│   └── src/
│       ├── controllers/          # Auth, Student, Faculty, Placement, Admin
│       ├── services/             # Verification & Evidence Services
│       └── utils/                # Real-Time IP Audit Logger
└── ai_service/                   # FastAPI Machine Learning Service
    ├── main.py                   # FastAPI Engine Entrypoint
    └── services/                 # XGBoost, SHAP, and EasyOCR Services
```
