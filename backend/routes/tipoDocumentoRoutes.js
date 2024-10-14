const express = require('express');
const router = express.Router();
const TipoDocumento = require('../models/TipoDocumento');

// Obtener todos los tipos de documentos
router.get('/', async (req, res) => {
  try {
    const tipos = await TipoDocumento.findAll();
    res.json(tipos);
  } catch (error) {
    console.error('Error al obtener tipos de documentos:', error);
    res.status(500).json({ message: 'Error al obtener tipos de documentos.' });
  }
});

module.exports = router;
