// src/components/DocumentDashboard.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const DocumentDashboard = () => {
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  // Extraer el rol del token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirigir si no hay token
      return;
    }

    const { rol } = JSON.parse(atob(token.split('.')[1])); // Decodificar token
    setUserRole(rol);
  }, [navigate]);

  return (
    <div className="container mt-5">
      <h2>Documentos</h2>

      {(userRole === 'admin' || userRole === 'usuario' || userRole === 'editor') && (
        <Link to="/documents/new" className="btn btn-primary mb-3">
          Crear Documento
        </Link>
      )}

      <Link to="/documents/view" className="btn btn-secondary mb-3">
        Consultar Documentos Aprobados
      </Link>

      {userRole !== 'usuario' && (
        <>
          <Link to="/documents/workflow" className="btn btn-info mb-3">
            Workflow de Documentos
          </Link>
          <Link to="/documents/management" className="btn btn-warning mb-3">
            Gestionar Documentos
          </Link>
        </>
      )}
    </div>
  );
};

export default DocumentDashboard;
