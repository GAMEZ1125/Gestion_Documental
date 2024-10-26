import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Eliminar el token del almacenamiento local y redirigir al login
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/dashboard">
          Gestión Documental
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/areas">
                Áreas
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/users">
                Usuarios
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/tipos_documentos">
                Tipos de Documentos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/documents">
                Documentos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/auditorias">
                Registros
              </Link>
            </li>
          </ul>
          <button className="btn btn-outline-light" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
