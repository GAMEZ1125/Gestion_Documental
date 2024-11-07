// src/components/DocumentManagement.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const DocumentManagement = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [areas, setAreas] = useState([]); // Estado para almacenar áreas
  const [tiposDocumentos, setTiposDocumentos] = useState([]); // Estado para almacenar tipos de documentos
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el filtro
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get('/documents'); // Todos los documentos
        setDocuments(response.data);
        setFilteredDocuments(response.data); // Inicialmente mostrar todos los documentos
      } catch (error) {
        console.error('Error al obtener documentos:', error);
      }
    };

    const fetchAreas = async () => {
      try {
        const response = await api.get('/areas'); // Asegúrate de tener esta ruta en tu API
        setAreas(response.data);
      } catch (error) {
        console.error('Error al obtener áreas:', error);
      }
    };

    const fetchTiposDocumentos = async () => {
      try {
        const response = await api.get('/tipos_documentos'); // Asegúrate de tener esta ruta en tu API
        setTiposDocumentos(response.data);
      } catch (error) {
        console.error('Error al obtener tipos de documentos:', error);
      }
    };

    fetchDocuments();
    fetchAreas();
    fetchTiposDocumentos();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/documents/${id}`);
      alert('Documento eliminado con éxito.');
      setDocuments(documents.filter((doc) => doc.id !== id));
      setFilteredDocuments(filteredDocuments.filter((doc) => doc.id !== id)); // Actualiza la lista filtrada
    } catch (error) {
      console.error('Error al eliminar documento:', error);
      alert('No se pudo eliminar el documento.');
    }
  };

  const handleEdit = (id) => {
    navigate(`/documents/edit/${id}`);
  };

  // Función para obtener el nombre del área por su ID
  const getAreaNombre = (id) => {
    const area = areas.find(area => area.id === id);
    return area ? area.nombre : 'Desconocido';
  };

  // Función para obtener el nombre del tipo de documento por su ID
  const getTipoDocumentoNombre = (id) => {
    const tipoDocumento = tiposDocumentos.find(tipo => tipo.id === id);
    return tipoDocumento ? tipoDocumento.nombre : 'Desconocido';
  };

  // Función para filtrar documentos
  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    const filtered = documents.filter(doc => 
      doc.titulo.toLowerCase().includes(value.toLowerCase()) ||
      getAreaNombre(doc.id_area).toLowerCase().includes(value.toLowerCase()) ||
      getTipoDocumentoNombre(doc.id_tipo_documento).toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDocuments(filtered);
  };

  return (
    <div className="container mt-5">
      <h2>Gestión de Documentos</h2>
      <input 
        type="text" 
        className="form-control mb-3" 
        placeholder="Buscar por título, área o tipo de documento..." 
        value={searchTerm} 
        onChange={handleSearchChange} 
      />
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Título</th>
            <th>Área</th>
            <th>Tipo de Documento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredDocuments.map((doc) => (
            <tr key={doc.id}>
              <td>{doc.titulo}</td>
              <td>{getAreaNombre(doc.id_area)}</td>
              <td>{getTipoDocumentoNombre(doc.id_tipo_documento)}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(doc.id)}>
                  Editar
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(doc.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentManagement;
