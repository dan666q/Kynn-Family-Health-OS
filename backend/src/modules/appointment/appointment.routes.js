const express = require('express');
const router = express.Router();
const appointmentController = require('./appointment.controller');
const authMiddleware = require('../../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/', appointmentController.getAppointments);
router.post('/', appointmentController.createAppointment);
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;
