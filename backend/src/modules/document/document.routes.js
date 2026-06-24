const express = require('express');
const router = express.Router();
const documentController = require('./document.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const upload = require('../../middleware/upload.middleware');

router.use(authMiddleware);

router.get('/', documentController.getDocuments);
router.post('/', upload.single('file'), documentController.createDocument);
router.delete('/:id', documentController.deleteDocument);

module.exports = router;
