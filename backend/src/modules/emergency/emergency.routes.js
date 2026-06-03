const express = require('express');
const router = express.Router();
const emergencyController = require('./emergency.controller');

router.get('/', emergencyController.getEmergencyCard);

module.exports = router;
