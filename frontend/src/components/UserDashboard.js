// src/componets/UserDashBoard.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el filtro
  const navigate = useNavigate();

  // Cargar lista de usuarios al montar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
        setFilteredUsers(response.data); // Inicialmente mostrar todos los usuarios
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
      setFilteredUsers(filteredUsers.filter((user) => user.id !== id)); // Actualiza la lista filtrada
      alert('Usuario eliminado con éxito.');
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('Error al eliminar el usuario.');
    }
  };

  // Función para filtrar usuarios
  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    const filtered = users.filter(user =>
      user.nombre.toLowerCase().includes(value.toLowerCase()) ||
      user.correo_electronico.toLowerCase().includes(value.toLowerCase()) ||
      user.rol.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  return (
    <div className="container mt-5">
      <h2>Gestión de Usuarios</h2>
      <Link to="/users/new" className="btn btn-primary mb-3">
        Crear Usuario
      </Link>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Buscar por nombre, correo o rol..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo Electrónico</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.nombre}</td>
              <td>{user.correo_electronico}</td>
              <td>{user.rol}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => navigate(`/users/edit/${user.id}`)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm me-2"
                  onClick={() => handleDelete(user.id)}
                >
                  Eliminar
                </button>
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => navigate(`/usuarios-areas/${user.id}/areas`)} // Asegúrate de que esta ruta esté configurada
                >
                  Gestionar Áreas
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserDashboard;
