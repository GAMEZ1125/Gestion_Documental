const TipoDocumento = require('../models/TipoDocumento');
// Obtener todos los tipos de documentos
const getTiposDocumento = async (req, res) => {
  try {
    const tipos = await TipoDocumento.findAll();
    res.json(tipos);
  } catch (error) {
    console.error('Error al obtener tipos de documentos:', error);
    res.status(500).json({ message: 'Error al obtener tipos de documentos.' });
  }
};
// Obtener un tipo de documento por ID
const getTipoDocumentoById = async (req, res) => {
  try {
    const tipo = await TipoDocumento.findByPk(req.params.id);
    if (!tipo) return res.status(404).json({ message: 'Tipo de documento no encontrado.' });
    res.json(tipo);
  } catch (error) {
    console.error('Error al obtener tipo de documento:', error);
    res.status(500).json({ message: 'Error al obtener tipo de documento.' });
  }
};
// Crear un tipo de documento
const createTipoDocumento = async (req, res) => {
  try {
    const { nombre, descripcion, prefijo } = req.body;
    const tipo = await TipoDocumento.create({ nombre, descripcion, prefijo });
    res.status(201).json(tipo);
  } catch (error) {
    console.error('Error al crear tipo de documento:', error);
    res.status(500).json({ message: 'Error al crear tipo de documento.' });
  }
};
// Actualizar un tipo de documento
const updateTipoDocumento = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, prefijo } = req.body;

    const tipo = await TipoDocumento.findByPk(id);
    if (!tipo) return res.status(404).json({ message: 'Tipo de documento no encontrado.' });

    tipo.nombre = nombre || tipo.nombre;
    tipo.descripcion = descripcion || tipo.descripcion;
    tipo.prefijo = prefijo || tipo.prefijo;

    await tipo.save();
    res.json({ message: 'Tipo de documento actualizado con éxito.', tipo });
  } catch (error) {
    console.error('Error al actualizar tipo de documento:', error);
    res.status(500).json({ message: 'Error al actualizar tipo de documento.' });
  }
};
// Eliminar un tipo de documento
const deleteTipoDocumento = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await TipoDocumento.destroy({ where: { id } });

    if (!deleted) return res.status(404).json({ message: 'Tipo de documento no encontrado.' });

    res.json({ message: 'Tipo de documento eliminado con éxito.' });
  } catch (error) {
    console.error('Error al eliminar tipo de documento:', error);
    res.status(500).json({ message: 'Error al eliminar tipo de documento.' });
  }
};

module.exports = {
  getTiposDocumento,
  getTipoDocumentoById,
  createTipoDocumento,
  updateTipoDocumento,
  deleteTipoDocumento,
};