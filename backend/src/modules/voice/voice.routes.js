const express = require('express');
const router = express.Router();
const voiceController = require('./voice.controller');

router.post('/upload', voiceController.uploadVoiceNote);

module.exports = router;
