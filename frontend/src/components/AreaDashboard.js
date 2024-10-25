import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const AreaDashboard = () => {
  const [areas, setAreas] = useState([]);
  const [filteredAreas, setFilteredAreas] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el filtro
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Obtener todas las áreas al montar el componente
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await api.get('/areas');
        setAreas(response.data);
        setFilteredAreas(response.data); // Inicialmente mostrar todas las áreas
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
      setFilteredAreas(filteredAreas.filter((area) => area.id !== id)); // Actualiza la lista filtrada
      alert('Área eliminada con éxito.');
    } catch (error) {
      console.error('Error al eliminar área:', error);
      alert('No se pudo eliminar el área.');
    }
  };

  // Función para filtrar áreas
  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    const filtered = areas.filter(area => 
      area.nombre.toLowerCase().includes(value.toLowerCase()) ||
      area.prefijo.toLowerCase().includes(value.toLowerCase()) // Filtra también por prefijo
    );
    setFilteredAreas(filtered);
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Gestión de Áreas</h2>
      <input 
        type="text" 
        className="form-control mb-3" 
        placeholder="Buscar por nombre o prefijo..." 
        value={searchTerm} 
        onChange={handleSearchChange} 
      />
      <Link to="/areas/new" className="btn btn-primary mb-3">
        Crear Nueva Área
      </Link>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Prefijo</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredAreas.map((area) => (
            <tr key={area.id}>
              <td>{area.nombre}</td>
              <td>{area.prefijo}</td>
              <td>{area.descripcion}</td>
              <td>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AreaDashboard;
