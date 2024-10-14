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
  const [consecutivo, setConsecutivo] = useState(0); // Consecutivo dinámico
  const navigate = useNavigate();

  // Cargar Áreas y Tipos de Documento al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [areasResponse, tiposResponse] = await Promise.all([
          api.get('/areas'),
          api.get('/tipos_documentos'),
        ]);
        setAreas(areasResponse.data);
        setTiposDocumento(tiposResponse.data);
      } catch (error) {
        console.error('Error al cargar áreas o tipos de documentos:', error);
      }
    };
    fetchData();
  }, []);

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
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('archivo', archivo);
    formData.append('id_area', idArea);
    formData.append('id_tipo_documento', idTipoDocumento);

    try {
      const response = await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Documento creado:', response.data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al crear el documento:', error);
      alert('Error al crear el documento.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Crear Documento</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Área</label>
          <select
            className="form-control"
            value={idArea}
            onChange={(e) => setIdArea(e.target.value)}
            required
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
          <label>Tipo de Documento</label>
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
          <label>Título</label>
          <input
            type="text"
            className="form-control"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Consecutivo</label>
          <input
            type="text"
            className="form-control"
            value={consecutivo}
            readOnly
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
          <label>Archivo</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setArchivo(e.target.files[0])}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Crear Documento
        </button>
      </form>
    </div>
  );
};

export default DocumentForm;
