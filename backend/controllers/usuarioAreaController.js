// controllers/usuarioAreaController.js
const UsuarioArea = require('../models/UsuarioArea');
const Area = require('../models/Area'); // Asegúrate de importar el modelo Area

// Asociar áreas a un usuario
const associateAreasToUser = async (req, res) => {
  const { userId } = req.params;
  const { areaIds } = req.body; // array de IDs de áreas

  try {
    if (Array.isArray(areaIds) && areaIds.length > 0) {
      const usuarioAreas = areaIds.map((areaId) => ({ id_usuario: userId, id_area: areaId }));
      await UsuarioArea.bulkCreate(usuarioAreas, { ignoreDuplicates: true }); // Ignorar duplicados si ya existe
      return res.status(200).json({ message: 'Áreas asociadas con éxito al usuario.' });
    }
    return res.status(400).json({ message: 'Se requieren IDs de áreas válidos.' });
  } catch (error) {
    console.error('Error al asociar áreas al usuario:', error);
    return res.status(500).json({ message: 'Error al asociar áreas al usuario.' });
  }
};

// Desasociar área de un usuario
const disassociateAreaFromUser = async (req, res) => {
  const { userId, areaId } = req.params;

  try {
    const deleted = await UsuarioArea.destroy({ where: { id_usuario: userId, id_area: areaId } });
    if (deleted) {
      return res.status(200).json({ message: 'Área desasociada del usuario con éxito.' });
    }
    return res.status(404).json({ message: 'Relación no encontrada.' });
  } catch (error) {
    console.error('Error al desasociar área del usuario:', error);
    return res.status(500).json({ message: 'Error al desasociar área del usuario.' });
  }
};

// Obtener áreas asociadas a un usuario
const getAreasForUser = async (userId) => {
  try {
    const areas = await UsuarioArea.findAll({
      where: { id_usuario: userId },
      include: [{
        model: Area,
        required: true, // Esto hace que solo se incluyan las filas donde hay coincidencias
      }],
    });

    return areas.map(usuarioArea => usuarioArea.Area); // Retorna solo las áreas
  } catch (error) {
    console.error('Error al obtener áreas del usuario:', error);
    throw error; // Maneja el error según sea necesario
  }
};
// Obtener áreas asociadas a un usuario
const getUserAreas = async (req, res) => {
  const { userId } = req.params; // Obtener userId de los parámetros de la ruta

  try {
    const areas = await getAreasForUser(userId); // Llamar a la función que obtiene áreas
    return res.status(200).json(areas); // Devolver las áreas como respuesta
  } catch (error) {
    console.error('Error al obtener áreas del usuario:', error);
    return res.status(500).json({ message: 'Error al obtener áreas del usuario.' });
  }
};

module.exports = {
  associateAreasToUser,
  disassociateAreaFromUser,
  getAreasForUser,
  getUserAreas,
};
