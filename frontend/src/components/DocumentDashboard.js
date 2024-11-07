// src/components/DocumentDashboard.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/DocumentDashboard.css';
import crearDocumentoImg from '../assets/images/create-image.webp';
import buscarDocumentoImg from '../assets/images/view-image.webp';
import workflowDocumentoImg from '../assets/images/workflow-image.webp';
import manageDocumentoImg from '../assets/images/manage-image.webp';

const DocumentDashboard = () => {
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const { rol } = JSON.parse(atob(token.split('.')[1]));
    setUserRole(rol);
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <h2>Documentos</h2>

      <div className="card-container">
        {(userRole === 'admin' || userRole === 'usuario' || userRole === 'editor') && (
          <Link to="/documents/new" className="card">
            <div className="card-content">
              <img src={crearDocumentoImg} alt="Crear Documento" className="document-image" />
              <p>Crear Documento</p>
            </div>
          </Link>
        )}

        <Link to="/documents/view" className="card">
          <div className="card-content">
            <img src={buscarDocumentoImg} alt="Consultar Documentos" />
            <p>Consultar Documentos Aprobados</p>
          </div>
        </Link>

        {userRole !== 'usuario' && (
          <>
            <Link to="/documents/workflow" className="card">
              <div className="card-content">
                <img src={workflowDocumentoImg} alt="Workflow de Documentos" />
                <p>Workflow de Documentos</p>
              </div>
            </Link>

            <Link to="/documents/management" className="card">
              <div className="card-content">
                <img src={manageDocumentoImg} alt="Gestionar Documentos" />
                <p>Gestionar Documentos</p>
              </div>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentDashboard;
