const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// Ruta para registrar nuevos usuarios
router.post('/register', register);

// Ruta para inicio de sesión
router.post('/login', login);

module.exports = router;
