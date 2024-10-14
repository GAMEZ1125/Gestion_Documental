const express = require('express');
const router = express.Router();
const Area = require('../models/Area');

// Obtener todas las áreas
router.get('/', async (req, res) => {
  try {
    const areas = await Area.findAll();
    res.json(areas);
  } catch (error) {
    console.error('Error al obtener áreas:', error);
    res.status(500).json({ message: 'Error al obtener áreas.' });
  }
});

module.exports = router;
