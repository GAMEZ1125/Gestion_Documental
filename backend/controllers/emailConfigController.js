// controllers/emailConfigController.js
const EmailConfig = require('../models/EmailConfig');
const nodemailer = require('nodemailer');

const emailConfigController = {
  // Obtener la configuración actual
  async getConfig(req, res) {
    try {
      const config = await EmailConfig.findOne();
      
      if (!config) {
        // Retornar configuración vacía si no existe
        return res.json({
          host: '',
          port: '',
          secure: true,
          user: '',
          password: '',
          from: ''
        });
      }

      res.json(config);
    } catch (error) {
      console.error('Error al obtener configuración:', error);
      res.status(500).json({ 
        message: 'Error al obtener la configuración de correo',
        error: error.message 
      });
    }
  },

  // Guardar o actualizar la configuración
  async saveConfig(req, res) {
    try {
      const { host, port, secure, user, password, from } = req.body;
      
      // Buscar configuración existente
      const existingConfig = await EmailConfig.findOne();
      
      if (existingConfig) {
        // Actualizar configuración existente
        await existingConfig.update({
          host,
          port,
          secure,
          user,
          password,
          from
        });
      } else {
        // Crear nueva configuración
        await EmailConfig.create({
          host,
          port,
          secure,
          user,
          password,
          from
        });
      }

      res.json({ message: 'Configuración guardada exitosamente' });
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      res.status(500).json({ 
        message: 'Error al guardar la configuración de correo',
        error: error.message 
      });
    }
  },

  // Probar la configuración enviando un correo
  async testConfig(req, res) {
    try {
      const { testEmail } = req.body;
      const config = await EmailConfig.findOne();

      if (!config) {
        return res.status(400).json({ message: 'No hay configuración de correo guardada' });
      }

      // Crear transportador de correo
      const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
          user: config.user,
          pass: config.password,
        },
      });

      // Enviar correo de prueba
      await transporter.sendMail({
        from: config.from,
        to: testEmail,
        subject: 'Correo de prueba',
        text: 'Este es un correo de prueba para verificar la configuración SMTP.',
        html: '<p>Este es un correo de prueba para verificar la configuración SMTP.</p>',
      });

      res.json({ message: 'Correo de prueba enviado exitosamente' });
    } catch (error) {
      console.error('Error al enviar correo de prueba:', error);
      res.status(500).json({ 
        message: 'Error al enviar correo de prueba',
        error: error.message 
      });
    }
  },
};

module.exports = emailConfigController;