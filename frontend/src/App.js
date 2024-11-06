// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DocumentDashboard from './components/DocumentDashboard';
import DocumentEdit from './components/DocumentEdit';
import DocumentView from './components/DocumentView';
import DocumentWorkflow from './components/DocumentWorkflow';
import DocumentManagement from './components/DocumentManagement';
import DocumentForm from './components/DocumentForm';
import DocumentAudit from './components/DocumentAudit';
import UserDashboard from './components/UserDashboard';
import UserForm from './components/UserForm';
import AreaDashboard from './components/AreaDashboard';
import AreaForm from './components/AreaForm';
import TipoDocumentoDashboard from './components/TipoDocumentoDashboard';
import TipoDocumentoForm from './components/TipoDocumentoForm';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout'; // Importar el layout global
import UserAreasManagement from './components/UserAreasManagement';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas con layout global */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="areas" element={<AreaDashboard />} />
          <Route path="areas/new" element={<AreaForm />} />
          <Route path="areas/edit/:id" element={<AreaForm />} />
          <Route path="tipos_documentos" element={<TipoDocumentoDashboard />} />
          <Route path="tipos_documentos/new" element={<TipoDocumentoForm />} />
          <Route path="tipos_documentos/edit/:id" element={<TipoDocumentoForm />} />
          <Route path="users" element={<UserDashboard />} />
          <Route path="users/new" element={<UserForm />} />
          <Route path="users/edit/:id" element={<UserForm />} />
          <Route path="documents" element={<DocumentDashboard />} />
          <Route path="documents/new" element={<DocumentForm />} />
          <Route path="documents/view" element={<DocumentView />} />
          <Route path="documents/workflow" element={<DocumentWorkflow />} />
          <Route path="documents/edit/:id" element={<DocumentEdit />} />
          <Route path="documents/management" element={<DocumentManagement />} />
          <Route path="auditorias" element={<DocumentAudit />} />
          <Route path="/usuarios-areas/:userId/areas" element={<UserAreasManagement />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
