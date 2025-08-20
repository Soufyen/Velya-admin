import { API_BASE_URL, defaultHeaders, getAuthHeaders, handleResponse } from './config';
import { Diapo } from '@/lib/types';

export async function createDiapo(data: Partial<Diapo>) {
  const response = await fetch(`${API_BASE_URL}/diapos`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Diapo>(response);
}

export async function getDiapos() {
  const response = await fetch(`${API_BASE_URL}/diapos`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<Diapo[]>(response);
}

export async function getPublicDiapos() {
  const response = await fetch(`${API_BASE_URL}/diapos/public`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<Diapo[]>(response);
}

export async function getDiapo(id: string) {
  const response = await fetch(`${API_BASE_URL}/diapos/${id}`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<Diapo>(response);
}

export async function updateDiapo(id: string, data: Partial<Diapo>) {
  const response = await fetch(`${API_BASE_URL}/diapos/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Diapo>(response);
}

export async function deleteDiapo(id: string) {
  const response = await fetch(`${API_BASE_URL}/diapos/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse<void>(response);
}

export async function updateDiapoStatus(id: string, status: string) {
  const response = await fetch(`${API_BASE_URL}/diapos/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  return handleResponse<Diapo>(response);
}