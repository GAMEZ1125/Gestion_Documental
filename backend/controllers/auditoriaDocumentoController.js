const AuditoriaDocumento = require('../models/AuditoriaDocumento');

// Obtener todos los registros de auditoría de documentos
const getAudits = async (req, res) => {
  try {
    const audits = await AuditoriaDocumento.findAll();
    res.json(audits);
  } catch (error) {
    console.error('Error al obtener auditorías:', error);
    res.status(500).json({ message: 'Error al obtener auditorías.' });
  }
};

module.exports = {
  getAudits,
};
