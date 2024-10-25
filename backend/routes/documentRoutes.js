// src/routes/documentRoutes.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const authenticateToken = require('../middlewares/authMiddleware');
const Documento = require('../models/Documento');
const Area = require('../models/Area');
const TipoDocumento = require('../models/TipoDocumento');
const AuditoriaDocumento = require('../models/AuditoriaDocumento');

const router = express.Router();

// Configuración de almacenamiento de archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* ===== RUTAS ===== */

// **Descargar archivo desde 'uploads'**
router.get('/download/:filename', authenticateToken, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads', filename);

  res.download(filePath, (err) => {
    if (err) {
      console.error('Error al descargar archivo:', err);
      return res.status(404).json({ message: 'Archivo no encontrado.' });
    }
  });
});

// **Crear documento**
router.post('/', authenticateToken, upload.single('archivo'), async (req, res) => {
  try {
    const { titulo, descripcion, id_area, id_tipo_documento } = req.body;
    const userId = req.user.id;

    const area = await Area.findByPk(id_area);
    const tipoDoc = await TipoDocumento.findByPk(id_tipo_documento);

    const consecutivo = await Documento.count({ where: { id_area, id_tipo_documento } }) + 1;
    const version = 1;
    const extension = req.file.originalname.split('.').pop();
    const nuevoNombre = `${area.prefijo}-${tipoDoc.prefijo}-${String(consecutivo).padStart(2, '0')}-${titulo}-${version}.${extension}`;
    const rutaArchivo = path.join(__dirname, '../uploads', nuevoNombre);

    fs.writeFile(rutaArchivo, req.file.buffer, async (err) => {
      if (err) return res.status(500).json({ message: 'Error al guardar archivo.' });

      const documento = await Documento.create({
        titulo,
        descripcion,
        version,
        estado: 'Borrador',
        id_area,
        id_tipo_documento,
        ruta_archivo: `uploads/${nuevoNombre}`,
      });

      // Registro en auditoría
      await AuditoriaDocumento.create({
        accion: 'Creación',
        observaciones: 'Documento creado',
        id_usuario: userId,
        id_documento: documento.id,
      });

      res.status(201).json({ message: 'Documento creado con éxito.', documento });
    });
  } catch (error) {
    console.error('Error al crear documento:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// **Editar documento: Crear nueva versión**
router.put('/edit/:id', authenticateToken, upload.single('archivo'), async (req, res) => {
  try {
    const { titulo, descripcion, observaciones } = req.body;
    const userId = req.user.id;

    const documentoOriginal = await Documento.findByPk(req.params.id);
    if (!documentoOriginal) return res.status(404).json({ message: 'Documento no encontrado.' });

    const nuevaVersion = documentoOriginal.version + 1;
    const extension = req.file.originalname.split('.').pop();
    const nuevoNombre = `${documentoOriginal.ruta_archivo.split('-')[0]}-${titulo}-${nuevaVersion}.${extension}`;
    const rutaArchivo = path.join(__dirname, '../uploads', nuevoNombre);

    fs.writeFile(rutaArchivo, req.file.buffer, async (err) => {
      if (err) return res.status(500).json({ message: 'Error al guardar archivo.' });

      const nuevoDocumento = await Documento.create({
        titulo,
        descripcion,
        version: nuevaVersion,
        estado: 'Borrador',
        id_area: documentoOriginal.id_area,
        id_tipo_documento: documentoOriginal.id_tipo_documento,
        ruta_archivo: `uploads/${nuevoNombre}`,
      });

      // Registrar auditoría
      await AuditoriaDocumento.create({
        accion: 'Edición',
        observaciones,
        id_usuario: userId,
        id_documento: nuevoDocumento.id,
      });

      res.json({ message: 'Documento editado con éxito.', documento: nuevoDocumento });
    });
  } catch (error) {
    console.error('Error al editar documento:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Verificar si un archivo existe
const fileExists = (filePath) => {
  return new Promise((resolve) => {
    fs.access(filePath, fs.constants.F_OK, (err) => resolve(!err));
  });
};

// **Rechazar documento, actualizar estado y eliminar archivo**
router.put('/reject/:id', authenticateToken, async (req, res) => {
  const { observaciones } = req.body;
  const userId = req.user.id;

  try {
    const documento = await Documento.findByPk(req.params.id);
    if (!documento) {
      return res.status(404).json({ message: 'Documento no encontrado.' });
    }

    const rutaArchivo = path.join(__dirname, '../', documento.ruta_archivo);
    const archivoExiste = await fileExists(rutaArchivo);

    // **Registrar auditoría de rechazo**
    await AuditoriaDocumento.create({
      accion: 'Rechazo',
      observaciones,
      id_usuario: userId,
      id_documento: documento.id,
    });

    if (archivoExiste) {
      fs.unlink(rutaArchivo, (err) => {
        if (err) {
          console.error('Error al eliminar archivo:', err);
          return res.status(500).json({ message: 'Error al eliminar archivo.' });
        }
      });
    }

    // **Actualizar estado a Rechazado en lugar de eliminar**
    documento.estado = 'Rechazado';
    await documento.save();

    res.json({ message: 'Documento rechazado y archivo eliminado.' });
  } catch (error) {
    console.error('Error al rechazar documento:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// **Obtener documentos filtrados por estado**
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

// **Actualizar estado del documento**
router.put('/:id', authenticateToken, async (req, res) => {
  const { estado } = req.body;
  const userId = req.user.id;

  try {
    const documento = await Documento.findByPk(req.params.id);
    if (!documento) return res.status(404).json({ message: 'Documento no encontrado.' });

    documento.estado = estado;
    await documento.save();

    // Registro en auditoría
    await AuditoriaDocumento.create({
      accion: `Cambio de estado a ${estado}`,
      observaciones: `Estado cambiado a ${estado}`,
      id_usuario: userId,
      id_documento: documento.id,
    });

    res.json({ message: 'Documento actualizado.', documento });
  } catch (error) {
    console.error('Error al actualizar documento:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// **Calcular consecutivo excluyendo documentos rechazados**
router.get('/consecutivo/:id_area/:id_tipo_documento', async (req, res) => {
  const { id_area, id_tipo_documento } = req.params;

  try {
    const count = await Documento.count({
      where: {
        id_area,
        id_tipo_documento,
        estado: { [Sequelize.Op.not]: 'Rechazado' } // Excluir rechazados
      }
    });
    const consecutivo = count + 1;
    res.json({ consecutivo });
  } catch (error) {
    console.error('Error al calcular consecutivo:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

module.exports = router;
