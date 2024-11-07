// /routes/areaRoutes.js
const express = require('express');
const {
  getAreas,
  getAreaById,
  createArea,
  updateArea,
  deleteArea,
} = require('../controllers/areaController'); // Importar el controlador
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Rutas usando el controlador
router.get('/', authenticateToken, getAreas);
router.get('/:id', authenticateToken, getAreaById);
router.post('/', authenticateToken, createArea);
router.put('/:id', authenticateToken, updateArea);
router.delete('/:id', authenticateToken, deleteArea);

module.exports = router;
