// routes/documentRoutes.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const authenticateToken = require('../middlewares/authMiddleware');
const Documento = require('../models/Documento');
const Area = require('../models/Area');
const TipoDocumento = require('../models/TipoDocumento');

const router = express.Router();

// Descargar un archivo desde la carpeta 'uploads'
router.get('/download/:filename', authenticateToken, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads', filename);

  res.download(filePath, (err) => {
    if (err) {
      console.error('Error al descargar el archivo:', err);
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }
  });
});

// Crear documento
router.post('/', authenticateToken, multer({ storage: multer.memoryStorage() }).single('archivo'), async (req, res) => {
  try {
    const { titulo, descripcion, id_area, id_tipo_documento } = req.body;

    const area = await Area.findByPk(id_area);
    const tipoDoc = await TipoDocumento.findByPk(id_tipo_documento);

    const consecutivo = await Documento.count({ where: { id_area, id_tipo_documento } }) + 1;
    const version = 1;
    const extension = req.file.originalname.split('.').pop();
    const nuevoNombre = `${area.prefijo}-${tipoDoc.prefijo}-${String(consecutivo).padStart(2, '0')}-${titulo}-${version}.${extension}`;
    const rutaArchivo = path.join(__dirname, '../uploads', nuevoNombre);

    fs.writeFile(rutaArchivo, req.file.buffer, async (err) => {
      if (err) {
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

// Obtener documentos filtrados por estado
router.get('/', authenticateToken, async (req, res) => {
  const { estado } = req.query;
  const where = estado ? { estado } : {};

  try {
    const documentos = await Documento.findAll({ where });
    res.json(documentos);
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    res.status(500).json({ message: 'Error al obtener documentos.' });
  }
});

// Actualizar estado del documento
router.put('/:id', authenticateToken, async (req, res) => {
  const { estado } = req.body;

  try {
    const documento = await Documento.findByPk(req.params.id);
    documento.estado = estado;
    await documento.save();

    res.json({ message: 'Documento actualizado.', documento });
  } catch (error) {
    console.error('Error al actualizar documento:', error);
    res.status(500).json({ message: 'Error al actualizar documento.' });
  }
});

// Eliminar un documento por ID
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Documento.destroy({ where: { id } });

    if (!deleted) return res.status(404).json({ message: 'Documento no encontrado.' });

    res.json({ message: 'Documento eliminado con éxito.' });
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    res.status(500).json({ message: 'Error al eliminar documento.' });
  }
});
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
