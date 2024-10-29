// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import "../css/DashBoard.css";

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [userRole, setUserRole] = useState(''); // Guardar el rol del usuario

  const navigate = useNavigate();

  // Extraer el rol del token al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirigir si no hay token
      return;
    }

    const { rol } = JSON.parse(atob(token.split('.')[1])); // Decodificar token para extraer el rol
    setUserRole(rol); // Guardar el rol del usuario
  }, [navigate]);

  // Cargar los documentos
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get('/documents');
        setDocuments(response.data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Documentos</h2>
      {(userRole === 'admin' || userRole === 'usuario') && (
        <Link to="/documents/new" className="btn btn-primary mb-3">
          Crear Documento
        </Link>
      )}

      {userRole === 'admin' && (
        <>
          <Link to="/users" className="btn btn-primary mb-3">
            Gestionar Usuarios
          </Link>
          <Link to="/areas" className="btn btn-primary mb-3">
            Gestionar Áreas
          </Link>
          <Link to="/tipos_documentos" className="btn btn-primary mb-3">
            Gestionar Tipos de Documentos
          </Link>
        </>
      )}

      <ul className="list-group">
        {documents.map((doc) => (
          <li key={doc.id} className="list-group-item">
            {doc.titulo}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
