# Naan Mudhalvan - Evidence-Based Student Employability Intelligence Platform

> **CORE PRODUCT PRINCIPLE: STUDENT CLAIM ≠ VERIFIED RECORD**

An institutional student portfolio and employability intelligence platform equipped with a **Trust Architecture & Anti-Fraud Engine**. Every student claim (Identity, Skills, Projects, Certifications, and Placement) is backed by an evidence trail, automated verification pipelines, machine scoring, scope-limited human approvals, and an immutable audit trail.

---

## 1. Trust Architecture Workflow

```text
STUDENT CLAIM
      ↓
EVIDENCE COLLECTION (SHA-256 File Hash, Verification URL, QR Code, GitHub API, Academic ERP)
      ↓
AUTOMATED VERIFICATION (Roll Number Lookup, Credential Reuse Detection, Repo Commit Analysis)
      ↓
EVIDENCE & FRAUD RISK SCORING (100-pt Project Score, MCQ Assessment, Anomaly Detection)
      ↓
FACULTY / PLACEMENT VERIFICATION (Department-Scoped Queue, Mandatory Audit Reasoning)
      ↓
VERIFIED RECORD
      ↓
┌───────────────────────────┐      ┌─────────────────────────────┐
│    EMPLOYABILITY SCORE    │      │    DATA CONFIDENCE SCORE    │
│ (Career Readiness 0-100)  │  +   │   (Evidence Reliability)    │
└───────────────────────────┘      └─────────────────────────────┘
```

---

## 2. Key Platform Features

### 🛡️ Institutional Identity & Anti-Fraud Auth
- **Academic Integration Abstraction**: `AcademicProvider` interface with `MockAcademicProvider` for roll number lookup (`7376221CS101`) and institutional email verification.
- **Read-Only Authoritative Fields**: Roll Number, Student ID, Department, CGPA, College Name, Semester, and Section are set by the server from academic records and cannot be edited by students.
- **Duplicate Account Prevention**: Unique constraints on `rollNumber`, `studentId`, and `institutionalEmail`.

### 📜 Certificate Verification Pipeline
- **SHA-256 Fingerprinting**: Prevents duplicate certificate submissions across profiles.
- **Credential Reuse Detection**: Flags suspicious reuse of identical credential IDs across different students (`CREDENTIAL_REUSE_SUSPECTED`).
- **Triple-Channel Automated Verification**:
  1. Verification URL domain check & HTTP payload validation.
  2. QR code decoding & URL endpoint check.
  3. Issuer API verification (`MockIssuerProvider`).
- **Faculty Review Queue Fallback**: Non-machine-verifiable certificates route to `MANUAL_REVIEW_REQUIRED`.

### 🐙 GitHub Project Evidence Engine
- **GitHub API Integration**: Evaluates repository existence, age, commit volume, commit frequency, committer username matching, language breakdown, README quality, and recent activity recency.
- **100-Point Evidence Scoring**: Transparent scoring model awarding up to 100 points based on verifiable commit activity.
- **Suspicious Repository Detection**: Automatically flags single-commit repos or repos created immediately before submission (`SUSPICIOUS`).

### 🧠 Skill Assessment & Confidence Engine
- **Server-Side MCQ Assessments**: Question & option randomization, attempt timeouts, and server-side score calculation.
- **Explainable Skill Confidence (0-100)**: Multi-factor confidence model weighing Assessments (2.5x), Faculty Approvals (2.0x), Verified Certifications (2.0x), Verified GitHub Projects (1.8x), and Self Declarations (0.5x).
- **UI Claim Distinction**: Clearly distinguishes **Claimed Skills** from **Demonstrated Skills**.

### 🏛️ Scope-Limited Faculty Verification Queue
- **Department Scope Boundary**: Faculty members can only view and verify students belonging to their own department.
- **Mandatory Reasoning**: Requires audit rationale for `REJECT`, `REQUEST_MORE_EVIDENCE`, or `FLAG_FOR_ADMIN`.
- **IP Tracing & Audit Immutability**: Logs record actor ID, role, action, target user, client IP address (parsing `X-Forwarded-For`), and structured JSON metadata.

### 💼 Verified Placement Workflow
- **Placement Claim Processing**: Students upload offer letters/joining documents; claims enter `PENDING_VERIFICATION`.
- **Company Registry Normalization**: Normalizes company name variations (e.g., "Google Inc" -> "Google").
- **Verified-Only Placement Analytics**: Official placement rate statistics exclude unverified claims.

