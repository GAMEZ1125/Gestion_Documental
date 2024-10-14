// controllers/documentoController.js

const Documento = require('../models/Documento');

// Obtener todos los documentos
const getDocuments = async (req, res) => {
  try {
    const documentos = await Documento.findAll();
    res.json(documentos);
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    res.status(500).json({ message: 'Error al obtener documentos.' });
  }
};

// Obtener un documento por ID
const getDocumentById = async (req, res) => {
  try {
    const documento = await Documento.findByPk(req.params.id);
    if (!documento) {
      return res.status(404).json({ message: 'Documento no encontrado.' });
    }
    res.json(documento);
  } catch (error) {
    console.error('Error al obtener documento:', error);
    res.status(500).json({ message: 'Error al obtener documento.' });
  }
};

// Crear un documento
const createDocument = async (req, res) => {
  try {
    const documento = await Documento.create(req.body);
    res.status(201).json(documento);
  } catch (error) {
    console.error('Error al crear documento:', error);
    res.status(500).json({ message: 'Error al crear documento.' });
  }
};

// Actualizar un documento por ID
const updateDocument = async (req, res) => {
  try {
    const [updated] = await Documento.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) {
      return res.status(404).json({ message: 'Documento no encontrado.' });
    }
    res.json({ message: 'Documento actualizado con éxito.' });
  } catch (error) {
    console.error('Error al actualizar documento:', error);
    res.status(500).json({ message: 'Error al actualizar documento.' });
  }
};

// Eliminar un documento por ID
const deleteDocument = async (req, res) => {
  try {
    const deleted = await Documento.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Documento no encontrado.' });
    }
    res.json({ message: 'Documento eliminado con éxito.' });
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    res.status(500).json({ message: 'Error al eliminar documento.' });
  }
};

module.exports = {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
};
