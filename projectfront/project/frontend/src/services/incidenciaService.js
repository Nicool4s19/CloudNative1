import axios from 'axios';

// La URL base apunta a tu Spring Boot (puerto 8080)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/incidencias';

export const getIncidencias = async (filtros = {}) => {
  const params = new URLSearchParams();
  if (filtros.estado) params.append('estado', filtros.estado);
  if (filtros.prioridad) params.append('prioridad', filtros.prioridad);
  if (filtros.search) params.append('search', filtros.search);

  const response = await axios.get(`${API_URL}${params.toString() ? `?${params.toString()}` : ''}`);
  return response.data;
};

export const createIncidencia = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const updateIncidencia = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteIncidencia = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};