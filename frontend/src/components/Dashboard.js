// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);

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
      <Link to="/documents/new" className="btn btn-primary mb-3">
        Crear Documento
      </Link>
      <Link to="/users" className="btn btn-primary mb-3">
        Gestionar Usuarios
      </Link>
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
