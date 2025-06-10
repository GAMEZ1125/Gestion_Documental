// src/components/Navbar.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AlertService from '../services/alertService';
import '../css/Global.css';
import '../css/Navbar.css';

const Navbar = () => {
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const { rol, nombre } = payload;
      
      setUserRole(rol || '');
      setUserName(nombre || 'Usuario');
      setLoading(false);
    } catch (error) {
      console.error('Error parsing token:', error);
      AlertService.error('Error', 'Token inválido');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  }, [navigate]);

  // Cerrar menú de usuario cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    const result = await AlertService.confirm(
      '¿Cerrar Sesión?',
      '¿Estás seguro de que quieres cerrar sesión?'
    );

    if (result.isConfirmed) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      AlertService.success('¡Hasta pronto!', 'Sesión cerrada exitosamente');
      navigate('/login');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const closeUserMenu = () => {
    setIsUserMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: '📊',
      roles: ['admin', 'editor', 'usuario']
    },
    {
      path: '/documents',
      label: 'Documentos',
      icon: '📄',
      roles: ['admin', 'editor', 'usuario']
    },
    {
      path: '/areas',
      label: 'Áreas',
      icon: '🏢',
      roles: ['admin']
    },
    {
      path: '/users',
      label: 'Usuarios',
      icon: '👥',
      roles: ['admin']
    },
    {
      path: '/tipos_documentos',
      label: 'Tipos de Documentos',
      icon: '📋',
      roles: ['admin']
    },
    {
      path: '/auditorias',
      label: 'Auditorías',
      icon: '📝',
      roles: ['admin', 'editor']
    },
    {
      path: '/email-config',
      label: 'Configuración Email',
      icon: '⚙️',
      roles: ['admin']
    }
  ];

  const visibleMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  const getUserInitial = () => {
    return userName && userName.length > 0 ? userName.charAt(0).toUpperCase() : 'U';
  };

  const getUserRoleDisplay = () => {
    switch(userRole) {
      case 'admin':
        return 'Administrador';
      case 'editor':
        return 'Editor';
      case 'usuario':
        return 'Usuario';
      default:
        return 'Usuario';
    }
  };

  const userMenuItems = [
    {
      icon: '👤',
      label: 'Mi Perfil',
      action: () => {
        closeUserMenu();
        navigate('/profile');
      }
    },
    {
      icon: '⚙️',
      label: 'Configuración',
      action: () => {
        closeUserMenu();
        navigate('/settings');
      }
    },
    {
      icon: '📊',
      label: 'Mi Actividad',
      action: () => {
        closeUserMenu();
        navigate('/my-activity');
      }
    },
    {
      icon: '🌙',
      label: 'Modo Oscuro',
      action: () => {
        closeUserMenu();
        // Aquí puedes implementar el toggle de tema oscuro
        AlertService.info('Próximamente', 'La función de modo oscuro estará disponible pronto');
      }
    }
  ];

  // Mostrar loading spinner mientras se carga la información del usuario
  if (loading) {
    return (
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <Link to="/dashboard" className="brand-link">
              <div className="brand-icon">📋</div>
              <span className="brand-text">Gestión Documental</span>
            </Link>
          </div>
          <div className="navbar-loading">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/dashboard" className="brand-link" onClick={closeMenu}>
            <div className="brand-icon">📋</div>
            <span className="brand-text">Gestión Documental</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-nav">
          <ul className="nav-items">
            {visibleMenuItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${isActivePath(item.path) ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* User Menu Desktop */}
        <div className="navbar-user" ref={userMenuRef}>
          <button 
            className={`user-menu-trigger ${isUserMenuOpen ? 'active' : ''}`}
            onClick={toggleUserMenu}
            aria-label="User menu"
          >
            <div className="user-avatar">
              {getUserInitial()}
            </div>
            <div className="user-details">
              <span className="user-name">{userName || 'Usuario'}</span>
              <span className="user-role">{getUserRoleDisplay()}</span>
            </div>
            <div className="dropdown-arrow">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>

          <div className={`user-dropdown ${isUserMenuOpen ? 'active' : ''}`}>
            <div className="dropdown-header">
              <div className="dropdown-avatar">
                {getUserInitial()}
              </div>
              <div className="dropdown-user-info">
                <span className="dropdown-name">{userName}</span>
                <span className="dropdown-role">{getUserRoleDisplay()}</span>
              </div>
            </div>
            
            <div className="dropdown-divider"></div>
            
            <ul className="dropdown-menu">
              {userMenuItems.map((item, index) => (
                <li key={index} className="dropdown-item">
                  <button className="dropdown-link" onClick={item.action}>
                    <span className="dropdown-icon">{item.icon}</span>
                    <span className="dropdown-label">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
            
            <div className="dropdown-divider"></div>
            
            <div className="dropdown-footer">
              <button className="logout-btn" onClick={handleLogout}>
                <span className="logout-icon">🚪</span>
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="mobile-header">
            <div className="mobile-user-info">
              <div className="mobile-user-avatar">
                {getUserInitial()}
              </div>
              <div className="mobile-user-details">
                <span className="mobile-user-name">{userName || 'Usuario'}</span>
                <span className="mobile-user-role">{getUserRoleDisplay()}</span>
              </div>
            </div>
          </div>

          <ul className="mobile-items">
            {visibleMenuItems.map((item) => (
              <li key={item.path} className="mobile-item">
                <Link
                  to={item.path}
                  className={`mobile-link ${isActivePath(item.path) ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  <span className="mobile-icon">{item.icon}</span>
                  <span className="mobile-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mobile-divider"></div>

          <ul className="mobile-user-menu">
            {userMenuItems.map((item, index) => (
              <li key={index} className="mobile-item">
                <button className="mobile-link" onClick={item.action}>
                  <span className="mobile-icon">{item.icon}</span>
                  <span className="mobile-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mobile-footer">
            <button className="mobile-logout-btn" onClick={handleLogout}>
              <span className="logout-icon">🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {isMenuOpen && <div className="navbar-overlay" onClick={closeMenu}></div>}
      </div>
    </nav>
  );
};

export default Navbar;
