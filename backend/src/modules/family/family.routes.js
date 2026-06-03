const express = require('express');
const router = express.Router();
const familyController = require('./family.controller');
const authMiddleware = require('../../middleware/auth.middleware');

router.use(authMiddleware); // Protect all family routes

router.get('/', familyController.getFamily);
router.post('/', familyController.createFamily);
router.post('/join', familyController.joinFamily);

module.exports = router;

