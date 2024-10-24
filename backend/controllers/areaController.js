const Area = require('../models/Area');

// Obtener todas las áreas
const getAreas = async (req, res) => {
  try {
    const areas = await Area.findAll();
    res.json(areas);
  } catch (error) {
    console.error('Error al obtener áreas:', error);
    res.status(500).json({ message: 'Error al obtener áreas.' });
  }
};

// Obtener un área por ID
const getAreaById = async (req, res) => {
  try {
    const area = await Area.findByPk(req.params.id);
    if (!area) return res.status(404).json({ message: 'Área no encontrada.' });
    res.json(area);
  } catch (error) {
    console.error('Error al obtener área:', error);
    res.status(500).json({ message: 'Error al obtener área.' });
  }
};

// Crear una nueva área
const createArea = async (req, res) => {
  try {
    const { nombre, descripcion, prefijo } = req.body;
    const area = await Area.create({ nombre, descripcion, prefijo });
    res.status(201).json(area);
  } catch (error) {
    console.error('Error al crear área:', error);
    res.status(500).json({ message: 'Error al crear área.' });
  }
};

// Actualizar un área
const updateArea = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, prefijo } = req.body;

    const area = await Area.findByPk(id);
    if (!area) return res.status(404).json({ message: 'Área no encontrada.' });

    area.nombre = nombre || area.nombre;
    area.descripcion = descripcion || area.descripcion;
    area.prefijo = prefijo || area.prefijo;

    await area.save();
    res.json({ message: 'Área actualizada con éxito.', area });
  } catch (error) {
    console.error('Error al actualizar área:', error);
    res.status(500).json({ message: 'Error al actualizar área.' });
  }
};

// Eliminar un área
const deleteArea = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Area.destroy({ where: { id } });

    if (!deleted) return res.status(404).json({ message: 'Área no encontrada.' });

    res.json({ message: 'Área eliminada con éxito.' });
  } catch (error) {
    console.error('Error al eliminar área:', error);
    res.status(500).json({ message: 'Error al eliminar área.' });
  }
};

module.exports = {
  getAreas,
  getAreaById,
  createArea,
  updateArea,
  deleteArea,
};
