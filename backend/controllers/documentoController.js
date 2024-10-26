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
    const documentId = req.params.id;
    console.log('ID del documento a editar:', documentId);

    const documentoOriginal = await Documento.findByPk(documentId);
    if (!documentoOriginal) {
      return res.status(404).json({ message: 'Documento no encontrado.' });
    }

    console.log('Documento original encontrado:', documentoOriginal);

    // Cambia el estado del documento original
    await Documento.update(
      { estado: 'Versión antigua' },
      { where: { id: documentId } }
    );

    // Nueva versión
    const nuevaVersion = documentoOriginal.version + 1;

    // Usa el título original para construir el nuevo nombre de archivo
    const nombreOriginal = documentoOriginal.titulo.replace(/\s+/g, '-'); // Reemplaza espacios por guiones

    // Obtiene la extensión del archivo original
    const extensionOriginal = path.extname(documentoOriginal.ruta_archivo); // Extrae la extensión del archivo original
    const nuevoNombre = `${nombreOriginal}-${nuevaVersion}${extensionOriginal}`; // Construye el nuevo nombre

    const rutaArchivo = path.join(__dirname, '../uploads', nuevoNombre);

    // Asegúrate de que la carpeta uploads exista
    if (!fs.existsSync(path.join(__dirname, '../uploads'))) {
      fs.mkdirSync(path.join(__dirname, '../uploads'), { recursive: true });
    }

    // Mueve el archivo a la nueva ruta
    fs.rename(req.file.path, rutaArchivo, (err) => {
      if (err) {
        console.error('Error al guardar archivo:', err);
        return res.status(500).json({ message: 'Error al guardar archivo.', error: err });
      }

      // Crea el nuevo documento con el nuevo nombre
      Documento.create({
        titulo: documentoOriginal.titulo, // Mantiene el título original
        descripcion: documentoOriginal.descripcion,
        contenido: null,
        version: nuevaVersion,
        estado: 'Borrador', // Cambia el estado según tu lógica
        id_area: documentoOriginal.id_area,
        id_tipo_documento: documentoOriginal.id_tipo_documento,
        ruta_archivo: rutaArchivo,
      })
        .then((nuevoDocumento) => {
          res.status(201).json(nuevoDocumento);
        })
        .catch((error) => {
          console.error('Error al crear nuevo documento:', error);
          res.status(500).json({ message: 'Error al crear nuevo documento.', error });
        });
    });
  } catch (error) {
    console.error('Error al editar documento:', error);
    res.status(500).json({ message: 'Error al editar documento.', error });
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
