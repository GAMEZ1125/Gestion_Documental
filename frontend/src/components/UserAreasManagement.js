// src/components/UserAreasManagement.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import AlertService from '../services/alertService';
import '../css/Global.css';
import '../css/UserAreasManagement.css';

const UserAreasManagement = ({ isOpen, onClose, userId, userName }) => {
  const [areas, setAreas] = useState([]);
  const [userAreas, setUserAreas] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAreas, setFilteredAreas] = useState([]);

  // Debug para verificar props
  useEffect(() => {
    console.log('UserAreasManagement props:', { isOpen, userId, userName });
  }, [isOpen, userId, userName]);

  // Cargar áreas disponibles y áreas asociadas al usuario
  useEffect(() => {
    if (isOpen && userId) {
      console.log('Fetching data for user:', userId);
      fetchData();
    }
  }, [isOpen, userId]);

  // Filtrar áreas cuando cambie el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAreas(areas);
    } else {
      const filtered = areas.filter(area =>
        area.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAreas(filtered);
    }
  }, [areas, searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching areas and user areas...');
      
      const [areasResponse, userAreasResponse] = await Promise.all([
        api.get('/areas'),
        api.get(`/usuarios-areas/${userId}/areas`)
      ]);

      console.log('Areas response:', areasResponse.data);
      console.log('User areas response:', userAreasResponse.data);

      setAreas(areasResponse.data);
      setFilteredAreas(areasResponse.data);
      setUserAreas(userAreasResponse.data);
      setSelectedAreas(userAreasResponse.data.map(area => area.id));
    } catch (error) {
      console.error('Error al obtener datos:', error);
      AlertService.error('Error', 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar el toggle de áreas
  const handleAreaToggle = (areaId) => {
    if (selectedAreas.includes(areaId)) {
      setSelectedAreas(selectedAreas.filter(id => id !== areaId));
    } else {
      setSelectedAreas([...selectedAreas, areaId]);
    }
  };

  // Función para guardar cambios
  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      
      const currentAreaIds = userAreas.map(area => area.id);
      const areasToAdd = selectedAreas.filter(areaId => !currentAreaIds.includes(areaId));
      const areasToRemove = currentAreaIds.filter(areaId => !selectedAreas.includes(areaId));

      console.log('Areas to add:', areasToAdd);
      console.log('Areas to remove:', areasToRemove);

      // Agregar áreas
      if (areasToAdd.length > 0) {
        await api.post(`/usuarios-areas/${userId}/areas`, { areaIds: areasToAdd });
      }

      // Eliminar áreas
      for (const areaId of areasToRemove) {
        await api.delete(`/usuarios-areas/${userId}/areas/${areaId}`);
      }

      // Actualizar el estado de áreas asociadas
      setUserAreas(areas.filter(area => selectedAreas.includes(area.id)));
      
      AlertService.success('¡Guardado!', 'Las áreas del usuario se han actualizado correctamente');
      onClose();
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      AlertService.error('Error', 'No se pudieron guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  // Función para eliminar un área asociada al usuario
  const handleRemoveUserArea = async (areaId) => {
    const area = userAreas.find(a => a.id === areaId);
    const result = await AlertService.confirm(
      '¿Eliminar Área?',
      `¿Estás seguro de que quieres eliminar "${area?.nombre}" del usuario? Esta acción se puede deshacer.`
    );

    if (result.isConfirmed) {
      try {
        await api.delete(`/usuarios-areas/${userId}/areas/${areaId}`);
        setUserAreas(userAreas.filter(area => area.id !== areaId));
        setSelectedAreas(selectedAreas.filter(id => id !== areaId));
        AlertService.success('¡Eliminada!', 'Área eliminada del usuario exitosamente');
      } catch (error) {
        console.error('Error al eliminar el área:', error);
        AlertService.error('Error', 'No se pudo eliminar el área');
      }
    }
  };

  const handleClose = () => {
    if (saving) return;
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Calcular cambios pendientes
  const currentAreaIds = userAreas.map(area => area.id);
  const hasPendingChanges = 
    selectedAreas.length !== currentAreaIds.length ||
    !selectedAreas.every(id => currentAreaIds.includes(id));

  console.log('Render UserAreasManagement - isOpen:', isOpen);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="areas-modal-container">
        <div className="areas-modal-header">
          <div className="modal-title-section">
            <div className="modal-icon">🏢</div>
            <div>
              <h2 className="modal-title">Gestión de Áreas</h2>
              <p className="modal-subtitle">
                Asignar áreas a: <strong>{userName}</strong>
              </p>
            </div>
          </div>
          
          <button 
            className="modal-close-btn"
            onClick={handleClose}
            disabled={saving}
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="areas-loading">
            <div className="loading-spinner"></div>
            <p>Cargando áreas...</p>
          </div>
        ) : (
          <>
            <div className="areas-modal-content">
              {/* Sección de Áreas Disponibles */}
              <div className="areas-section">
                <div className="section-header">
                  <h3 className="section-title">
                    <span className="section-icon">📋</span>
                    Áreas Disponibles
                  </h3>
                  <div className="search-container">
                    <div className="search-icon">🔍</div>
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Buscar áreas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button 
                        className="search-clear"
                        onClick={() => setSearchTerm('')}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {filteredAreas.length === 0 ? (
                  <div className="no-areas">
                    <div className="no-areas-icon">🏢</div>
                    <h4>No se encontraron áreas</h4>
                    <p>
                      {searchTerm 
                        ? 'Intenta con otros términos de búsqueda'
                        : 'No hay áreas disponibles en el sistema'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="areas-grid">
                    {filteredAreas.map(area => (
                      <div key={area.id} className="area-card">
                        <label className="area-checkbox-container">
                          <input
                            type="checkbox"
                            checked={selectedAreas.includes(area.id)}
                            onChange={() => handleAreaToggle(area.id)}
                            disabled={saving}
                          />
                          <span className="area-checkmark"></span>
                          <div className="area-info">
                            <div className="area-name">{area.nombre}</div>
                            <div className="area-status">
                              {selectedAreas.includes(area.id) ? 'Asignada' : 'Disponible'}
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="section-divider"></div>

              {/* Sección de Áreas Asignadas */}
              <div className="areas-section">
                <div className="section-header">
                  <h3 className="section-title">
                    <span className="section-icon">✅</span>
                    Áreas Asignadas ({userAreas.length})
                  </h3>
                </div>

                {userAreas.length === 0 ? (
                  <div className="no-assigned-areas">
                    <div className="no-assigned-icon">📝</div>
                    <h4>Sin áreas asignadas</h4>
                    <p>Este usuario no tiene áreas asignadas actualmente</p>
                  </div>
                ) : (
                  <div className="assigned-areas-list">
                    {userAreas.map(area => (
                      <div key={area.id} className="assigned-area-item">
                        <div className="assigned-area-info">
                          <div className="assigned-area-icon">🏢</div>
                          <div className="assigned-area-details">
                            <div className="assigned-area-name">{area.nombre}</div>
                            <div className="assigned-area-meta">
                              ID: {area.id} • Asignada
                            </div>
                          </div>
                        </div>
                        <button
                          className="remove-area-btn"
                          onClick={() => handleRemoveUserArea(area.id)}
                          disabled={saving}
                          title="Eliminar área"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="areas-modal-footer">
              <div className="footer-info">
                {hasPendingChanges && (
                  <div className="pending-changes">
                    <span className="pending-icon">⚠️</span>
                    Tienes cambios sin guardar
                  </div>
                )}
                <div className="areas-summary">
                  <div className="summary-item">
                    <span>📊</span>
                    Total: {areas.length}
                  </div>
                  <div className="summary-item">
                    <span>✅</span>
                    Seleccionadas: {selectedAreas.length}
                  </div>
                  <div className="summary-item">
                    <span>🏢</span>
                    Asignadas: {userAreas.length}
                  </div>
                </div>
              </div>

              <div className="footer-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleClose}
                  disabled={saving}
                >
                  <span className="btn-icon">❌</span>
                  Cancelar
                </button>
                
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleSaveChanges}
                  disabled={saving || !hasPendingChanges}
                >
                  {saving ? (
                    <>
                      <span className="btn-spinner"></span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">💾</span>
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserAreasManagement;
