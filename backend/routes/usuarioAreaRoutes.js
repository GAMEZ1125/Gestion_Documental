// routes/usuarioAreaRoutes.js
const express = require('express');
const router = express.Router();
const usuarioAreaController = require('../controllers/usuarioAreaController'); // Importa el controlador

// Ruta para asociar áreas a un usuario
router.post('/:userId/areas', usuarioAreaController.associateAreasToUser);

// Ruta para desasociar áreas de un usuario
router.delete('/:userId/areas/:areaId', usuarioAreaController.disassociateAreaFromUser);

// Ruta para obtener áreas asociadas a un usuario
router.get('/:userId/areas', usuarioAreaController.getUserAreas); // Usa el controlador

module.exports = router;
