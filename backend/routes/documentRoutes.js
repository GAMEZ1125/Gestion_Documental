// routes/documentRoutes.js
const express = require('express');
const multer = require('multer');
const authenticateToken = require('../middlewares/authMiddleware');
const Documento = require('../models/Documento');
const Area = require('../models/Area');
const TipoDocumento = require('../models/TipoDocumento');
const { 
  createDocument, 
  getDocuments, 
  getDocumentById, 
  updateDocument, 
  deleteDocument 
} = require('../controllers/documentoController');

const router = express.Router();

// Configurar Multer sin renombrar el archivo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta destino
  },
  filename: (req, file, cb) => {
    // Usar el nombre original del archivo
    console.log('Nombre original del archivo:', file.originalname);
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

/* ===== Rutas ===== */

// Crear documento (sin renombrar el archivo)
router.post('/', authenticateToken, upload.single('archivo'), async (req, res) => {
  try {
    console.log('Token:', req.headers.authorization); // Verificar el token
    console.log('Datos del cuerpo:', req.body); // Verificar campos del body
    console.log('Archivo subido:', req.file); // Verificar archivo subido

    const { titulo, descripcion, id_area, id_tipo_documento } = req.body;

    // Validar campos obligatorios
    if (!titulo || !id_area || !id_tipo_documento) {
      return res.status(400).json({ message: 'Faltan campos requeridos.' });
    }

    const area = await Area.findByPk(id_area);
    const tipoDoc = await TipoDocumento.findByPk(id_tipo_documento);

    if (!area || !tipoDoc) {
      return res.status(400).json({ message: 'Área o tipo de documento no encontrado.' });
    }

    const consecutivo = await Documento.count({
      where: { id_area, id_tipo_documento },
    }) + 1;

    console.log(`Consecutivo calculado: ${consecutivo}`);

    // Crear registro en la base de datos
    const documento = await Documento.create({
      titulo,
      descripcion,
      version: 1,
      estado: 'Borrador',
      id_area,
      id_tipo_documento,
      ruta_archivo: `uploads/${req.file.filename}`, // Usar el nombre original del archivo
    });

    res.status(201).json({ message: 'Documento creado con éxito.', documento });
  } catch (error) {
    console.error('Error al crear documento:', error);
    res.status(500).json({ message: 'Error interno del servidor.', error });
  }
});

// Obtener lista de documentos
router.get('/', authenticateToken, getDocuments);

// Obtener un documento por ID
router.get('/:id', authenticateToken, getDocumentById);

// Actualizar un documento por ID
router.put('/:id', authenticateToken, updateDocument);

// Eliminar un documento por ID
router.delete('/:id', authenticateToken, deleteDocument);

// Calcular consecutivo para un área y tipo de documento
router.get('/consecutivo/:id_area/:id_tipo_documento', async (req, res) => {
  const { id_area, id_tipo_documento } = req.params;

  try {
    const count = await Documento.count({
      where: { id_area, id_tipo_documento },
    });

    const consecutivo = count + 1;
    console.log(`Consecutivo calculado: ${consecutivo}`);
    res.json({ consecutivo });
  } catch (error) {
    console.error('Error al calcular consecutivo:', error);
    res.status(500).json({ message: 'Error al calcular consecutivo.' });
  }
});

module.exports = router;
