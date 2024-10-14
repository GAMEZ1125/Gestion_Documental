const express = require('express');
const Notification = require('../models/Notification');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Obtener notificaciones para un usuario
router.get('/:id_usuario', authenticateToken, async (req, res) => {
  try {
    const notificaciones = await Notification.findAll({
      where: { id_usuario: req.params.id_usuario },
    });
    res.json(notificaciones);
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({ message: 'Error al obtener notificaciones.' });
  }
});

// Marcar notificación como leída
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const [updated] = await Notification.update({ leido: true }, {
      where: { id: req.params.id },
    });
    if (!updated) return res.status(404).json({ message: 'Notificación no encontrada.' });
    res.json({ message: 'Notificación marcada como leída.' });
  } catch (error) {
    console.error('Error al marcar notificación:', error);
    res.status(500).json({ message: 'Error al marcar notificación.' });
  }
});

module.exports = router;
