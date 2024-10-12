const express = require('express');
const { createDocument, getDocuments, getDocumentById, updateDocument, deleteDocument } = require('../controllers/documentoController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Rutas protegidas con JWT
router.post('/', authenticateToken, createDocument);
router.get('/', authenticateToken, getDocuments);
router.get('/:id', authenticateToken, getDocumentById);
router.put('/:id', authenticateToken, updateDocument);
router.delete('/:id', authenticateToken, deleteDocument);

module.exports = router;
