// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DocumentForm from './components/DocumentForm';
import UserForm from './components/UserForm';
import UserDashboard from './components/UserDashboard'; // Importar el nuevo dashboard de usuarios
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        {/* Gestión de documentos */}
        <Route
          path="/documents/new"
          element={
            <PrivateRoute>
              <DocumentForm />
            </PrivateRoute>
          }
        />
        {/* Gestión de usuarios */}
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <UserDashboard /> {/* Mostrar el listado de usuarios */}
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
