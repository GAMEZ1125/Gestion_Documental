// src/components/UserAreasManagement.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const UserAreasManagement = () => {
  const { userId } = useParams(); // Obtiene el ID del usuario de los parámetros de la URL
  const [areas, setAreas] = useState([]); // Estado para las áreas disponibles
  const [userAreas, setUserAreas] = useState([]); // Estado para las áreas asociadas al usuario
  const [selectedAreas, setSelectedAreas] = useState([]); // Estado para áreas seleccionadas
  const navigate = useNavigate();

  // Cargar áreas disponibles y áreas asociadas al usuario
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await api.get('/areas');
        setAreas(response.data);
      } catch (error) {
        console.error('Error al obtener áreas:', error);
      }
    };

    const fetchUserAreas = async () => {
      try {
        const response = await api.get(`/usuarios-areas/${userId}/areas`);
        setUserAreas(response.data); // Asumiendo que el formato es [{ id, nombre }]
        setSelectedAreas(response.data.map(area => area.id));
      } catch (error) {
        console.error('Error al obtener áreas del usuario:', error);
      }
    };

    fetchAreas();
    fetchUserAreas();
  }, [userId]);

  // Función para manejar el toggle de áreas
  const handleAreaToggle = (areaId) => {
    if (selectedAreas.includes(areaId)) {
      setSelectedAreas(selectedAreas.filter(id => id !== areaId)); // Desasociar área
    } else {
      setSelectedAreas([...selectedAreas, areaId]); // Asociar área
    }
  };

  // Función para guardar cambios
  const handleSaveChanges = async () => {
    try {
      const areasToAdd = selectedAreas.filter(areaId => !userAreas.map(area => area.id).includes(areaId));
      const areasToRemove = userAreas.map(area => area.id).filter(areaId => !selectedAreas.includes(areaId));

      // Agregar áreas
      if (areasToAdd.length > 0) {
        await api.post(`/usuarios-areas/${userId}/areas`, { areaIds: areasToAdd });
      }

      // Eliminar áreas
      for (const areaId of areasToRemove) {
        await api.delete(`/usuarios-areas/${userId}/areas/${areaId}`);
      }

      // Actualiza el estado de áreas asociadas
      setUserAreas(areas.filter(area => selectedAreas.includes(area.id)));
      alert('Cambios guardados con éxito.');
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      alert('Error al guardar cambios.');
    }
  };

  // Función para eliminar un área asociada al usuario
  const handleRemoveUserArea = async (areaId) => {
    try {
      await api.delete(`/usuarios-areas/${userId}/areas/${areaId}`);
      setUserAreas(userAreas.filter(area => area.id !== areaId));
      setSelectedAreas(selectedAreas.filter(id => id !== areaId));
      alert('Área eliminada del usuario con éxito.');
    } catch (error) {
      console.error('Error al eliminar el área:', error);
      alert('Error al eliminar el área.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Gestión de Áreas para Usuario</h2>
      <button className="btn btn-secondary mb-3" onClick={() => navigate('/users')}>Volver a la gestión de usuarios</button>
      
      <h4>Áreas Disponibles</h4>
      <ul className="list-group mb-4">
        {areas.map(area => (
          <li key={area.id} className="list-group-item d-flex justify-content-between align-items-center">
            <input
              type="checkbox"
              checked={selectedAreas.includes(area.id)}
              onChange={() => handleAreaToggle(area.id)}
            />
            {area.nombre}
          </li>
        ))}
      </ul>
      
      <button className="btn btn-primary mb-5" onClick={handleSaveChanges}>Guardar Cambios</button>
      
      <h4>Áreas Asociadas al Usuario</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nombre del Área</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {userAreas.map(area => (
            <tr key={area.id}>
              <td>{area.nombre}</td>
              <td>
                <button className="btn btn-danger" onClick={() => handleRemoveUserArea(area.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserAreasManagement;
