const express = require('express');
const router = express.Router();
const timelineController = require('./timeline.controller');
const authMiddleware = require('../../middleware/auth.middleware');

router.use(authMiddleware); // Protect all timeline routes

router.get('/', timelineController.getActivities);

module.exports = router;

