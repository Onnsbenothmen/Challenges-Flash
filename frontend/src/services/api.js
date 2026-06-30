import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

export async function createQuote(data) {
  const response = await api.post('/quotes', data);
  return response.data;
}

export async function getQuotes(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  const response = await api.get(`/quotes?${params.toString()}`);
  return response.data;
}

export async function getQuoteById(id) {
  const response = await api.get(`/quotes/${id}`);
  return response.data;
}

export async function updateQuote(id, data) {
  const response = await api.put(`/quotes/${id}`, data);
  return response.data;
}

export async function deleteQuote(id) {
  const response = await api.delete(`/quotes/${id}`);
  return response.data;
}

export function getPDFUrl(id) {
  const base = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  return `${base}/pdf/quote/${id}`;
}

export default api;
