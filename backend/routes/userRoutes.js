// routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/Usuario'); // Asegúrate de que este modelo exista
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Obtener un usuario por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const usuario = await User.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: 'Error al obtener usuario.' });
  }
});

// Actualizar un usuario por ID (PUT)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, correo_electronico, contraseña, rol } = req.body;

    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Encriptar la contraseña si se proporciona
    if (contraseña) {
      usuario.contraseña = await bcrypt.hash(contraseña, 10);
    }

    usuario.nombre = nombre || usuario.nombre;
    usuario.apellido = apellido || usuario.apellido;
    usuario.correo_electronico = correo_electronico || usuario.correo_electronico;
    usuario.rol = rol || usuario.rol;

    await usuario.save();
    res.json({ message: 'Usuario actualizado con éxito.', usuario });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error al actualizar usuario.' });
  }
});

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

// Obtener todos los usuarios (GET)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const usuarios = await User.findAll();
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios.' });
  }
});

// Eliminar usuario (DELETE)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.json({ message: 'Usuario eliminado con éxito.' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error al eliminar usuario.' });
  }
});

module.exports = router;
