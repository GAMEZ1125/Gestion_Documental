// src/components/DocumentView.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';

const DocumentView = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [areas, setAreas] = useState([]);
  const [tiposDocumentos, setTiposDocumentos] = useState([]);
  const [searchTitle, setSearchTitle] = useState(''); // Estado para el filtro del título

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get('/documents?estado=Aprobado');
        setDocuments(response.data);
        setFilteredDocuments(response.data); // Inicialmente mostrar todos los documentos
      } catch (error) {
        console.error('Error al obtener documentos aprobados:', error);
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

    fetchDocuments();
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

  // Función para filtrar documentos por título
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
