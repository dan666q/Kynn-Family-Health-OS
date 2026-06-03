const express = require('express');
const router = express.Router();
const memberController = require('./member.controller');
const authMiddleware = require('../../middleware/auth.middleware');

router.use(authMiddleware); // Protect all member routes

router.get('/', memberController.getMembers);
router.post('/', memberController.createMember);
router.put('/:id', memberController.updateMember);
router.delete('/:id', memberController.deleteMember);

module.exports = router;

