// src/components/UserDashboard.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Cargar lista de usuarios al montar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };
    fetchUsers();
  }, []);

  // Eliminar un usuario
  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((user) => user.id !== id)); // Actualiza la lista después de eliminar
      alert('Usuario eliminado con éxito.');
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('Error al eliminar el usuario.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Gestión de Usuarios</h2>
      <Link to="/users/new" className="btn btn-primary mb-3">
        Crear Usuario
      </Link>
      <ul className="list-group">
        {users.map((user) => (
          <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{user.nombre}</span>
            <span>{user.correo_electronico}</span>
            <span>{user.rol}</span>
            <div>
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => navigate(`/users/edit/${user.id}`)}
              >
                Editar
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(user.id)}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserDashboard;
