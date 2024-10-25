// src/pages/DocumentWorkflow.js
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
      <ul className="list-group">
        {documents.map((doc) => (
          <li key={doc.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{doc.titulo}</span>
            <div>
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
            </div>
          </li>
        ))}
      </ul>

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
