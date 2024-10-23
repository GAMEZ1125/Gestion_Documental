// src/controllers/userController.js
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs'); // Encriptación de contraseñas

// Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios.' });
  }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: 'Error al obtener usuario.' });
  }
};

// Crear un usuario
const createUser = async (req, res) => {
  try {
    const { nombre, apellido, correo_electronico, contraseña, rol } = req.body;

    // Encriptar contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const usuario = await Usuario.create({
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
};

// Actualizar un usuario por ID
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, correo_electronico, contraseña, rol } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Encriptar nueva contraseña si es proporcionada
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
};

// Eliminar un usuario por ID
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Usuario.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.json({ message: 'Usuario eliminado con éxito.' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error al eliminar usuario.' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
