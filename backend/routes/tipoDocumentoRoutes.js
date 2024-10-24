const express = require('express');
const {
  getTiposDocumento,
  getTipoDocumentoById,
  createTipoDocumento,
  updateTipoDocumento,
  deleteTipoDocumento,
} = require('../controllers/tipoDocumentoController');
const authenticateToken = require('../middlewares/authMiddleware'); // Verificar token  

const router = express.Router(); // Crear router

//Rutas de acceso a los métodos de la clase TipoDocumento
router.get('/', authenticateToken, getTiposDocumento);
router.get('/:id', authenticateToken, getTipoDocumentoById);
router.post('/', authenticateToken, createTipoDocumento);
router.put('/:id', authenticateToken, updateTipoDocumento); // Actualizar un tipo de documento
router.delete('/:id', authenticateToken, deleteTipoDocumento); // Eliminar un tipo de documento

module.exports = router; // Exportar router