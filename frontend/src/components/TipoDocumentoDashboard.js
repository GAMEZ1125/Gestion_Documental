import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const TipoDocumentoDashboard = () => {
  const [tipos, setTipos] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Cargar lista de tipos de documentos al montar el componente
  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const response = await api.get('/tipos_documentos');
        setTipos(response.data);
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
      alert('Tipo de documento eliminado con éxito.');
    } catch (error) {
      console.error('Error al eliminar tipo de documento:', error);
      alert('No se pudo eliminar el tipo de documento.');
    }
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
      <ul className="list-group">
        {tipos.map((tipo) => (
          <li key={tipo.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{tipo.nombre}</span>
            {/* <span>{tipo.descripcion}</span> */}
            <span>{tipo.prefijo}</span>
            <div>
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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TipoDocumentoDashboard;