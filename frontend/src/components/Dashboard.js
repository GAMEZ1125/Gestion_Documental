// src/componets/DashBoard.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import api from '../services/api';
import AlertService from '../services/alertService';
import '../css/Global.css';
import '../css/Dashboard.css';

// Registrar los elementos necesarios para los gráficos
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const { rol, nombre } = JSON.parse(atob(token.split('.')[1]));
      setUserRole(rol);
      setUserName(nombre);
    } catch (error) {
      AlertService.error('Error', 'Token inválido');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await api.get('/documents');
        setDocuments(response.data);
      } catch (error) {
        AlertService.error('Error', 'No se pudieron cargar los documentos');
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Función para contar documentos por clave
  const countByKey = (key) => {
    return documents.reduce((acc, doc) => {
      acc[doc[key]] = (acc[doc[key]] || 0) + 1;
      return acc;
    }, {});
  };

  // Preparar datos para los gráficos
  const dataByArea = countByKey('id_area');
  const dataByType = countByKey('id_tipo_documento');
  const dataByState = countByKey('estado');

  // Crear datos para el gráfico circular
  const createChartData = (data, label) => ({
    labels: Object.keys(data),
    datasets: [{
      label: label,
      data: Object.values(data),
      backgroundColor: [
        'rgba(37, 99, 235, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(5, 150, 105, 0.8)',
        'rgba(220, 38, 38, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)',
      ],
      borderColor: [
        'rgba(37, 99, 235, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(5, 150, 105, 1)',
        'rgba(220, 38, 38, 1)',
        'rgba(139, 92, 246, 1)',
        'rgba(236, 72, 153, 1)',
      ],
      borderWidth: 2,
    }],
  });

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>¡Bienvenido, {userName}!</h1>
          <p className="welcome-subtitle">Panel de Control - Gestión Documental</p>
        </div>
        
        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-icon">📄</div>
            <div className="stat-info">
              <h3>{documents.length}</h3>
              <p>Total Documentos</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>{Object.keys(dataByArea).length}</h3>
              <p>Áreas Activas</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <h3>{Object.keys(dataByType).length}</h3>
              <p>Tipos de Documento</p>
            </div>
          </div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Documentos por Área</h3>
            <span className="chart-subtitle">Distribución por departamento</span>
          </div>
          <div className="chart-content">
            <Pie data={createChartData(dataByArea, 'Documentos por Área')} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Documentos por Tipo</h3>
            <span className="chart-subtitle">Categorización de documentos</span>
          </div>
          <div className="chart-content">
            <Pie data={createChartData(dataByType, 'Documentos por Tipo')} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Documentos por Estado</h3>
            <span className="chart-subtitle">Estado actual de documentos</span>
          </div>
          <div className="chart-content">
            <Bar data={createChartData(dataByState, 'Documentos por Estado')} />
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Acciones Rápidas</h3>
        <div className="actions-grid">
          {(userRole === 'admin' || userRole === 'usuario') && (
            <Link to="/documents/new" className="action-card">
              <div className="action-icon">➕</div>
              <div className="action-content">
                <h4>Nuevo Documento</h4>
                <p>Crear un nuevo documento</p>
              </div>
            </Link>
          )}
          
          <Link to="/documents" className="action-card">
            <div className="action-icon">📂</div>
            <div className="action-content">
              <h4>Ver Documentos</h4>
              <p>Explorar todos los documentos</p>
            </div>
          </Link>

          {userRole === 'admin' && (
            <>
              <Link to="/users" className="action-card">
                <div className="action-icon">👥</div>
                <div className="action-content">
                  <h4>Gestionar Usuarios</h4>
                  <p>Administrar usuarios del sistema</p>
                </div>
              </Link>
              <Link to="/areas" className="action-card">
                <div className="action-icon">🏢</div>
                <div className="action-content">
                  <h4>Gestionar Áreas</h4>
                  <p>Configurar áreas de trabajo</p>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
