// src/components/DocumentView.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';

const DocumentView = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [areas, setAreas] = useState([]);
  const [tiposDocumentos, setTiposDocumentos] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [userAreas, setUserAreas] = useState([]); // Nueva estado para áreas del usuario

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Obtener el ID del usuario del token
        const token = localStorage.getItem('token');
        const { id: userId } = JSON.parse(atob(token.split('.')[1]));

        // Obtener las áreas asignadas al usuario
        const userAreasResponse = await api.get(`/usuarios-areas/${userId}/areas`);
        setUserAreas(userAreasResponse.data);

        // Obtener documentos
        const documentsResponse = await api.get('/documents?estado=Aprobado');
        const allDocuments = documentsResponse.data;

        // Filtrar documentos por áreas del usuario
        const userAreaIds = userAreasResponse.data.map(area => area.id);
        const filteredDocs = allDocuments.filter(doc => 
          userAreaIds.includes(doc.id_area)
        );

        setDocuments(filteredDocs);
        setFilteredDocuments(filteredDocs);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    const fetchAreas = async () => {
      try {
        const response = await api.get('/areas');
        setAreas(response.data);
      } catch (error) {
        console.error('Error al obtener áreas:', error);
      }
    };

    const fetchTiposDocumentos = async () => {
      try {
        const response = await api.get('/tipos_documentos');
        setTiposDocumentos(response.data);
      } catch (error) {
        console.error('Error al obtener tipos de documentos:', error);
      }
    };

    fetchUserData();
    fetchAreas();
    fetchTiposDocumentos();
  }, []);

  const handleDownload = async (filename) => {
    try {
      const response = await api.get(`/documents/download/${filename}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
      alert('El archivo no se pudo descargar.');
    }
  };

  const getAreaNombre = (id) => {
    const area = areas.find(area => area.id === id);
    return area ? area.nombre : 'Desconocido';
  };

  const getTipoDocumentoNombre = (id) => {
    const tipoDocumento = tiposDocumentos.find(tipo => tipo.id === id);
    return tipoDocumento ? tipoDocumento.nombre : 'Desconocido';
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTitle(value);
    const filtered = documents.filter(doc => 
      doc.titulo.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDocuments(filtered);
  };

  return (
    <div className="container mt-5">
      <h2>Consulta de Documentos Aprobados</h2>
      <div className="mb-3">
        <h5>Áreas asignadas:</h5>
        <ul className="list-inline">
          {userAreas.map(area => (
            <li key={area.id} className="list-inline-item badge bg-secondary me-2">
              {area.nombre}
            </li>
          ))}
        </ul>
      </div>
      <input 
        type="text" 
        className="form-control mb-3" 
        placeholder="Buscar por título..." 
        value={searchTitle} 
        onChange={handleSearchChange} 
      />
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Título</th>
            <th>Área</th>
            <th>Tipo de Documento</th>
            <th>Version</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredDocuments.map((doc) => (
            <tr key={doc.id}>
              <td>{doc.titulo}</td>
              <td>{getAreaNombre(doc.id_area)}</td>
              <td>{getTipoDocumentoNombre(doc.id_tipo_documento)}</td>
              <td>{doc.version}</td>
              <td>
                <button 
                  className="btn btn-primary btn-sm" 
                  onClick={() => handleDownload(doc.ruta_archivo.split('/').pop())}
                >
                  Descargar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentView;