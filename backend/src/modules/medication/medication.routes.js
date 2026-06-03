const express = require('express');
const router = express.Router();
const medicationController = require('./medication.controller');
const authMiddleware = require('../../middleware/auth.middleware');

router.use(authMiddleware); // Protect all medication routes

router.get('/', medicationController.getMedications);
router.post('/', medicationController.createMedication);
router.put('/:id', medicationController.updateMedication);
router.delete('/:id', medicationController.deleteMedication);

// Confirmation logs
router.post('/toggle-log', medicationController.toggleMedicationLog);
router.get('/logs', medicationController.getMedicationLogs);

module.exports = router;

