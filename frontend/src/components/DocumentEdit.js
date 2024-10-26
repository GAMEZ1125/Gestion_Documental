// src/components/DocumentEdit.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const DocumentEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [version, setVersion] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);

  // Cargar el documento desde la API
  useEffect(() => {
    const fetchDocument = async () => {
      console.log('Cargando documento con ID:', id); // Log del ID que se está usando
      try {
        const response = await api.get(`/documents/${id}`);
        setDocument(response.data);
        setVersion(response.data.version);
      } catch (error) {
        console.error('Error al cargar documento:', error);
        setError('No se pudo cargar el documento. Intenta de nuevo más tarde.');
      }
    };
    fetchDocument();
  }, [id]);

  // Manejar la actualización del documento
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('titulo', document.titulo);
      formData.append('descripcion', document.descripcion);
      formData.append('observaciones', 'Nueva versión creada');
      formData.append('version', version);

      // Agregar archivo si se seleccionó
      if (selectedFile) {
        formData.append('archivo', selectedFile);
      }

      await api.put(`/documents/edit/${id}`, formData);
      alert('Nueva versión creada con éxito.');
      navigate('/documents');
    } catch (error) {
      console.error('Error al actualizar documento:', error);
      setError('Error al actualizar el documento. Intenta de nuevo más tarde.');
    }
  };

  // Manejar la selección de archivos
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Mostrar mensaje de error si existe
  if (error) return <p className="text-danger">{error}</p>;

  // Si no se ha cargado el documento
  if (!document) return <p>Cargando...</p>;

  return (
    <div className="container mt-5">
      <h2>Editar Documento</h2>
      <p>Título: {document.titulo}</p>
      <p>Descripción: {document.descripcion}</p>
      <input
        type="text"
        className="form-control mb-3"
        value={version}
        onChange={(e) => setVersion(e.target.value)}
        placeholder="Actualizar versión"
      />
      <input
        type="file"
        className="form-control mb-3"
        onChange={handleFileChange}
      />
      <button className="btn btn-primary" onClick={handleUpdate}>
        Guardar Cambios
      </button>
    </div>
  );
};

export default DocumentEdit;
