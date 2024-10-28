// src/components/UserForm.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';

const UserForm = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [rol, setRol] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams(); // Captura el ID si viene en la URL (para modo edición)

  // Si se recibe un ID, cargar datos del usuario al montar el componente
  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const response = await api.get(`/users/${id}`);
          const { nombre, apellido, correo_electronico, rol } = response.data;
          setNombre(nombre);
          setApellido(apellido);
          setCorreoElectronico(correo_electronico);
          setRol(rol);
          setIsEditMode(true); // Cambiar a modo edición
        } catch (error) {
          console.error('Error al cargar usuario:', error);
          alert('Error al cargar el usuario.');
        }
      };
      fetchUser();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { nombre, apellido, correo_electronico: correoElectronico, contraseña, rol };

    try {
      if (isEditMode) {
        // Actualizar usuario existente
        await api.put(`/users/${id}`, userData);
        alert('Usuario actualizado con éxito.');
      } else {
        // Crear nuevo usuario
        await api.post('/users', userData);
        alert('Usuario creado con éxito.');
      }
      navigate('/users'); // Redirigir a users
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      alert('Error al guardar el usuario.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>{isEditMode ? 'Editar Usuario' : 'Crear Usuario'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nombre</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Apellido</label>
          <input
            type="text"
            className="form-control"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Correo Electrónico</label>
          <input
            type="email"
            className="form-control"
            value={correoElectronico}
            onChange={(e) => setCorreoElectronico(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required={!isEditMode} // No obligar a cambiar contraseña en edición
          />
        </div>

        <div className="mb-3">
          <label>Rol</label>
          <select
            className="form-control"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            required
          >
            <option value="">Seleccione un rol</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="usuario">Usuario</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          {isEditMode ? 'Actualizar Usuario' : 'Crear Usuario'}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
