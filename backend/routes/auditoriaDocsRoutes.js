const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const auditoriaDocumentoController = require('../controllers/auditoriaDocumentoController');
const AuditoriaDocumento = require('../models/AuditoriaDocumento');
const Documento = require('../models/Documento');
const Usuario = require('../models/Usuario');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

// Ruta para obtener todas las auditorias
router.get('/', auditoriaDocumentoController.getAudits);

// Ruta para filtrar auditorias (ejemplo con query params)
router.get('/filtrar', async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const filterOptions = {};

    if (fechaInicio && fechaFin) {
      filterOptions.fecha = { 
        [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
      };
    }

    const audits = await AuditoriaDocumento.findAll({ where: filterOptions });
    res.json(audits);
  } catch (error) {
    console.error('Error al filtrar auditorias:', error);
    res.status(500).json({ message: 'Error al filtrar auditorias.' });
  }
});

// Ruta para exportar auditorias a PDF
router.get('/exportar/pdf', async (req, res) => {
  // Código para exportar a PDF...
});

// Ruta para exportar auditorias a Excel
router.get('/exportar/excel', async (req, res) => {
  try {
    const { fechaInicio, fechaFin, accion } = req.query;
    const filterOptions = {};

    if (fechaInicio && fechaFin) {
      filterOptions.fecha = { 
        [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
      };
    }
    if (accion) {
      filterOptions.accion = { [Op.like]: `%${accion}%` };
    }

    const audits = await AuditoriaDocumento.findAll({
      where: filterOptions,
      include: [
        { model: Documento, as: 'documento', attributes: ['titulo'] },
        { model: Usuario, as: 'usuario', attributes: ['nombre'] },
      ],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Auditorias');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Detalles', key: 'detalles', width: 30 },
      { header: 'Observaciones', key: 'observaciones', width: 30 },
      { header: 'Usuario', key: 'usuario', width: 30 },
      { header: 'Documento', key: 'documento', width: 30 }
    ];

    audits.forEach(audit => {
      worksheet.addRow({
        id: audit.id,
        fecha: audit.fecha,
        detalles: audit.accion,
        observaciones: audit.observaciones,
        usuario: audit.usuario ? audit.usuario.nombre : 'Desconocido',
        documento: audit.documento ? audit.documento.titulo : 'Desconocido',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=auditorias.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error al exportar Excel:', error);
    res.status(500).json({ message: 'Error al exportar Excel.' });
  }
});

module.exports = router;
