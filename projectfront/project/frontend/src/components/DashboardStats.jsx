import React from 'react';

export const DashboardStats = ({ incidencias, filtros, setFiltros }) => {
  const total = incidencias.length;
  const abiertas = incidencias.filter(i => i.estado === 'ABIERTA').length;
  const enProgreso = incidencias.filter(i => i.estado === 'EN_PROGRESO').length;
  const resueltas = incidencias.filter(i => i.estado === 'RESUELTA').length;

  return (
    <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
      {/* Contadores por Estado */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
        <div><strong>Total:</strong> {total}</div>
        <div style={{ color: '#d9534f' }}><strong>Abiertas:</strong> {abiertas}</div>
        <div style={{ color: '#f0ad4e' }}><strong>En Progreso:</strong> {enProgreso}</div>
        <div style={{ color: '#5cb85c' }}><strong>Resueltas:</strong> {resueltas}</div>
      </div>

      {/* Controles de Búsqueda e Interacción con el Backend */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Buscar por texto..."
          value={filtros.search || ''}
          onChange={(e) => setFiltros({ ...filtros, search: e.target.value })}
          style={{ flex: 1, padding: '8px' }}
        />

        <select
          value={filtros.estado || ''}
          onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
          style={{ padding: '8px' }}
        >
          <option value="">Todos los Estados</option>
          <option value="ABIERTA">ABIERTA</option>
          <option value="EN_PROGRESO">EN_PROGRESO</option>
          <option value="RESUELTA">RESUELTA</option>
        </select>

        <select
          value={filtros.prioridad || ''}
          onChange={(e) => setFiltros({ ...filtros, prioridad: e.target.value })}
          style={{ padding: '8px' }}
        >
          <option value="">Todas las Prioridades</option>
          <option value="BAJA">BAJA</option>
          <option value="MEDIA">MEDIA</option>
          <option value="ALTA">ALTA</option>
        </select>
      </div>
    </div>
  );
};