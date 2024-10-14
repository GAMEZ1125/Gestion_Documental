// routes/documentRoutes.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const authenticateToken = require('../middlewares/authMiddleware');
const {
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
} = require('../controllers/documentoController'); // Importación correcta de controladores

const Documento = require('../models/Documento');
const Area = require('../models/Area');
const TipoDocumento = require('../models/TipoDocumento');

const router = express.Router();

// Configuración de Multer usando memoryStorage para renombrar después de recibir el archivo
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* ===== Rutas ===== */

// Crear un documento con renombrado personalizado
router.post('/', authenticateToken, upload.single('archivo'), async (req, res) => {
  try {
    console.log('Datos del cuerpo:', req.body); // Verificar campos del body
    console.log('Archivo subido:', req.file); // Verificar archivo

    const { titulo, descripcion, id_area, id_tipo_documento } = req.body;

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

    const version = 1;
    const extension = req.file.originalname.split('.').pop();

    const nuevoNombre = `${area.prefijo}-${tipoDoc.prefijo}-${String(consecutivo).padStart(2, '0')}-${titulo}-${version}.${extension}`;
    const rutaArchivo = path.join(__dirname, '../uploads', nuevoNombre);

    fs.writeFile(rutaArchivo, req.file.buffer, async (err) => {
      if (err) {
        console.error('Error al guardar el archivo:', err);
        return res.status(500).json({ message: 'Error al guardar el archivo.' });
      }

      const documento = await Documento.create({
        titulo,
        descripcion,
        version,
        estado: 'Borrador',
        id_area,
        id_tipo_documento,
        ruta_archivo: `uploads/${nuevoNombre}`,
      });

      res.status(201).json({ message: 'Documento creado con éxito.', documento });
    });
  } catch (error) {
    console.error('Error al crear el documento:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
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

// Calcular consecutivo para área y tipo de documento
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
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

module.exports = router;
