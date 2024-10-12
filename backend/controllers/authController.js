const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generateToken } = require('../utils/jwt');

// Registro de usuarios
exports.register = async (req, res) => {
  const { nombre, apellido, correo_electronico, contraseña, rol } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      correo_electronico,
      contraseña: hashedPassword,
      rol,
    });
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el registro', error });
  }
};

// Inicio de sesión
exports.login = async (req, res) => {
  const { correo_electronico, contraseña } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { correo_electronico } });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const isMatch = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = generateToken(usuario);
    res.json({ token, usuario });
  } catch (error) {
    res.status(500).json({ message: 'Error en el inicio de sesión', error });
  }
};
