// src/components/UserForm.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import AlertService from '../services/alertService';
import '../css/Global.css';
import '../css/UserForm.css';

const UserForm = ({ user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo_electronico: '',
    contraseña: '',
    rol: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const isEditMode = !!user;

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        correo_electronico: user.correo_electronico || '',
        contraseña: '',
        rol: user.rol || ''
      });
    } else {
      setFormData({
        nombre: '',
        apellido: '',
        correo_electronico: '',
        contraseña: '',
        rol: ''
      });
    }
    setErrors({});
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario comience a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar apellido
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    } else if (formData.apellido.trim().length < 2) {
      newErrors.apellido = 'El apellido debe tener al menos 2 caracteres';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correo_electronico.trim()) {
      newErrors.correo_electronico = 'El correo electrónico es requerido';
    } else if (!emailRegex.test(formData.correo_electronico)) {
      newErrors.correo_electronico = 'El correo electrónico no es válido';
    }

    // Validar contraseña
    if (!isEditMode && !formData.contraseña) {
      newErrors.contraseña = 'La contraseña es requerida';
    } else if (formData.contraseña && formData.contraseña.length < 6) {
      newErrors.contraseña = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar rol
    if (!formData.rol) {
      newErrors.rol = 'El rol es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const userData = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        correo_electronico: formData.correo_electronico.trim(),
        rol: formData.rol
      };

      // Solo incluir contraseña si se proporciona
      if (formData.contraseña) {
        userData.contraseña = formData.contraseña;
      }

      if (isEditMode) {
        await api.put(`/users/${user.id}`, userData);
        AlertService.success('¡Actualizado!', 'Usuario actualizado exitosamente');
      } else {
        await api.post('/users', userData);
        AlertService.success('¡Creado!', 'Usuario creado exitosamente');
      }

      onSave();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      
      if (error.response?.data?.message) {
        AlertService.error('Error', error.response.data.message);
      } else if (error.response?.status === 409) {
        AlertService.error('Error', 'Ya existe un usuario con este correo electrónico');
      } else {
        AlertService.error('Error', `No se pudo ${isEditMode ? 'actualizar' : 'crear'} el usuario`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-title-section">
            <div className="modal-icon">
              {isEditMode ? '✏️' : '👤'}
            </div>
            <div>
              <h2 className="modal-title">
                {isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
              </h2>
              <p className="modal-subtitle">
                {isEditMode 
                  ? 'Modifica la información del usuario'
                  : 'Completa los datos para crear un nuevo usuario'
                }
              </p>
            </div>
          </div>
          
          <button 
            className="modal-close-btn"
            onClick={handleClose}
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nombre" className="form-label">
                <span className="label-icon">👤</span>
                Nombre *
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                className={`form-control ${errors.nombre ? 'error' : ''}`}
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ingresa el nombre"
                disabled={loading}
              />
              {errors.nombre && (
                <span className="error-message">{errors.nombre}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="apellido" className="form-label">
                <span className="label-icon">👤</span>
                Apellido *
              </label>
              <input
                id="apellido"
                name="apellido"
                type="text"
                className={`form-control ${errors.apellido ? 'error' : ''}`}
                value={formData.apellido}
                onChange={handleInputChange}
                placeholder="Ingresa el apellido"
                disabled={loading}
              />
              {errors.apellido && (
                <span className="error-message">{errors.apellido}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="correo_electronico" className="form-label">
              <span className="label-icon">📧</span>
              Correo Electrónico *
            </label>
            <input
              id="correo_electronico"
              name="correo_electronico"
              type="email"
              className={`form-control ${errors.correo_electronico ? 'error' : ''}`}
              value={formData.correo_electronico}
              onChange={handleInputChange}
              placeholder="usuario@empresa.com"
              disabled={loading}
            />
            {errors.correo_electronico && (
              <span className="error-message">{errors.correo_electronico}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="contraseña" className="form-label">
              <span className="label-icon">🔒</span>
              Contraseña {!isEditMode && '*'}
              {isEditMode && (
                <span className="label-hint">(Dejar vacío para mantener actual)</span>
              )}
            </label>
            <div className="password-input-container">
              <input
                id="contraseña"
                name="contraseña"
                type={showPassword ? 'text' : 'password'}
                className={`form-control ${errors.contraseña ? 'error' : ''}`}
                value={formData.contraseña}
                onChange={handleInputChange}
                placeholder={isEditMode ? 'Nueva contraseña (opcional)' : 'Ingresa una contraseña'}
                disabled={loading}
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
            {errors.contraseña && (
              <span className="error-message">{errors.contraseña}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="rol" className="form-label">
              <span className="label-icon">🎭</span>
              Rol *
            </label>
            <select
              id="rol"
              name="rol"
              className={`form-control ${errors.rol ? 'error' : ''}`}
              value={formData.rol}
              onChange={handleInputChange}
              disabled={loading}
            >
              <option value="">Selecciona un rol</option>
              <option value="admin">👑 Administrador</option>
              <option value="editor">✏️ Editor</option>
              <option value="usuario">👤 Usuario</option>
            </select>
            {errors.rol && (
              <span className="error-message">{errors.rol}</span>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleClose}
              disabled={loading}
            >
              <span className="btn-icon">❌</span>
              Cancelar
            </button>
            
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  {isEditMode ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                <>
                  <span className="btn-icon">
                    {isEditMode ? '💾' : '➕'}
                  </span>
                  {isEditMode ? 'Actualizar Usuario' : 'Crear Usuario'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
