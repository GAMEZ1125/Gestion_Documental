import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const DocumentDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Cargar lista de documentos al montar el componente
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get('/documents');
        setDocuments(response.data);
      } catch (error) {
        console.error('Error al obtener documentos:', error);
        setError('No se pudo obtener los documentos. Inténtalo de nuevo.');
        if (error.response && error.response.status === 401) {
          alert('No autorizado. Inicia sesión.');
          navigate('/login');
        }
      }
    };
    fetchDocuments();
  }, [navigate]);

  // Eliminar un documento
  const handleDelete = async (id) => {
    try {
      await api.delete(`/documents/${id}`);      
      setDocuments(documents.filter((documento) => documento.id !== id));
      alert('Documento eliminado con éxito.');
    } catch (error) {
      console.error('Error al eliminar documento:', error);
      alert('No se pudo eliminar el documento.');
    }
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Gestión de Documentos</h2>
      <Link to="/documents/new" className="btn btn-primary mb-3">
        Crear Nuevo Documento
      </Link>
      <ul className="list-group">
        {documents.map((documento) => (
          <li key={documento.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{documento.titulo}</span>
            <span>{documento.id_area}</span>
            <span>{documento.id_tipo_documento}</span>
            <div>
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => navigate(`/documents/edit/${documento.id}`)}
              >
                Editar
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(documento.id)}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentDashboard;