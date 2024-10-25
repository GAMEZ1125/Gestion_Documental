import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const AreaDashboard = () => {
  const [areas, setAreas] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Obtener todas las áreas al montar el componente
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await api.get('/areas');
        setAreas(response.data);
      } catch (error) {
        console.error('Error al obtener áreas:', error);
        setError('No se pudo obtener las áreas. Inténtalo de nuevo.');
        if (error.response && error.response.status === 401) {
          alert('No autorizado. Inicia sesión.');
          navigate('/login');
        }
      }
    };
    fetchAreas();
  }, [navigate]);

  // Eliminar un área
  const handleDelete = async (id) => {
    try {
      await api.delete(`/areas/${id}`);
      setAreas(areas.filter((area) => area.id !== id));
      alert('Área eliminada con éxito.');
    } catch (error) {
      console.error('Error al eliminar área:', error);
      alert('No se pudo eliminar el área.');
    }
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Gestión de Áreas</h2>
      <Link to="/areas/new" className="btn btn-primary mb-3">
        Crear Nueva Área
      </Link>
      <ul className="list-group">
        {areas.map((area) => (
          <li key={area.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{area.nombre} - {area.prefijo}</span>
            <span>{area.descripcion}</span>
            <div>
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => navigate(`/areas/edit/${area.id}`)}
              >
                Editar
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(area.id)}
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

export default AreaDashboard;
