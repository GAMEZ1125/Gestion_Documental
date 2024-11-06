// src/components/UserAreasManagement.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const UserAreasManagement = () => {
  const { userId } = useParams(); // Obtiene el ID del usuario de los parámetros de la URL
  const [areas, setAreas] = useState([]); // Estado para las áreas
  const [userAreas, setUserAreas] = useState([]); // Estado para las áreas asociadas al usuario
  const [selectedAreas, setSelectedAreas] = useState([]); // Estado para áreas seleccionadas
  const navigate = useNavigate();

  // Cargar áreas disponibles y áreas asociadas al usuario
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await api.get('/areas'); // Asegúrate de tener la ruta para obtener áreas
        setAreas(response.data);
      } catch (error) {
        console.error('Error al obtener áreas:', error);
      }
    };

    const fetchUserAreas = async () => {
      try {
        const response = await api.get(`/usuarios-areas/${userId}/areas`); // Cambia la ruta aquí
        // Asumiendo que la respuesta tiene la forma [{ id, nombre }, ...]
        const associatedAreas = response.map(area => area.id); // Cambia aquí para obtener el ID directamente
        setUserAreas(associatedAreas);
        setSelectedAreas(associatedAreas);
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
      const areasToAdd = selectedAreas.filter(areaId => !userAreas.includes(areaId));
      const areasToRemove = userAreas.filter(areaId => !selectedAreas.includes(areaId));

      // Agregar áreas
      if (areasToAdd.length > 0) {
        await api.post(`/usuarios-areas/${userId}/areas`, { areaIds: areasToAdd });
      }

      // Eliminar áreas
      for (const areaId of areasToRemove) {
        await api.delete(`/usuarios-areas/${userId}/areas/${areaId}`);
      }

      // Actualiza el estado de áreas asociadas
      setUserAreas(selectedAreas);
      alert('Cambios guardados con éxito.');
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      alert('Error al guardar cambios.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Gestión de Áreas para Usuario</h2>
      <button className="btn btn-secondary mb-3" onClick={() => navigate('/users')}>Volver a la gestión de usuarios</button>
      <h4>Áreas Disponibles</h4>
      <ul className="list-group mb-4">
        {areas.map(area => (
          <li key={area.id} className="list-group-item">
            <input
              type="checkbox"
              checked={selectedAreas.includes(area.id)}
              onChange={() => handleAreaToggle(area.id)}
            />
            {area.nombre}
          </li>
        ))}
      </ul>
      <button className="btn btn-primary" onClick={handleSaveChanges}>Guardar Cambios</button>
    </div>
  );
};

export default UserAreasManagement;
