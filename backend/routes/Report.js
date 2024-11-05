import express from 'express';
import ReportController from '../controller/Report.js';

const router = express.Router();

// Maintenance report route
router.get('/Report/maintenance', ReportController.getMaintenanceReport);

// Contractor performance report route
router.get('/Report/contractor', ReportController.getContractorPerformanceReport);

export default router;
