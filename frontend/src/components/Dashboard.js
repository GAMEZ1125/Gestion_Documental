// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
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
