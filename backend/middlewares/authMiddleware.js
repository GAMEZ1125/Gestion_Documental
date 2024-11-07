//  middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

// Middleware para validar el token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token inválido:', err);
      return res.status(403).json({ message: 'Token inválido o expirado.' });
    }

    req.user = user; // Almacena el usuario (incluye id y rol) en la solicitud
    next();
  });
};

module.exports = authenticateToken;
