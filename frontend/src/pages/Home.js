// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Global.css';
import '../css/Home.css';

const Home = () => {
  const features = [
    {
      icon: '📄',
      title: 'Gestión de Documentos',
      description: 'Organiza, almacena y gestiona todos tus documentos de forma centralizada y segura.'
    },
    {
      icon: '🔐',
      title: 'Seguridad Avanzada',
      description: 'Control de acceso por roles, encriptación de datos y auditoría completa de actividades.'
    },
    {
      icon: '📊',
      title: 'Análisis y Reportes',
      description: 'Visualiza estadísticas detalladas y genera reportes personalizados de tu gestión documental.'
    },
    {
      icon: '👥',
      title: 'Colaboración en Equipo',
      description: 'Facilita el trabajo colaborativo con permisos granulares y flujos de trabajo eficientes.'
    },
    {
      icon: '🔍',
      title: 'Búsqueda Inteligente',
      description: 'Encuentra cualquier documento rápidamente con nuestro sistema de búsqueda avanzada.'
    },
    {
      icon: '📱',
      title: 'Acceso Multiplataforma',
      description: 'Accede a tus documentos desde cualquier dispositivo, en cualquier momento y lugar.'
    }
  ];

  const stats = [
    { number: '99.9%', label: 'Tiempo de actividad' },
    { number: '50TB', label: 'Capacidad de almacenamiento' },
    { number: '256-bit', label: 'Encriptación SSL' },
    { number: '24/7', label: 'Soporte técnico' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content fade-in">
          <div className="hero-text">
            <h1 className="hero-title">
              Sistema de <span className="highlight">Gestión Documental</span>
            </h1>
            <p className="hero-subtitle">
              Transforma la manera en que tu empresa gestiona, organiza y accede a la información. 
              Una solución integral para el control total de tus documentos corporativos.
            </p>
            <div className="hero-actions">
              <Link to="/login" className="btn-primary hero-btn">
                <span className="btn-icon">🚀</span>
                Iniciar Sesión
              </Link>
              <a href="#features" className="btn-secondary hero-btn">
                <span className="btn-icon">📋</span>
                Conocer Más
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="card-header">
                <div className="card-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="card-title">Panel de Control</span>
              </div>
              <div className="card-content">
                <div className="dashboard-preview">
                  <div className="chart-placeholder"></div>
                  <div className="stats-preview">
                    <div className="stat-item">
                      <div className="stat-number">1,234</div>
                      <div className="stat-label">Documentos</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">98%</div>
                      <div className="stat-label">Eficiencia</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">¿Por qué elegir nuestro sistema?</h2>
            <p className="section-subtitle">
              Descubre las características que hacen de nuestra plataforma la mejor opción 
              para la gestión documental empresarial.
            </p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-background">
          <div className="cta-overlay"></div>
        </div>
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">¿Listo para comenzar?</h2>
            <p className="cta-subtitle">
              Únete a miles de empresas que ya confían en nuestro sistema 
              para gestionar sus documentos de manera eficiente y segura.
            </p>
            <div className="cta-actions">
              <Link to="/login" className="btn-primary cta-btn">
                <span className="btn-icon">🎯</span>
                Acceder al Sistema
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="logo-icon">📋</div>
                <span className="logo-text">Gestión Documental</span>
              </div>
              <p className="footer-description">
                Solución integral para la gestión documental empresarial con 
                tecnología de vanguardia y máxima seguridad.
              </p>
            </div>
            
            <div className="footer-links">
              <div className="footer-section">
                <h4>Producto</h4>
                <ul>
                  <li><a href="#features">Características</a></li>
                  <li><a href="#security">Seguridad</a></li>
                  <li><a href="#integrations">Integraciones</a></li>
                </ul>
              </div>
              
              <div className="footer-section">
                <h4>Soporte</h4>
                <ul>
                  <li><a href="#help">Centro de Ayuda</a></li>
                  <li><a href="#contact">Contacto</a></li>
                  <li><a href="#documentation">Documentación</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 Sistema de Gestión Documental. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
