// routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/Usuario'); // Asegúrate de que este modelo existe
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Crear usuario (POST)
router.post('/', async (req, res) => {
  try {
    const { nombre, apellido, correo_electronico, contraseña, rol } = req.body;
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const usuario = await User.create({
      nombre,
      apellido,
      correo_electronico,
      contraseña: hashedPassword,
      rol,
    });

    res.status(201).json(usuario);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error al crear usuario.' });
  }
});

// Obtener usuarios (GET)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const usuarios = await User.findAll();
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios.' });
  }
});

module.exports = router;
