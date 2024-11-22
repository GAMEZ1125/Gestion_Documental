// src/components/EmailConfig.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const EmailConfig = () => {
  const [config, setConfig] = useState({
    host: '',
    port: '',
    secure: true,
    user: '',
    password: '',
    from: ''
  });
  const [testEmail, setTestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/email-config');
        setConfig(response.data);
      } catch (error) {
        console.error('Error fetching email config:', error);
        setError(error);
        setMessage({
          type: 'danger',
          text: `Error al cargar la configuración: ${error.response?.data?.message || error.message}`
        });
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/email-config', config);
      setMessage({
        type: 'success',
        text: 'Configuración guardada exitosamente'
      });
    } catch (error) {
      console.error('Error saving email config:', error);
      setError(error);
      setMessage({
        type: 'danger',
        text: `Error al guardar la configuración: ${error.response?.data?.message || error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail) return;
    
    setLoading(true);
    setError(null);
    try {
      await api.post('/email-config/test', { testEmail });
      setMessage({
        type: 'success',
        text: 'Correo de prueba enviado exitosamente'
      });
    } catch (error) {
      console.error('Error sending test email:', error);
      setError(error);
      setMessage({
        type: 'danger',
        text: `Error al enviar correo de prueba: ${error.response?.data?.message || error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !config.host) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info">
          Cargando configuración...
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Configuración de Correo Electrónico</h2>
      
      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
          {message.text}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setMessage({ type: '', text: '' })}
            aria-label="Close"
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Servidor SMTP</label>
              <input
                type="text"
                name="host"
                value={config.host}
                onChange={handleChange}
                className="form-control"
                required
                placeholder="ej: smtp.gmail.com"
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Puerto</label>
              <input
                type="number"
                name="port"
                value={config.port}
                onChange={handleChange}
                className="form-control"
                required
                placeholder="ej: 587"
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Conexión Segura</label>
              <div className="form-check mt-2">
                <input
                  type="checkbox"
                  name="secure"
                  checked={config.secure}
                  onChange={handleChange}
                  className="form-check-input"
                />
                <label className="form-check-label">Usar SSL/TLS</label>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Usuario</label>
              <input
                type="text"
                name="user"
                value={config.user}
                onChange={handleChange}
                className="form-control"
                required
                placeholder="usuario@ejemplo.com"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                name="password"
                value={config.password}
                onChange={handleChange}
                className="form-control"
                required
                placeholder="Contraseña del correo"
              />
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Correo Remitente</label>
          <input
            type="email"
            name="from"
            value={config.from}
            onChange={handleChange}
            className="form-control"
            required
            placeholder="noreply@tuempresa.com"
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Guardando...
            </>
          ) : 'Guardar Configuración'}
        </button>
      </form>

      <div className="card mt-4">
        <div className="card-header">
          Prueba de Configuración
        </div>
        <div className="card-body">
          <div className="input-group">
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="form-control"
              placeholder="Ingrese correo para prueba"
            />
            <button 
              className="btn btn-outline-primary" 
              onClick={handleTestEmail}
              disabled={loading || !testEmail}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Enviando...
                </>
              ) : 'Enviar Correo de Prueba'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailConfig;