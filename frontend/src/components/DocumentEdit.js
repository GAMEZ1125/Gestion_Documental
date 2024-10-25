// src/components/DocumentEdit.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const DocumentEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [version, setVersion] = useState('');

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await api.get(`/documents/${id}`);
        setDocument(response.data);
        setVersion(response.data.version);
      } catch (error) {
        console.error('Error al cargar documento:', error);
      }
    };
    fetchDocument();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await api.put(`/documents/${id}`, { version });
      alert('Documento actualizado con éxito.');
      navigate('/documents');
    } catch (error) {
      console.error('Error al actualizar documento:', error);
    }
  };

  if (!document) return <p>Cargando...</p>;

  return (
    <div className="container mt-5">
      <h2>Editar Documento</h2>
      <p>Título: {document.titulo}</p>
      <input
        type="text"
        className="form-control mb-3"
        value={version}
        onChange={(e) => setVersion(e.target.value)}
      />
      <button className="btn btn-primary" onClick={handleUpdate}>
        Guardar Cambios
      </button>
    </div>
  );
};

export default DocumentEdit;
