// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import AlertService from '../services/alertService';
import '../css/Global.css';
import '../css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      AlertService.error('Error', 'Por favor complete todos los campos');
      return;
    }

    try {
      setLoading(true);
      AlertService.loading('Iniciando sesión...');
      
      const response = await api.post('/auth/login', {
        correo_electronico: email,
        contraseña: password,
      });

      // Guardar el token en localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.usuario));

      AlertService.close();
      AlertService.success('¡Bienvenido!', 'Inicio de sesión exitoso');
      
      // Redirigir al dashboard
      navigate('/dashboard');
    } catch (error) {
      AlertService.close();
      const errorMessage = error.response?.data?.message || 'Credenciales incorrectas';
      AlertService.error('Error de autenticación', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-overlay"></div>
      </div>
      
      <div className="login-container fade-in">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <div className="logo-icon">📋</div>
              <h1>Gestión Documental</h1>
            </div>
            <p className="login-subtitle">Accede a tu cuenta para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <span className="label-icon">📧</span>
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@empresa.com"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <span className="label-icon">🔒</span>
                Contraseña
              </label>
              <div className="password-input-container">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary login-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <span className="btn-icon">🚀</span>
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <div className="login-divider">
              <span>¿Necesitas ayuda?</span>
            </div>
            <div className="login-links">
              <Link to="/" className="login-link">
                ← Volver al inicio
              </Link>
              <a href="#" className="login-link" onClick={(e) => {
                e.preventDefault();
                AlertService.info('Contacto', 'Contacta al administrador del sistema para recuperar tu contraseña');
              }}>
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>
        </div>

        <div className="login-info">
          <div className="info-card">
            <div className="info-icon">🏢</div>
            <h3>Sistema Corporativo</h3>
            <p>Plataforma segura para la gestión integral de documentos empresariales</p>
          </div>
          
          <div className="info-card">
            <div className="info-icon">🔐</div>
            <h3>Acceso Seguro</h3>
            <p>Autenticación robusta con encriptación de datos y control de sesiones</p>
          </div>
          
          <div className="info-card">
            <div className="info-icon">📊</div>
            <h3>Control Total</h3>
            <p>Monitoreo completo de documentos con auditoría y trazabilidad</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
