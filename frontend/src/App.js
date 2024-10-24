// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DocumentForm from './components/DocumentForm';
import TipoDocumentoDashboard from './components/TipoDocumentoDashboard';
import TipoDocumentoForm from './components/TipoDocumentoForm';
import AreaForm from './components/AreaForm';
import UserForm from './components/UserForm';
import UserDashboard from './components/UserDashboard'; // Gestión de usuarios
import AreaDashboard from './components/AreaDashboard'; // Gestión de áreas
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard general */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Gestión de Documentos */}
        <Route
          path="/documents/new"
          element={
            <PrivateRoute>
              <DocumentForm />
            </PrivateRoute>
          }
        />

        {/* Gestión de Usuarios */}
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/users/new"
          element={
            <PrivateRoute>
              <UserForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/users/edit/:id"
          element={
            <PrivateRoute>
              <UserForm />
            </PrivateRoute>
          }
        />

        {/* Gestión de Áreas */}
        <Route
          path="/areas"
          element={
            <PrivateRoute>
              <AreaDashboard /> {/* Mostrar el listado de áreas */}
            </PrivateRoute>
          }
        />
        <Route
          path="/areas/new"
          element={
            <PrivateRoute>
              <AreaForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/areas/edit/:id"
          element={
            <PrivateRoute>
              <AreaForm />
            </PrivateRoute>
          }
        />
        {/* Gestión de Tipos de Documentos */}
        <Route
          path="/tipos_documentos"
          element={
            <PrivateRoute>
              <TipoDocumentoDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/tipos_documentos/new"
          element={
            <PrivateRoute>
              <TipoDocumentoForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/tipos_documentos/edit/:id"
          element={
            <PrivateRoute>
              <TipoDocumentoForm />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
