// src/services/emailService.js
import api from './api';

const emailService = {
  // Notificación de creación de documento
  async notifyDocumentCreation(document, creator, editors) {
    const emailData = {
      template: 'document-creation',
      data: {
        document,
        creator,
        editors
      },
      recipients: editors.map(editor => editor.email)
    };
    
    try {
      await api.post('/notifications/email', emailData);
    } catch (error) {
      console.error('Error sending creation notification:', error);
    }
  },

  // Notificación para revisión de documento
  async notifyDocumentForReview(document, editor) {
    const emailData = {
      template: 'document-review',
      data: {
        document,
        editor
      },
      recipients: [editor.email]
    };

    try {
      await api.post('/notifications/email', emailData);
    } catch (error) {
      console.error('Error sending review notification:', error);
    }
  },

  // Notificación de aprobación/rechazo de documento
  async notifyDocumentDecision(document, decision, observations, creator) {
    const emailData = {
      template: decision === 'approved' ? 'document-approved' : 'document-rejected',
      data: {
        document,
        observations,
        creator
      },
      recipients: [creator.email]
    };

    try {
      await api.post('/notifications/email', emailData);
    } catch (error) {
      console.error('Error sending decision notification:', error);
    }
  },

  // Notificación de edición de documento
  async notifyDocumentEdit(document, editor, creator, editors) {
    const emailData = {
      template: 'document-edited',
      data: {
        document,
        editor,
        creator
      },
      recipients: [...editors.map(ed => ed.email), creator.email]
    };

    try {
      await api.post('/notifications/email', emailData);
    } catch (error) {
      console.error('Error sending edit notification:', error);
    }
  }
};

export default emailService;