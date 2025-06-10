// src/components/DocumentForm.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const DocumentForm = () => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [areas, setAreas] = useState([]);
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [idArea, setIdArea] = useState('');
  const [idTipoDocumento, setIdTipoDocumento] = useState('');
  const [consecutivo, setConsecutivo] = useState(0);
  const navigate = useNavigate();

  // Cargar Áreas asignadas al usuario y Tipos de Documento al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener el ID del usuario del token
        const token = localStorage.getItem('token');
        const { id: userId } = JSON.parse(atob(token.split('.')[1]));

        // Realizar las peticiones en paralelo
        const [userAreasResponse, tiposResponse] = await Promise.all([
          api.get(`/usuarios-areas/${userId}/areas`),
          api.get('/tipos_documentos'),
        ]);

        // Establecer las áreas del usuario y tipos de documento
        setAreas(userAreasResponse.data);
        setTiposDocumento(tiposResponse.data);

        // Si el usuario solo tiene un área asignada, seleccionarla automáticamente
        if (userAreasResponse.data.length === 1) {
          setIdArea(userAreasResponse.data[0].id.toString());
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    };
    fetchData();
  }, [navigate]);

  // Calcular el consecutivo al cambiar el área o tipo de documento
  useEffect(() => {
    const fetchConsecutivo = async () => {
      if (idArea && idTipoDocumento) {
        try {
          const response = await api.get(
            `/documents/consecutivo/${idArea}/${idTipoDocumento}`
          );
          setConsecutivo(response.data.consecutivo);
        } catch (error) {
          console.error('Error al calcular consecutivo:', error);
        }
      }
    };
    fetchConsecutivo();
  }, [idArea, idTipoDocumento]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!archivo) {
      alert('Por favor seleccione un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('archivo', archivo);
    formData.append('id_area', idArea);
    formData.append('id_tipo_documento', idTipoDocumento);

    try {
      await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Documento creado exitosamente');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al crear el documento:', error);
      alert(error.response?.data?.message || 'Error al crear el documento.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Crear Documento</h2>
      
      {areas.length === 0 && (
        <div className="alert alert-warning">
          No tiene áreas asignadas. Por favor contacte al administrador.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Área</label>
          <select
            className="form-control"
            value={idArea}
            onChange={(e) => setIdArea(e.target.value)}
            required
            disabled={areas.length === 1} // Deshabilitar si solo hay un área
          >
            <option value="">Seleccione un área</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Tipo de Documento</label>
          <select
            className="form-control"
            value={idTipoDocumento}
            onChange={(e) => setIdTipoDocumento(e.target.value)}
            required
          >
            <option value="">Seleccione un tipo de documento</option>
            {tiposDocumento.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Título</label>
          <input
            type="text"
            className="form-control"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Consecutivo</label>
          <input
            type="text"
            className="form-control"
            value={consecutivo}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows="3"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Archivo</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setArchivo(e.target.files[0])}
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={areas.length === 0}
        >
          Crear Documento
        </button>
      </form>
    </div>
  );
};

export default DocumentForm;