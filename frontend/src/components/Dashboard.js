import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import api from '../services/api';
import '../css/DashBoardMain.css'; // Importar el archivo CSS

// Registrar los elementos necesarios para los gráficos
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
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
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
      ],
    }],
  });

  return (
    <div className="containerMain">
      <div>
        <h2>Documentos</h2>
        {/* {(userRole === 'admin' || userRole === 'usuario') && (
          <Link to="/documents/new" className="btn btn-primary mb-3">
            Crear Documento
          </Link>
        )} */}

        {/* {userRole === 'admin' && (
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
        )} */}
      </div>


      <div className="card-container">
        <div className="card2">
          <h3>Documentos por Área</h3>
          <Pie data={createChartData(dataByArea, 'Documentos por Área')} />
        </div>

        <div className="card2">
          <h3>Documentos por Tipo</h3>
          <Pie data={createChartData(dataByType, 'Documentos por Tipo')} />
        </div>

        <div className="card2">
          <h3>Documentos por Estado</h3>
          <Pie data={createChartData(dataByState, 'Documentos por Estado')} />
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
