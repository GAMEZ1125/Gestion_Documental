import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const TipoDocumentoDashboard = () => {
  const [tipos, setTipos] = useState([]);
  const [filteredTipos, setFilteredTipos] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el filtro
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Cargar lista de tipos de documentos al montar el componente
  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const response = await api.get('/tipos_documentos');
        setTipos(response.data);
        setFilteredTipos(response.data); // Inicialmente mostrar todos los tipos
      } catch (error) {
        console.error('Error al obtener tipos de documentos:', error);
        setError('No se pudo obtener los tipos de documentos. Inténtalo de nuevo.');
        if (error.response && error.response.status === 401) {
          alert('No autorizado. Inicia sesión.');
          navigate('/login');
        }
      }
    };
    fetchTipos();
  }, [navigate]);

  // Eliminar un tipo de documento
  const handleDelete = async (id) => {
    try {
      await api.delete(`/tipos_documentos/${id}`);
      setTipos(tipos.filter((tipo) => tipo.id !== id));
      setFilteredTipos(filteredTipos.filter((tipo) => tipo.id !== id)); // Actualizar la lista filtrada
      alert('Tipo de documento eliminado con éxito.');
    } catch (error) {
      console.error('Error al eliminar tipo de documento:', error);
      alert('No se pudo eliminar el tipo de documento.');
    }
  };

  // Función para filtrar tipos de documentos
  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    const filtered = tipos.filter(tipo => 
      tipo.nombre.toLowerCase().includes(value.toLowerCase()) || 
      tipo.prefijo.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTipos(filtered);
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Gestión de Tipos de Documentos</h2>
      <Link to="/tipos_documentos/new" className="btn btn-primary mb-3">
        Crear Nuevo Tipo de Documento
      </Link>
      <input 
        type="text" 
        className="form-control mb-3" 
        placeholder="Buscar por nombre o prefijo..." 
        value={searchTerm} 
        onChange={handleSearchChange} 
      />
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Prefijo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredTipos.map((tipo) => (
            <tr key={tipo.id}>
              <td>{tipo.nombre}</td>
              <td>{tipo.prefijo}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => navigate(`/tipos_documentos/edit/${tipo.id}`)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(tipo.id)}
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

export default TipoDocumentoDashboard;
