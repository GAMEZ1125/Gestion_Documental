import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const AreaForm = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [prefijo, setPrefijo] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams(); // Captura el ID para modo edición

  // Cargar datos del área si estamos en modo edición
  useEffect(() => {
    if (id) {
      const fetchArea = async () => {
        try {
          const response = await api.get(`/areas/${id}`);
          const { nombre, descripcion, prefijo } = response.data;
          setNombre(nombre);
          setDescripcion(descripcion);
          setPrefijo(prefijo);
          setIsEditMode(true);
        } catch (error) {
          console.error('Error al cargar área:', error);
          alert('Error al cargar el área.');
        }
      };
      fetchArea();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const areaData = { nombre, descripcion, prefijo };

    try {
      if (isEditMode) {
        // Actualizar área existente
        await api.put(`/areas/${id}`, areaData);
        alert('Área actualizada con éxito.');
      } else {
        // Crear nueva área
        await api.post('/areas', areaData);
        alert('Área creada con éxito.');
      }
      navigate('/areas'); // Redirigir al dashboard de áreas
    } catch (error) {
      console.error('Error al guardar área:', error);
      alert('Error al guardar el área.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>{isEditMode ? 'Editar Área' : 'Crear Nueva Área'}</h2>
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
          {isEditMode ? 'Actualizar Área' : 'Crear Área'}
        </button>
      </form>
    </div>
  );
};

export default AreaForm;
