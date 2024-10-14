const express = require('express');
const Workflow = require('../models/Workflow');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Crear un nuevo flujo de trabajo
router.post('/', authenticateToken, async (req, res) => {
  try {
    const workflow = await Workflow.create(req.body);
    res.status(201).json(workflow);
  } catch (error) {
    console.error('Error al crear flujo de trabajo:', error);
    res.status(500).json({ message: 'Error al crear flujo de trabajo.' });
  }
});

// Actualizar estado del flujo de trabajo
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const [updated] = await Workflow.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) return res.status(404).json({ message: 'Flujo no encontrado.' });
    res.json({ message: 'Estado del flujo actualizado.' });
  } catch (error) {
    console.error('Error al actualizar flujo:', error);
    res.status(500).json({ message: 'Error al actualizar flujo.' });
  }
});

module.exports = router;
