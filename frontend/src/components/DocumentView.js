import React, { useEffect, useState } from 'react';
import api from '../services/api'; // Asegúrate de que 'api' tenga la URL base del backend

const DocumentView = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get('/documents?status=aprobado&activo=true');
        setDocuments(response.data);
      } catch (error) {
        console.error('Error al obtener documentos:', error);
      }
    };
    fetchDocuments();
  }, []);

  const handleDownload = async (filename) => {
    try {
      // Solicitud al backend para descargar el archivo
      const response = await api.get(`/documents/download/${filename}`, {
        responseType: 'blob', // Asegurar que el archivo se reciba como blob
      });

      // Crear un enlace temporal para la descarga
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename); // Nombre del archivo a descargar
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
      alert('El archivo no se pudo descargar.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Consulta de Documentos Aprobados</h2>
      <ul className="list-group">
        {documents.map((doc) => (
          <li key={doc.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{doc.titulo}</span>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => handleDownload(doc.ruta_archivo.split('/').pop())} // Obtener solo el nombre del archivo
            >
              Descargar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentView;
