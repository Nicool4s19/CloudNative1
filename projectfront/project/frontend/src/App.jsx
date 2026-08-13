import React, { useState, useEffect } from 'react';
import { getIncidencias, createIncidencia, updateIncidencia, deleteIncidencia } from './services/incidenciaService';
import { DashboardStats } from './components/DashboardStats';
import { IncidenciaForm } from './components/IncidenciaForm';

export function App() {
  const [incidencias, setIncidencias] = useState([]);
  const [filtros, setFiltros] = useState({ search: '', estado: '', prioridad: '' });
  const [incidenciaEditar, setIncidenciaEditar] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const cargarIncidencias = async () => {
    try {
      const data = await getIncidencias(filtros);
      setIncidencias(data);
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'No se pudo conectar con el servidor Spring Boot.' });
    }
  };

  useEffect(() => {
    cargarIncidencias();
  }, [filtros]);

  const handleSave = async (data) => {
    try {
      if (data.id) {
        await updateIncidencia(data.id, data);
        setMensaje({ tipo: 'exito', texto: 'Incidencia actualizada con éxito.' });
      } else {
        await createIncidencia(data);
        setMensaje({ tipo: 'exito', texto: 'Incidencia registrada con éxito.' });
      }
      setIncidenciaEditar(null);
      cargarIncidencias();
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error al procesar la incidencia.' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta incidencia?')) {
      try {
        await deleteIncidencia(id);
        setMensaje({ tipo: 'exito', texto: 'Incidencia eliminada correctamente.' });
        cargarIncidencias();
      } catch (err) {
        setMensaje({ tipo: 'error', texto: 'Error al eliminar la incidencia.' });
      }
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Mini Help Desk - Gestión de Incidencias</h2>

      {mensaje && (
        <div style={{ padding: '10px', marginBottom: '15px', background: mensaje.tipo === 'error' ? '#f8d7da' : '#d4edda' }}>
          {mensaje.texto}
        </div>
      )}

      <DashboardStats incidencias={incidencias} filtros={filtros} setFiltros={setFiltros} />

      <IncidenciaForm 
        incidenciaEditar={incidenciaEditar} 
        onSave={handleSave} 
        onCancel={() => setIncidenciaEditar(null)} 
      />

      <h3>Listado de Incidencias</h3>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f2f2f2' }}>
            <th>ID</th>
            <th>Título</th>
            <th>Categoría</th>
            <th>Prioridad</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {incidencias.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.titulo}</td>
              <td>{item.categoria}</td>
              <td>{item.prioridad}</td>
              <td>{item.estado}</td>
              <td>
                <button onClick={() => setIncidenciaEditar(item)}>Editar</button>{' '}
                <button onClick={() => handleDelete(item.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {incidencias.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>No existen incidencias registradas.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;