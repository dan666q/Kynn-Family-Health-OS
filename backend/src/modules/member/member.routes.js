const express = require('express');
const router = express.Router();
const memberController = require('./member.controller');

router.get('/', memberController.getMembers);

module.exports = router;
