const express = require('express');
const router = express.Router();
const medicationController = require('./medication.controller');

router.get('/', medicationController.getMedications);

module.exports = router;
