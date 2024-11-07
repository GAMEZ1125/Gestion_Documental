// src/components/DocumentWorkflow.js
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../services/api';

const DocumentWorkflow = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [observaciones, setObservaciones] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get('/documents?estado=Borrador');
        setDocuments(response.data);
      } catch (error) {
        console.error('Error al obtener documentos pendientes:', error);
      }
    };
    fetchDocuments();
  }, []);

  // Función para descargar archivos
  const handleDownload = async (filename) => {
    try {
      const response = await api.get(`/documents/download/${filename}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
      alert('El archivo no se pudo descargar.');
    }
  };

  // Función para aprobar documentos
  const handleApprove = async (id) => {
    try {
      await api.put(`/documents/${id}`, { estado: 'Aprobado' });
      alert('Documento aprobado con éxito.');
      setDocuments(documents.filter((doc) => doc.id !== id));
    } catch (error) {
      console.error('Error al aprobar documento:', error);
    }
  };

  const openRejectModal = (document) => {
    setSelectedDocument(document);
    setShowModal(true);
  };

  const handleReject = async () => {
    if (!observaciones) {
      alert('Por favor, ingresa una observación para el rechazo.');
      return;
    }

    try {
      await api.put(`/documents/reject/${selectedDocument.id}`, {
        observaciones,
      });
      alert('Documento rechazado y eliminado.');
      setDocuments(documents.filter((doc) => doc.id !== selectedDocument.id));
      setShowModal(false);
      setObservaciones('');
    } catch (error) {
      console.error('Error al rechazar documento:', error);
      alert('Error al rechazar el documento.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Workflow de Documentos</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Título</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id}>
              <td>{doc.titulo}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleDownload(doc.ruta_archivo.split('/').pop())}
                >
                  Descargar
                </button>
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={() => handleApprove(doc.id)}
                >
                  Aprobar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => openRejectModal(doc)}
                >
                  Rechazar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para observaciones */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Rechazar Documento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="observaciones">
              <Form.Label>Motivo del Rechazo</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Ingresa el motivo del rechazo..."
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleReject}>
            Rechazar Documento
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DocumentWorkflow;
