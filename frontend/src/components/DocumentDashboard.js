import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const DocumentDashboard = () => {
  return (
    <div className="container mt-5">
      <h2>Documentos</h2>
      <Link to="/documents/new" className="btn btn-primary mb-3">Crear Documento</Link>
      <Link to="/documents/view" className="btn btn-secondary mb-3">Consultar Documentos Aprobados</Link>
      <Link to="/documents/workflow" className="btn btn-info mb-3">Workflow de Documentos</Link>
      <Link to="/documents/management" className="btn btn-warning mb-3">Gestionar Documentos</Link>
    </div>
  );
};

export default DocumentDashboard;
