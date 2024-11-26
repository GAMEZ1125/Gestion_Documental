// services/notificationService.js
const nodemailer = require('nodemailer');
const EmailConfig = require('../models/EmailConfig');
const Usuario = require('../models/Usuario');

class NotificationService {
  async sendNotification(emailOptions) {
    try {
      // Obtener configuración
      const config = await EmailConfig.findOne();
      if (!config) {
        throw new Error('No hay configuración de correo guardada');
      }

      // Crear transportador para cada envío
      const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
          user: config.user,
          pass: config.password,
        },
      });

      // Enviar correo
      await transporter.sendMail({
        from: config.from,
        ...emailOptions
      });

      console.log('Correo enviado exitosamente a:', emailOptions.to);
    } catch (error) {
      console.error('Error al enviar correo:', error);
      throw error;
    }
  }

  async notifyDocumentCreation(documento, creador) {
    try {
      // 1. Notificar al creador
      await this.sendNotification({
        to: creador.correo_electronico,
        subject: 'Documento Creado Exitosamente',
        html: `
          <h2>Confirmación de Creación de Documento</h2>
          <p>Hola ${creador.nombre},</p>
          <p>Tu documento "${documento.titulo}" ha sido creado exitosamente y está pendiente de revisión.</p>
          <p>Detalles del documento:</p>
          <ul>
            <li>Título: ${documento.titulo}</li>
            <li>Versión: ${documento.version}</li>
            <li>Estado: ${documento.estado}</li>
          </ul>
          <p>Te notificaremos cuando el documento haya sido revisado.</p>
        `
      });

      // 2. Notificar a administradores y editores
      const adminEditores = await Usuario.findAll({
        where: {
          rol: ['admin', 'editor']
        }
      });

      for (const usuario of adminEditores) {
        await this.sendNotification({
          to: usuario.correo_electronico,
          subject: 'Nuevo Documento Pendiente de Revisión',
          html: `
            <h2>Nuevo Documento para Revisar</h2>
            <p>Hola ${usuario.nombre},</p>
            <p>El usuario ${creador.nombre} ${creador.apellido} ha creado un nuevo documento que requiere revisión.</p>
            <p>Detalles del documento:</p>
            <ul>
              <li>Título: ${documento.titulo}</li>
              <li>Versión: ${documento.version}</li>
              <li>Estado: ${documento.estado}</li>
              <li>Creado por: ${creador.nombre} ${creador.apellido}</li>
            </ul>
            <p>Por favor, revisa el documento cuando tengas oportunidad.</p>
          `
        });
      }

      console.log('Todas las notificaciones enviadas exitosamente');
    } catch (error) {
      console.error('Error en el proceso de notificación:', error);
      throw error;
    }
  }
}

// Exportar una instancia de la clase
module.exports = new NotificationService();