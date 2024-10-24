import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const TipoDocumentoForm = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [prefijo, setPrefijo] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams(); // Captura el ID para modo edición

  // Cargar datos del tipo de documento si estamos en modo edición
  useEffect(() => {
    if (id) {
      const fetchTipo = async () => {
        try {
          const response = await api.get(`/tipos_documentos/${id}`);
          const { nombre, descripcion, prefijo } = response.data;
          setNombre(nombre);
          setDescripcion(descripcion);
          setPrefijo(prefijo);
          setIsEditMode(true);
        } catch (error) {
          console.error('Error al cargar tipo de documento:', error);
          alert('Error al cargar el tipo de documento.');
        }
      };
      fetchTipo();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tipoData = { nombre, descripcion, prefijo };

    try {
      if (isEditMode) {
        // Actualizar tipo de documento existente
        await api.put(`/tipos_documentos/${id}`, tipoData);
        alert('Tipo de documento actualizado con éxito.');
      } else {
        // Crear nuevo tipo de documento
        await api.post('/tipos_documentos', tipoData);
        alert('Tipo de documento creado con éxito.');
      }
      navigate('/tipos_documentos'); // Redirigir al dashboard de tipos de documentos
    } catch (error) {
      console.error('Error al guardar tipo de documento:', error);
      alert('Error al guardar el tipo de documento.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>{isEditMode ? 'Editar Tipo de Documento' : 'Crear Nuevo Tipo de Documento'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nombre</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Descripción</label>
          <textarea
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Prefijo</label>
          <input
            type="text"
            className="form-control"
            value={prefijo}
            onChange={(e) => setPrefijo(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {isEditMode ? 'Actualizar Tipo de Documento' : 'Crear Tipo de Documento'}
        </button>
      </form>
    </div>
  );
};

export default TipoDocumentoForm;