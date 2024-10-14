import React, { useState } from 'react';
import api from '../services/api';

const WorkflowForm = ({ idDocumento }) => {
  const [estado, setEstado] = useState('En revisión');
  const [asignadoA, setAsignadoA] = useState('');
  const [comentarios, setComentarios] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/workflow', {
        id_documento: idDocumento,
        estado,
        asignado_a: asignadoA,
        comentarios,
      });
      alert('Flujo de trabajo creado.');
    } catch (error) {
      console.error('Error al crear flujo:', error);
      alert('Error al crear flujo.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Asignado a"
        value={asignadoA}
        onChange={(e) => setAsignadoA(e.target.value)}
        required
      />
      <textarea
        placeholder="Comentarios"
        value={comentarios}
        onChange={(e) => setComentarios(e.target.value)}
      />
      <button type="submit">Asignar</button>
    </form>
  );
};

export default WorkflowForm;
