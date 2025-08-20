import { API_BASE_URL, defaultHeaders, handleResponse } from './config';
import { Module } from '@/lib/types';

export async function createModule(data: Partial<Module>) {
  const response = await fetch(`${API_BASE_URL}/modules`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(data),
  });
  return handleResponse<Module>(response);
}

export async function getModules() {
  const response = await fetch(`${API_BASE_URL}/modules`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<Module[]>(response);
}

export async function getModulesByFormation(formationId: string) {
  const response = await fetch(`${API_BASE_URL}/modules/formation/${formationId}`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<Module[]>(response);
}

export async function getModule(id: string) {
  const response = await fetch(`${API_BASE_URL}/modules/${id}`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<Module>(response);
}

export async function updateModule(id: string, data: Partial<Module>) {
  const response = await fetch(`${API_BASE_URL}/modules/${id}`, {
    method: 'PATCH',
    headers: defaultHeaders,
    body: JSON.stringify(data),
  });
  return handleResponse<Module>(response);
}

export async function deleteModule(id: string) {
  const response = await fetch(`${API_BASE_URL}/modules/${id}`, {
    method: 'DELETE',
    headers: defaultHeaders,
  });
  return handleResponse<void>(response);
}