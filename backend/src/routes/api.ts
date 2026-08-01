import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import * as studentController from '../controllers/studentController.js';
import * as portfolioController from '../controllers/portfolioController.js';
import * as resumeController from '../controllers/resumeController.js';
import * as assessmentController from '../controllers/assessmentController.js';
import * as facultyController from '../controllers/facultyController.js';
import * as placementController from '../controllers/placementController.js';
import * as adminController from '../controllers/adminController.js';
import * as searchController from '../controllers/searchController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.js';

const router = Router();

// Auth Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/refresh-token', authController.refreshToken);
router.get('/auth/me', authenticateToken, authController.getCurrentUser);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password', authController.resetPassword);

// Public Portfolio View Route
router.get('/portfolio/public/:slug', portfolioController.getPublicPortfolio);

// Student Routes
router.get('/student/profile', authenticateToken, studentController.getStudentProfile);
router.put('/student/profile', authenticateToken, studentController.updateStudentProfile);
router.post('/student/skills', authenticateToken, studentController.addOrUpdateSkill);
router.delete('/student/skills/:id', authenticateToken, studentController.deleteSkill);
router.post('/student/projects', authenticateToken, studentController.createProject);
router.put('/student/projects/:id', authenticateToken, studentController.updateProject);
router.delete('/student/projects/:id', authenticateToken, studentController.deleteProject);
router.post('/student/certifications', authenticateToken, studentController.addCertification);
router.delete('/student/certifications/:id', authenticateToken, studentController.deleteCertification);
router.post('/student/sync-external', authenticateToken, studentController.syncExternalProfiles);

// Portfolio & Resume
router.post('/portfolio/config', authenticateToken, portfolioController.updatePortfolioConfig);
router.post('/resume/generate', authenticateToken, resumeController.generateResume);
router.post('/resume/optimize', authenticateToken, resumeController.optimizeResume);

// XAI Assessment & Gap Analysis
router.post('/assessment/predict', authenticateToken, assessmentController.triggerAssessment);
router.get('/assessment/skill-gap', authenticateToken, assessmentController.getSkillGapAnalysis);
router.get('/assessment/roadmap', authenticateToken, assessmentController.getCareerRoadmap);

// Faculty Portal Routes
router.get('/faculty/students', authenticateToken, authorizeRoles('FACULTY', 'ADMIN'), facultyController.getDepartmentStudents);
router.post('/faculty/approve', authenticateToken, authorizeRoles('FACULTY', 'ADMIN'), facultyController.approveStudentItem);
router.get('/faculty/analytics', authenticateToken, authorizeRoles('FACULTY', 'ADMIN'), facultyController.getDepartmentAnalytics);
router.post('/faculty/assign-roadmap', authenticateToken, authorizeRoles('FACULTY', 'ADMIN'), facultyController.assignRoadmap);

// Placement Officer Portal Routes
router.get('/placement/dashboard', authenticateToken, authorizeRoles('PLACEMENT_OFFICER', 'ADMIN'), placementController.getPlacementDashboardStats);
router.get('/placement/top-candidates', authenticateToken, authorizeRoles('PLACEMENT_OFFICER', 'ADMIN'), placementController.getTopCandidates);
router.get('/placement/export-csv', placementController.exportPlacementReport);

// Admin Portal Routes
router.get('/admin/users', authenticateToken, authorizeRoles('ADMIN'), adminController.getUsers);
router.put('/admin/users/:userId/role', authenticateToken, authorizeRoles('ADMIN'), adminController.updateUserRole);
router.get('/admin/audit-logs', authenticateToken, authorizeRoles('ADMIN'), adminController.getSystemLogs);
router.get('/admin/ai-status', authenticateToken, authorizeRoles('ADMIN'), adminController.getAIModelStatus);

// Global Search
router.get('/search', authenticateToken, searchController.globalSearch);

export default router;
