// utils/emailSender.js
const nodemailer = require('nodemailer');
const EmailConfig = require('../models/EmailConfig');

async function sendEmail(to, subject, text, html) {
  try {
    const config = await EmailConfig.findOne();
    if (!config) {
      throw new Error('No hay configuración de correo guardada.');
    }

    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.password,
      },
    });

    await transporter.sendMail({
      from: config.from,
      to,
      subject,
      text,
      html,
    });

    console.log(`Correo enviado a: ${to}`);
  } catch (error) {
    console.error('Error al enviar correo:', error.message);
    throw error;
  }
}

module.exports = { sendEmail };
