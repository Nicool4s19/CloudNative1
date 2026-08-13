import React, { useState, useEffect } from 'react';

export const IncidenciaForm = ({ incidenciaEditar, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    prioridad: 'MEDIA',
    estado: 'ABIERTA'
  });

  useEffect(() => {
    if (incidenciaEditar) {
      setFormData(incidenciaEditar);
    } else {
      setFormData({
        titulo: '',
        descripcion: '',
        categoria: '',
        prioridad: 'MEDIA',
        estado: 'ABIERTA'
      });
    }
  }, [incidenciaEditar]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.titulo.trim() || !formData.descripcion.trim()) {
      alert('El título y la descripción son obligatorios.');
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '20px' }}>
      <h3>{incidenciaEditar ? 'Editar Incidencia' : 'Nueva Incidencia'}</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block' }}>Título *</label>
        <input
          type="text"
          value={formData.titulo}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
          style={{ width: '100%', padding: '8px' }}
          required
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block' }}>Descripción *</label>
        <textarea
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          style={{ width: '100%', padding: '8px' }}
          required
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block' }}>Categoría</label>
          <input
            type="text"
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block' }}>Prioridad</label>
          <select
            value={formData.prioridad}
            onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
            style={{ padding: '8px' }}
          >
            <option value="BAJA">BAJA</option>
            <option value="MEDIA">MEDIA</option>
            <option value="ALTA">ALTA</option>
          </select>
        </div>

        {incidenciaEditar && (
          <div>
            <label style={{ display: 'block' }}>Estado</label>
            <select
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              style={{ padding: '8px' }}
            >
              <option value="ABIERTA">ABIERTA</option>
              <option value="EN_PROGRESO">EN_PROGRESO</option>
              <option value="RESUELTA">RESUELTA</option>
            </select>
          </div>
        )}
      </div>

      <button type="submit" style={{ padding: '8px 16px', marginRight: '10px' }}>Guardar</button>
      {incidenciaEditar && (
        <button type="button" onClick={onCancel} style={{ padding: '8px 16px' }}>Cancelar</button>
      )}
    </form>
  );
};