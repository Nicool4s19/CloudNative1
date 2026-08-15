import React, { useState, useEffect } from 'react';

// Get API base URL from environment or default to localhost:8080
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/incidencias';

function App() {
  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState({ ABIERTA: 0, EN_PROGRESO: 0, RESUELTA: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  
  // Modals state
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [editingIncident, setEditingIncident] = useState(null);
  
  // Form input states
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formPriority, setFormPriority] = useState('MEDIA');
  const [formStatus, setFormStatus] = useState('ABIERTA');
  const [formResponsable, setFormResponsable] = useState('');
  
  // UI States
  const [notifications, setNotifications] = useState([]);
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch all data
  const fetchData = async () => {
    try {
      // Build query string
      const params = new URLSearchParams();
      if (statusFilter) params.append('estado', statusFilter);
      if (priorityFilter) params.append('prioridad', priorityFilter);
      if (search) params.append('search', search);
      
      const response = await fetch(`${API_BASE_URL}?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setIncidents(data);
      }
      
      // Fetch stats
      const statsResponse = await fetch(`${API_BASE_URL}/stats`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats({
          ABIERTA: statsData.ABIERTA || 0,
          EN_PROGRESO: statsData.EN_PROGRESO || 0,
          RESUELTA: statsData.RESUELTA || 0
        });
      }
    } catch (error) {
      showToast('Error de comunicación con el servidor', 'error');
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, statusFilter, priorityFilter]);

  // Toast notifications
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  // Open Form for creation
  const handleOpenCreate = () => {
    setEditingIncident(null);
    setFormTitle('');
    setFormDesc('');
    setFormCategory('');
    setFormPriority('MEDIA');
    setFormStatus('ABIERTA');
    setFormResponsable('');
    setErrorMsg('');
    setShowFormModal(true);
  };

  // Open Form for editing
  const handleOpenEdit = (incident, e) => {
    e.stopPropagation();
    setEditingIncident(incident);
    setFormTitle(incident.titulo || '');
    setFormDesc(incident.descripcion || '');
    setFormCategory(incident.categoria || '');
    setFormPriority(incident.prioridad || 'MEDIA');
    setFormStatus(incident.estado || 'ABIERTA');
    setFormResponsable(incident.responsable || '');
    setErrorMsg('');
    setShowFormModal(true);
  };

  // Open Detail modal
  const handleOpenDetail = (incident) => {
    setSelectedIncident(incident);
    setShowDetailModal(true);
  };

  // Save (Create or Update)
  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formTitle.trim()) {
      setErrorMsg('El título es obligatorio');
      return;
    }
    if (!formDesc.trim()) {
      setErrorMsg('La descripción es obligatoria');
      return;
    }

    const payload = {
      titulo: formTitle,
      descripcion: formDesc,
      categoria: formCategory,
      prioridad: formPriority,
      estado: formStatus,
      responsable: formResponsable
    };

    try {
      let response;
      if (editingIncident) {
        // PUT update
        response = await fetch(`${API_BASE_URL}/${editingIncident.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // POST create
        response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        showToast(editingIncident ? 'Incidencia actualizada con éxito' : 'Incidencia registrada con éxito', 'success');
        setShowFormModal(false);
        fetchData();
      } else {
        const errJson = await response.json();
        setErrorMsg(errJson.message || 'Error al guardar la incidencia');
      }
    } catch (error) {
      setErrorMsg('No se pudo conectar con el servidor backend');
    }
  };

  // Quick State change from list
  const handleQuickStatusChange = async (id, newStatus, e) => {
    e.stopPropagation();
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/estado?nuevoEstado=${newStatus}`, {
        method: 'PATCH'
      });
      if (response.ok) {
        showToast(`Estado cambiado a ${newStatus}`, 'success');
        fetchData();
      } else {
        showToast('Error al cambiar el estado rápido', 'error');
      }
    } catch (error) {
      showToast('Error de comunicación con el servidor', 'error');
    }
  };

  // Delete Incident
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('¿Está seguro de que desea eliminar esta incidencia permanentemente?')) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        showToast('Incidencia eliminada con éxito', 'success');
        fetchData();
      } else {
        showToast('Error al eliminar la incidencia', 'error');
      }
    } catch (error) {
      showToast('Error de comunicación con el servidor', 'error');
    }
  };

  // Toggle Theme
  const toggleTheme = () => {
    setIsLightTheme(!isLightTheme);
    if (!isLightTheme) {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  };

  // Helper date formatter
  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="app-container">
      {/* Toast Notifications */}
      <div className="notification-container">
        {notifications.map((n) => (
          <div key={n.id} className={`notification-toast ${n.type}`}>
            {n.type === 'success' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            )}
            <span>{n.message}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="app-header">
        <div className="brand-section">
          <h1>Incidencias Help Desk</h1>
          <p>Módulo de registro, control y seguimiento técnico</p>
        </div>
        <div className="header-actions">
          <button className="btn-theme-toggle" onClick={toggleTheme} title="Cambiar tema">
            {isLightTheme ? '🌙' : '☀️'}
          </button>
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Nueva Incidencia
          </button>
        </div>
      </header>

      {/* Stats Counter Dashboard */}
      <section className="stats-dashboard">
        <div className="stat-card abiertas">
          <div className="stat-info">
            <h3>Abiertas</h3>
            <div className="stat-value">{stats.ABIERTA}</div>
          </div>
          <div className="stat-icon">📂</div>
        </div>
        <div className="stat-card progreso">
          <div className="stat-info">
            <h3>En Progreso</h3>
            <div className="stat-value">{stats.EN_PROGRESO}</div>
          </div>
          <div className="stat-icon">⚡</div>
        </div>
        <div className="stat-card resueltas">
          <div className="stat-info">
            <h3>Resueltas</h3>
            <div className="stat-value">{stats.RESUELTA}</div>
          </div>
          <div className="stat-icon">✔️</div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="filter-bar">
        <div className="search-wrapper">
          <svg className="search-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar incidencia por título o descripción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Todos los Estados</option>
          <option value="ABIERTA">Abierta</option>
          <option value="EN_PROGRESO">En Progreso</option>
          <option value="RESUELTA">Resuelta</option>
        </select>

        <select
          className="filter-select"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="">Todas las Prioridades</option>
          <option value="BAJA">Prioridad Baja</option>
          <option value="MEDIA">Prioridad Media</option>
          <option value="ALTA">Prioridad Alta</option>
        </select>
      </section>

      {/* Grid List */}
      <section className="incidents-grid">
        {incidents.length === 0 ? (
          <div className="empty-state">
            <h3>No se encontraron incidencias</h3>
            <p>Pruebe limpiando los filtros o agregue un nuevo reporte técnico para comenzar.</p>
          </div>
        ) : (
          incidents.map((inc) => (
            <div
              key={inc.id}
              className="incident-card"
              onClick={() => handleOpenDetail(inc)}
              style={{ cursor: 'pointer' }}
            >
              <div>
                <div className="card-header">
                  <span className={`badge badge-${inc.prioridad?.toLowerCase() || 'media'}`}>
                    {inc.prioridad}
                  </span>
                  <span className={`badge badge-${inc.estado?.toLowerCase() || 'abierta'}`}>
                    {inc.estado}
                  </span>
                </div>
                <h3 className="card-title">{inc.titulo}</h3>
                <p className="card-description">{inc.descripcion}</p>
              </div>

              <div>
                <div className="card-meta">
                  <div className="meta-field">
                    Ref: <strong>#{inc.id}</strong>
                  </div>
                  <div className="meta-field">
                    Resp: <strong>{inc.responsable || 'Sin asignar'}</strong>
                  </div>
                </div>

                <div className="card-actions">
                  <div className="quick-status-actions">
                    {inc.estado === 'ABIERTA' && (
                      <button
                        className="btn-action-small btn-action-start"
                        onClick={(e) => handleQuickStatusChange(inc.id, 'EN_PROGRESO', e)}
                      >
                        Iniciar
                      </button>
                    )}
                    {inc.estado === 'EN_PROGRESO' && (
                      <button
                        className="btn-action-small btn-action-resolve"
                        onClick={(e) => handleQuickStatusChange(inc.id, 'RESUELTA', e)}
                      >
                        Resolver
                      </button>
                    )}
                  </div>
                  
                  <div className="utility-actions">
                    <button
                      className="btn-icon"
                      onClick={(e) => handleOpenEdit(inc, e)}
                      title="Editar Incidencia"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={(e) => handleDelete(inc.id, e)}
                      title="Eliminar Incidencia"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Form Modal (Create / Edit) */}
      {showFormModal && (
        <div className="modal-overlay" onClick={() => setShowFormModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingIncident ? 'Editar Incidencia' : 'Nueva Incidencia'}</h2>
              <button className="btn-icon" onClick={() => setShowFormModal(false)}>✕</button>
            </div>
            
            {errorMsg && <div style={{ color: 'var(--color-alta)', marginBottom: '1rem', fontWeight: 'bold' }}>⚠️ {errorMsg}</div>}

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Título *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej: Impresora 3F sin conexión a red"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Descripción *</label>
                <textarea
                  className="form-textarea"
                  placeholder="Detalle los síntomas del problema técnico de forma clara..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Categoría</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej: Hardware, Red, Software, Accesos"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label>Prioridad</label>
                  <select
                    className="form-select"
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value)}
                  >
                    <option value="BAJA">Baja</option>
                    <option value="MEDIA">Media</option>
                    <option value="ALTA">Alta</option>
                  </select>
                </div>
                <div>
                  <label>Estado</label>
                  <select
                    className="form-select"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    disabled={!editingIncident} // Al crear es siempre ABIERTA por RN-01
                  >
                    <option value="ABIERTA">Abierta</option>
                    <option value="EN_PROGRESO">En Progreso</option>
                    <option value="RESUELTA">Resuelta</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Técnico Responsable</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Nombre del encargado..."
                  value={formResponsable}
                  onChange={(e) => setFormResponsable(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowFormModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingIncident ? 'Guardar Cambios' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedIncident && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalle de Incidencia #{selectedIncident.id}</h2>
              <button className="btn-icon" onClick={() => setShowDetailModal(false)}>✕</button>
            </div>

            <div className="detail-grid">
              <div className="detail-row">
                <span className="detail-label">Título</span>
                <span className="detail-value" style={{ fontWeight: 'bold' }}>{selectedIncident.titulo}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Categoría</span>
                <span className="detail-value">{selectedIncident.categoria || 'Sin especificar'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Prioridad</span>
                <span className={`badge badge-${selectedIncident.prioridad?.toLowerCase()}`}>
                  {selectedIncident.prioridad}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Estado</span>
                <span className={`badge badge-${selectedIncident.estado?.toLowerCase()}`}>
                  {selectedIncident.estado}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Técnico Asignado</span>
                <span className="detail-value">{selectedIncident.responsable || 'Sin asignar'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Fecha de Registro</span>
                <span className="detail-value">{formatDate(selectedIncident.fecha_cracion)}</span>
              </div>
              <div className="detail-row vertical">
                <span className="detail-label">Descripción del Problema</span>
                <div className="detail-value description-box">{selectedIncident.descripcion}</div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
