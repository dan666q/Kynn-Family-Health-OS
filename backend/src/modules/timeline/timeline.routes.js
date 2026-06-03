const express = require('express');
const router = express.Router();
const timelineController = require('./timeline.controller');

router.get('/', timelineController.getActivities);

module.exports = router;
