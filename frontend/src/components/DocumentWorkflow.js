import React, { useEffect, useState } from 'react';
import api from '../services/api';

const DocumentWorkflow = () => {
  const [documents, setDocuments] = useState([]);

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
      await api.put(`/documents/${id}/aprobar`);
      alert('Documento aprobado con éxito.');
      setDocuments(documents.filter((doc) => doc.id !== id));
    } catch (error) {
      console.error('Error al aprobar documento:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.delete(`/documents/${id}/rechazar`);
      alert('Documento rechazado y eliminado.');
      setDocuments(documents.filter((doc) => doc.id !== id));
    } catch (error) {
      console.error('Error al rechazar documento:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>WorkFlow de Documentos</h2>
      <ul className="list-group">
        {documents.map((doc) => (
          <li key={doc.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{doc.titulo}</span>
            <div>
              <button className="btn btn-success btn-sm me-2" onClick={() => handleApprove(doc.id)}>
                Aprobar
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => handleReject(doc.id)}>
                Rechazar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentWorkflow;