### 📊 Dual Metric Engine: Employability vs Data Confidence
- **Employability Score (0-100)**: Estimates technical career readiness.
- **Data Confidence Score (0-100)**: Measures reliability of underlying evidence (Identity 20%, Academic 15%, Skills 20%, Projects 20%, Certifications 10%, Placement 10%, Coding 5%).

---

## 3. Demonstration Accounts & Scenarios

| Role | Email | Password | Scenario Details |
| :--- | :--- | :--- | :--- |
| **Student A** | `aravind.student@college.edu` | `password123` | **VERIFIED Everything** (96% Data Confidence, 88% Employability, Amazon SDE I Placed) |
| **Student B** | `kavitha.student@college.edu` | `password123` | **Self-Declared Claims** (42% Data Confidence, Single Commit Project Flag) |
| **Student C** | `sanjay.student@college.edu` | `password123` | **Suspicious Patterns** (61% Data Confidence, Suspicious Repo Flag) |
| **Student D** | `praveen.student@college.edu` | `password123` | **MCQ Assessment Passed** (91% Data Confidence, Python Assessment 82%) |
| **Faculty** | `faculty.cse@college.edu` | `password123` | **CSE Department Scope** (Queue, Audited Actions & Reasons) |
| **Officer** | `placement@college.edu` | `password123` | **Placement Officer** (Verified Placement Claims & CSV Export) |
| **Admin** | `admin@naanmudhalvan.edu` | `password123` | **System Admin** (Trust Overview, Real-Time IP Audit Logs, AI Status) |

---

## 4. Local Setup & Execution Guide

### Prerequisites
- Node.js v18+ & npm
- Python 3.9+ (for AI Service)

### Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### Database Setup & Seeding
Inside `backend/` directory:
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 1. Run Backend Service (Express + Prisma)
```bash
cd backend
npm run dev
# Running on http://localhost:5000
```

### 2. Run Frontend Web Application (Next.js)
```bash
cd frontend
npm run dev
# Running on http://localhost:3000
```

### 3. Run FastAPI AI Service
```bash
cd ai_service
pip install -r requirements.txt
python main.py
# Running on http://localhost:8000
```

### 4. Run Trust Architecture Test Suite
```bash
cd backend
npx tsx -e "import('./src/__tests__/trustArchitecture.test.js').then(m => m.runTrustArchitectureTests())"
```

---

## 5. System Architecture & Directory Structure

```text
Naan_Mudhalvan/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma (Extended Trust Architecture Models)
│   │   └── seed.ts (Scenarios A, B, C, D)
│   └── src/
│       ├── controllers/
│       │   ├── authController.ts (Institutional Identity & Roll Verification)
│       │   ├── studentController.ts (Read-Only Identity & Evidence CRUD)
│       │   ├── facultyController.ts (Dept-Scoped Verification Queue)
│       │   ├── placementController.ts (Placement Claim Officer Verification)
│       │   ├── adminController.ts (Trust Overview & IP Audit Logs)
│       │   └── trustController.ts (Data Confidence & MCQ Skill Assessment)
│       ├── services/
│       │   ├── integrations/
│       │   │   ├── academic/academicProvider.ts (Institutional ERP Integration)
│       │   │   ├── github/githubEvidenceService.ts (100-pt Repo Analyzer)
│       │   │   └── issuers/issuerVerificationProvider.ts (Issuer API Verification)
│       │   └── verification/
│       │       ├── academicVerificationService.ts (Roll & Token Validation)
│       │       ├── certificateVerificationService.ts (SHA-256 & QR/URL Check)
│       │       ├── projectEvidenceService.ts (GitHub Score & Suspicious Flags)
│       │       ├── skillVerificationService.ts (Multi-Factor Skill Confidence)
│       │       ├── placementVerificationService.ts (Company Normalization)
│       │       ├── trustScoreService.ts (Data Confidence Calculation)
│       │       └── fraudRiskService.ts (Deterministic Anomaly Engine)
│       └── utils/
│           └── auditLogger.ts (Real Client IP Capture)
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── dashboard/
│       │   │   ├── student/ (TrustCenter & Dual Metrics)
│       │   │   ├── faculty/ (Verification Queue & Audit Reasoning)
│       │   │   ├── placement/ (Verified Placement Analytics)
│       │   │   └── admin/ (Trust Overview & IP Log Stream)
│       └── components/
│           ├── trust/
│           │   ├── TrustCenter.tsx (Data Confidence Breakdown)
│           │   └── VerificationBadge.tsx (Status & Tooltip Provenance)
│           └── skills/
│               └── SkillAssessmentModal.tsx (Interactive MCQ Testing)
└── ai_service/
    ├── main.py (FastAPI Routes)
    └── services/
        └── evidence_analyzer.py (NLP Evidence Analysis)
```
