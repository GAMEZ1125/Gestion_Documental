const Documento = require('../models/Documento');

// Crear un documento
exports.createDocument = async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      contenido,
      version,
      estado,
      id_area,
      id_tipo_documento,
    } = req.body;

    // Verificar si se recibió un archivo
    const rutaArchivo = req.file ? req.file.path : null;

    const documento = await Documento.create({
      titulo,
      descripcion,
      contenido,
      version,
      estado,
      id_area,
      id_tipo_documento,
      ruta_archivo: rutaArchivo,
    });

    res.status(201).json(documento);
  } catch (error) {
    console.error('Error al crear documento:', error);
    res.status(500).json({ message: 'Error interno del servidor', error });
  }
};

// Obtener todos los documentos
exports.getDocuments = async (req, res) => {
  try {
    const documentos = await Documento.findAll();
    res.status(200).json(documentos);
  } catch (error) {hj56
    res.status(500).json({ message: 'Error al obtener documentos', error });
  }
};

// Obtener un documento por ID
exports.getDocumentById = async (req, res) => {
  try {
    const documento = await Documento.findByPk(req.params.id);
    if (!documento) return res.status(404).json({ message: 'Documento no encontrado' });
    res.status(200).json(documento);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener documento', error });
  }
};

// Actualizar un documento
exports.updateDocument = async (req, res) => {
  const { titulo, descripcion, contenido, version, estado, id_area, id_tipo_documento, ruta_archivo } = req.body;
  try {
    const documento = await Documento.findByPk(req.params.id);
    if (!documento) return res.status(404).json({ message: 'Documento no encontrado' });

    await documento.update({
      titulo,
      descripcion,
      contenido,
      version,
      estado,
      id_area,
      id_tipo_documento,
      ruta_archivo,
    });

    res.status(200).json(documento);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar documento', error });
  }
};

// Eliminar un documento
exports.deleteDocument = async (req, res) => {
  try {
    const documento = await Documento.findByPk(req.params.id);
    if (!documento) return res.status(404).json({ message: 'Documento no encontrado' });

    await documento.destroy();
    res.status(200).json({ message: 'Documento eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar documento', error });
  }
};
