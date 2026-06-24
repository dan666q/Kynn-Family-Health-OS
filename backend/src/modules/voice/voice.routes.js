const express = require('express');
const router = express.Router();
const voiceController = require('./voice.controller');
const upload = require('../../middleware/upload.middleware');
const authMiddleware = require('../../middleware/auth.middleware');

router.post('/upload', authMiddleware, upload.single('audio'), voiceController.uploadVoiceNote);

module.exports = router;

