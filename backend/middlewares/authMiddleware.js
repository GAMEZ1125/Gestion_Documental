// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

// Middleware para validar el token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Leer el encabezado 'Authorization'
  const token = authHeader && authHeader.split(' ')[1]; // Extraer token si existe

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token inválido:', err);
      return res.status(403).json({ message: 'Token inválido o expirado.' });
    }
    req.user = user; // Almacenar el usuario en la solicitud
    next(); // Pasar al siguiente middleware o controlador
  });
};

module.exports = authenticateToken;
