// src/componets/UserDashBoard.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import AlertService from '../services/alertService';
import UserForm from './UserForm';
import UserAreasManagement from './UserAreasManagement';
import '../css/Global.css';
import '../css/UserDashboard.css';

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isAreasModalOpen, setIsAreasModalOpen] = useState(false);
  const [selectedUserForAreas, setSelectedUserForAreas] = useState(null);

  // Cargar lista de usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      AlertService.error('Error', 'No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  // Función para filtrar usuarios
  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    
    if (value.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.nombre?.toLowerCase().includes(value.toLowerCase()) ||
        user.apellido?.toLowerCase().includes(value.toLowerCase()) ||
        user.correo_electronico?.toLowerCase().includes(value.toLowerCase()) ||
        user.rol?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  // Abrir modal para crear usuario
  const openCreateModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar usuario
  const openEditModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  // Callback cuando se guarda un usuario
  const handleUserSaved = () => {
    closeModal();
    fetchUsers();
  };

  // Eliminar un usuario
  const handleDelete = async (user) => {
    const result = await AlertService.confirm(
      '¿Eliminar Usuario?',
      `¿Estás seguro de que quieres eliminar al usuario "${user.nombre} ${user.apellido}"? Esta acción no se puede deshacer.`
    );

    if (result.isConfirmed) {
      try {
        await api.delete(`/users/${user.id}`);
        setUsers(users.filter((u) => u.id !== user.id));
        setFilteredUsers(filteredUsers.filter((u) => u.id !== user.id));
        AlertService.success('¡Eliminado!', 'Usuario eliminado exitosamente');
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        AlertService.error('Error', 'No se pudo eliminar el usuario');
      }
    }
  };

  // Gestionar áreas del usuario
  const handleManageAreas = (user) => {
    console.log('Opening areas modal for user:', user); // Debug
    setSelectedUserForAreas(user);
    setIsAreasModalOpen(true);
  };

  // Cerrar modal de áreas
  const closeAreasModal = () => {
    setIsAreasModalOpen(false);
    setSelectedUserForAreas(null);
  };

  // Seleccionar/deseleccionar usuario
  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Seleccionar todos los usuarios
  const toggleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length 
        ? [] 
        : filteredUsers.map(user => user.id)
    );
  };

  // Eliminar usuarios seleccionados
  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) {
      AlertService.info('Información', 'No hay usuarios seleccionados');
      return;
    }

    const result = await AlertService.confirm(
      '¿Eliminar Usuarios Seleccionados?',
      `¿Estás seguro de que quieres eliminar ${selectedUsers.length} usuario(s)? Esta acción no se puede deshacer.`
    );

    if (result.isConfirmed) {
      try {
        AlertService.loading('Eliminando usuarios...');
        
        // Eliminar usuarios en paralelo
        await Promise.all(
          selectedUsers.map(userId => api.delete(`/users/${userId}`))
        );

        // Actualizar estado
        setUsers(users.filter(user => !selectedUsers.includes(user.id)));
        setFilteredUsers(filteredUsers.filter(user => !selectedUsers.includes(user.id)));
        setSelectedUsers([]);
        
        AlertService.close();
        AlertService.success('¡Eliminados!', `${selectedUsers.length} usuario(s) eliminado(s) exitosamente`);
      } catch (error) {
        AlertService.close();
        console.error('Error al eliminar usuarios:', error);
        AlertService.error('Error', 'No se pudieron eliminar algunos usuarios');
      }
    }
  };

  const getRoleDisplay = (role) => {
    const roles = {
      admin: { label: 'Administrador', color: 'admin' },
      editor: { label: 'Editor', color: 'editor' },
      usuario: { label: 'Usuario', color: 'user' }
    };
    return roles[role] || { label: role, color: 'default' };
  };

  const getStatusColor = (user) => {
    // Aquí puedes agregar lógica para determinar el estado del usuario
    return 'active'; // Por defecto activo
  };

  if (loading) {
    return (
      <div className="users-loading">
        <div className="loading-spinner"></div>
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="users-dashboard fade-in">
      <div className="users-header">
        <div className="header-content">
          <div className="header-info">
            <h1 className="page-title">Gestión de Usuarios</h1>
            <p className="page-subtitle">
              Administra los usuarios del sistema y sus permisos
            </p>
          </div>
          
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{users.length}</span>
              <span className="stat-label">Total Usuarios</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {users.filter(u => u.rol === 'admin').length}
              </span>
              <span className="stat-label">Administradores</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {users.filter(u => getStatusColor(u) === 'active').length}
              </span>
              <span className="stat-label">Activos</span>
            </div>
          </div>
        </div>
      </div>

      <div className="users-controls">
        <div className="controls-left">
          <div className="search-container">
            <div className="search-icon">🔍</div>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por nombre, email o rol..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button 
                className="search-clear"
                onClick={() => {
                  setSearchTerm('');
                  setFilteredUsers(users);
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="controls-right">
          {selectedUsers.length > 0 && (
            <button 
              className="btn-danger bulk-delete-btn"
              onClick={handleBulkDelete}
            >
              <span className="btn-icon">🗑️</span>
              Eliminar ({selectedUsers.length})
            </button>
          )}
          <button 
            className="btn-primary create-btn"
            onClick={openCreateModal}
          >
            <span className="btn-icon">➕</span>
            Nuevo Usuario
          </button>
        </div>
      </div>

      <div className="users-table-container">
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th className="checkbox-column">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={toggleSelectAll}
                    />
                    <span className="checkmark"></span>
                  </label>
                </th>
                <th>Usuario</th>
                <th>Correo Electrónico</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">
                    <div className="no-data-content">
                      <div className="no-data-icon">👥</div>
                      <h3>No se encontraron usuarios</h3>
                      <p>
                        {searchTerm 
                          ? 'Intenta con otros términos de búsqueda'
                          : 'Comienza creando tu primer usuario'
                        }
                      </p>
                      {!searchTerm && (
                        <button className="btn-primary" onClick={openCreateModal}>
                          <span className="btn-icon">➕</span>
                          Crear Usuario
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="user-row">
                    <td className="checkbox-column">
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </td>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.nombre?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="user-details">
                          <div className="user-name">
                            {user.nombre} {user.apellido}
                          </div>
                          <div className="user-id">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="email-container">
                        <span className="email">{user.correo_electronico}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`role-badge role-${getRoleDisplay(user.rol).color}`}>
                        {getRoleDisplay(user.rol).label}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-${getStatusColor(user)}`}>
                        {getStatusColor(user) === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => openEditModal(user)}
                          title="Editar usuario"
                        >
                          ✏️
                        </button>
                        <button
                          className="action-btn areas-btn"
                          onClick={() => handleManageAreas(user)}
                          title="Gestionar áreas"
                        >
                          🏢
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(user)}
                          title="Eliminar usuario"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Información de resultados */}
      {filteredUsers.length > 0 && (
        <div className="table-footer">
          <div className="results-info">
            Mostrando {filteredUsers.length} de {users.length} usuarios
            {selectedUsers.length > 0 && (
              <span className="selected-info">
                • {selectedUsers.length} seleccionado(s)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Modal del formulario de usuario */}
      {isModalOpen && (
        <UserForm
          user={editingUser}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleUserSaved}
        />
      )}

      {/* Modal de gestión de áreas */}
      {isAreasModalOpen && selectedUserForAreas && (
        <UserAreasManagement
          isOpen={isAreasModalOpen}
          onClose={closeAreasModal}
          userId={selectedUserForAreas.id}
          userName={`${selectedUserForAreas.nombre} ${selectedUserForAreas.apellido}`}
        />
      )}
    </div>
  );
};

export default UserDashboard;
