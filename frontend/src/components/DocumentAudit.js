import React, { useState, useEffect } from 'react';
import api from '../services/api';

const DocumentAudit = () => {
  const [audits, setAudits] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [documentos, setDocumentos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // Cargar todos los registros de auditoría desde la API
  useEffect(() => {
    const fetchAudits = async () => {
      try {
        const response = await api.get('/auditorias');
        setAudits(response.data);
      } catch (error) {
        console.error('Error al cargar auditorías:', error);
        setError('No se pudieron cargar las auditorías. Intente de nuevo más tarde.');
      }
    };
    const fetchDocumentos = async () => {
      try {
        const response = await api.get('/documents');
        setDocumentos(response.data);
      } catch (error) {
        console.error('Error al obtener documentos:', error);
      }
    };
    const fetchUsuarios = async () => {
      try {
        const response = await api.get('/users');
        setUsuarios(response.data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };
    fetchAudits();
    fetchDocumentos();
    fetchUsuarios();
  }, []);

  // Funciones para obtener nombres de usuario y documento
  const getDocumentoNombre = (id) => {
    const documento = documentos.find(doc => doc.id === id);
    return documento ? documento.titulo : 'Desconocido';
  };

  const getusuarioNombre = (id) => {
    const usuario = usuarios.find(user => user.id === id);
    return usuario ? usuario.nombre : 'Desconocido';
  };

  // Filtrar registros en base a la acción ingresada y otras columnas
  const filteredAudits = audits.filter((audit) => {
    const usuarioNombre = getusuarioNombre(audit.id_usuario).toLowerCase();
    const documentoTitulo = getDocumentoNombre(audit.id_documento).toLowerCase();
    
    return (
      audit.accion.toLowerCase().includes(filter.toLowerCase()) ||
      usuarioNombre.includes(filter.toLowerCase()) ||
      documentoTitulo.includes(filter.toLowerCase()) ||
      audit.observaciones.toLowerCase().includes(filter.toLowerCase()) ||
      new Date(audit.fecha).toLocaleString().includes(filter) // Puedes modificar el formato según tus necesidades
    );
  });

  // Funciones para exportar los reportes
  const exportToPDF = () => {
    const params = new URLSearchParams({ accion: filter }).toString();
    window.location.href = `http://localhost:3000/api/auditorias/exportar/pdf?${params}`;
  };
  
  const exportToExcel = () => {
    const params = new URLSearchParams({ accion: filter }).toString();
    window.location.href = `http://localhost:3000/api/auditorias/exportar/excel?${params}`;
  };

  return (
    <div className="container mt-5">
      <h2>Auditoría de Documentos</h2>

      {error && <p className="text-danger">{error}</p>}

      {/* Campo de filtro */}
      <input
        type="text"
        placeholder="Filtrar por acción, usuario, documento, observaciones..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="form-control mb-3"
      />

      {/* Botones de exportación */}
      <div className="mb-3">
        <button onClick={exportToPDF} className="btn btn-primary me-2">
          Descargar PDF
        </button>
        <button onClick={exportToExcel} className="btn btn-success">
          Descargar Excel
        </button>
      </div>

      {/* Listado de auditorías */}
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Acción</th>
            <th>Usuario</th>
            <th>Documento</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredAudits.map((audit) => (
            <tr key={audit.id}>
              <td>{audit.id}</td>
              <td>{new Date(audit.fecha).toLocaleString()}</td>
              <td>{audit.accion}</td>
              <td>{getusuarioNombre(audit.id_usuario)}</td>
              <td>{getDocumentoNombre(audit.id_documento)}</td>
              <td>{audit.observaciones}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentAudit;
