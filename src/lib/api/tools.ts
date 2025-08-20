import { API_BASE_URL, defaultHeaders, handleResponse } from './config';
import { Tool } from '@/lib/types';

export async function createTool(data: Partial<Tool>) {
  const response = await fetch(`${API_BASE_URL}/tools`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(data),
  });
  return handleResponse<Tool>(response);
}

export async function getTools() {
  const response = await fetch(`${API_BASE_URL}/tools`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<Tool[]>(response);
}

export async function getToolsByFormation(formationId: string) {
  const response = await fetch(`${API_BASE_URL}/tools/formation/${formationId}`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<Tool[]>(response);
}

export async function getTool(id: string) {
  const response = await fetch(`${API_BASE_URL}/tools/${id}`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<Tool>(response);
}

export async function updateTool(id: string, data: Partial<Tool>) {
  const response = await fetch(`${API_BASE_URL}/tools/${id}`, {
    method: 'PATCH',
    headers: defaultHeaders,
    body: JSON.stringify(data),
  });
  return handleResponse<Tool>(response);
}

export async function deleteTool(id: string) {
  const response = await fetch(`${API_BASE_URL}/tools/${id}`, {
    method: 'DELETE',
    headers: defaultHeaders,
  });
  return handleResponse<void>(response);
}