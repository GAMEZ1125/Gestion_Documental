// /routes/documentRoutes.js
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
// Obtener un documento por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const documento = await Documento.findByPk(req.params.id);
    if (!documento) {
      return res.status(404).json({ message: 'Documento no encontrado.' });
    }
    res.json(documento);
  } catch (error) {
    console.error('Error al obtener documento:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});
// Función para obtener el prefijo del área basado en id_area
async function obtenerPrefijoArea(id_area) {
  const area = await Area.findByPk(id_area); // Asume que tienes el modelo Area importado
  return area ? area.prefijo : ''; // Ajusta 'prefijo' al nombre correcto del campo en tu modelo
}

// Función para obtener el prefijo del tipo de documento basado en id_tipo_documento
async function obtenerPrefijoTipoDocumento(id_tipo_documento) {
  const tipoDoc = await TipoDocumento.findByPk(id_tipo_documento); // Asume que tienes el modelo TipoDocumento importado
  return tipoDoc ? tipoDoc.prefijo : ''; // Ajusta 'prefijo' al nombre correcto del campo en tu modelo
}

// **Editar documento: Crear nueva versión**
router.put('/edit/:id', authenticateToken, upload.single('archivo'), async (req, res) => {
  try {
    const { titulo, descripcion, observaciones } = req.body;
    const userId = req.user.id;

    // Verificar si se pasó un ID válido
    console.log('ID del documento a editar:', req.params.id);

    const documentoOriginal = await Documento.findByPk(req.params.id);
    if (!documentoOriginal) {
      console.error('Documento no encontrado con ID:', req.params.id);
      return res.status(404).json({ message: 'Documento no encontrado.' });
    }

    console.log('Documento original encontrado:', documentoOriginal.toJSON());

    // Cambiar el estado del documento original a 'Versión antigua' si estaba aprobado
    if (documentoOriginal.estado === 'Aprobado') {
      documentoOriginal.estado = 'Versión antigua';
      await documentoOriginal.save();
      console.log('Estado del documento original cambiado a "Versión antigua"');
    }

    const nuevaVersion = documentoOriginal.version + 1;
    const extension = req.file ? req.file.originalname.split('.').pop() : 'pdf'; // Valor por defecto

    // Obtener prefijos de área y tipo de documento
    const prefijoArea = await obtenerPrefijoArea(documentoOriginal.id_area); // Cambiado para obtener prefijo
    const prefijoTipoDocumento = await obtenerPrefijoTipoDocumento(documentoOriginal.id_tipo_documento); // Cambiado para obtener prefijo

    // Modificado: Agregar prefijos y consecutivo al nuevo nombre
    const consecutivo = documentoOriginal.ruta_archivo.split('-')[2]; // Obtener el consecutivo del documento original
    const nuevoNombre = `${prefijoArea}-${prefijoTipoDocumento}-${consecutivo}-${titulo}-${nuevaVersion}.${extension}`;
    const rutaArchivo = path.join(__dirname, '../uploads', nuevoNombre); // Ruta correcta del archivo

    // Si se subió un archivo, guarda la nueva versión
    if (req.file) {
      fs.writeFile(rutaArchivo, req.file.buffer, async (err) => {
        if (err) {
          console.error('Error al guardar archivo:', err);
          return res.status(500).json({ message: 'Error al guardar archivo.' });
        }

        console.log('Archivo guardado en:', rutaArchivo);

        const nuevoDocumento = await Documento.create({
          titulo,
          descripcion,
          version: nuevaVersion,
          estado: 'Borrador',
          id_area: documentoOriginal.id_area,
          id_tipo_documento: documentoOriginal.id_tipo_documento,
          ruta_archivo: `uploads/${nuevoNombre}`, // Ruta relativa para almacenar en la base de datos
        });

        console.log('Nuevo documento creado:', nuevoDocumento.toJSON());

        // Registrar auditoría
        await AuditoriaDocumento.create({
          accion: 'Edición',
          observaciones,
          id_usuario: userId,
          id_documento: nuevoDocumento.id,
        });

        res.json({ message: 'Documento editado con éxito.', documento: nuevoDocumento });
      });
    } else {
      // Si no hay archivo, solo actualizar otros campos
      documentoOriginal.titulo = titulo;
      documentoOriginal.descripcion = descripcion;
      documentoOriginal.version = nuevaVersion;

      await documentoOriginal.save();
      console.log('Documento actualizado sin nuevo archivo:', documentoOriginal.toJSON());

      // Registrar auditoría
      await AuditoriaDocumento.create({
        accion: 'Edición sin archivo',
        observaciones,
        id_usuario: userId,
        id_documento: documentoOriginal.id,
      });

      res.json({ message: 'Documento editado con éxito.', documento: documentoOriginal });
    }
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
