// src/components/DocumentForm.js
import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const DocumentForm = () => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [contenido, setContenido] = useState('');
  const [version, setVersion] = useState(1);
  const [estado, setEstado] = useState('Borrador');
  const [idArea, setIdArea] = useState('');
  const [idTipoDocumento, setIdTipoDocumento] = useState('');
  const [rutaArchivo, setRutaArchivo] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/documents', {
        titulo,
        descripcion,
        contenido,
        version,
        estado,
        id_area: idArea,
        id_tipo_documento: idTipoDocumento,
        ruta_archivo: rutaArchivo,
      });
      console.log('Documento creado:', response.data);
      navigate('/dashboard');  // Redirige al Dashboard después de crear el documento
    } catch (error) {
      console.error('Error al crear el documento:', error);
      alert('Error al crear el documento');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Crear Documento</h2>
      <form onSubmit={handleSubmit}>
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
          <label>Descripción</label>
          <textarea
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Contenido</label>
          <textarea
            className="form-control"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Versión</label>
          <input
            type="number"
            className="form-control"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Estado</label>
          <select
            className="form-control"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            required
          >
            <option value="Borrador">Borrador</option>
            <option value="Revisión">Revisión</option>
            <option value="Aprobado">Aprobado</option>
            <option value="Rechazado">Rechazado</option>
          </select>
        </div>
        <div className="mb-3">
          <label>Área</label>
          <input
            type="number"
            className="form-control"
            value={idArea}
            onChange={(e) => setIdArea(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Tipo de Documento</label>
          <input
            type="number"
            className="form-control"
            value={idTipoDocumento}
            onChange={(e) => setIdTipoDocumento(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Ruta del Archivo</label>
          <input
            type="text"
            className="form-control"
            value={rutaArchivo}
            onChange={(e) => setRutaArchivo(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Crear Documento</button>
      </form>
    </div>
  );
};

export default DocumentForm;
