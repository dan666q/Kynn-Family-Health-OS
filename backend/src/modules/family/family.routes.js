const express = require('express');
const router = express.Router();
const familyController = require('./family.controller');

router.get('/', familyController.getFamily);

module.exports = router;
