import { API_BASE_URL, defaultHeaders, handleResponse } from './config';
import { Step } from '@/lib/types';

export async function createStep(data: Partial<Step>) {
  const response = await fetch(`${API_BASE_URL}/steps`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(data),
  });
  return handleResponse<Step>(response);
}

export async function getSteps() {
  const response = await fetch(`${API_BASE_URL}/steps`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<Step[]>(response);
}

export async function getStepsByFormation(formationId: string) {
  const response = await fetch(`${API_BASE_URL}/steps/formation/${formationId}`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<Step[]>(response);
}

export async function getStep(id: string) {
  const response = await fetch(`${API_BASE_URL}/steps/${id}`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<Step>(response);
}

export async function updateStep(id: string, data: Partial<Step>) {
  const response = await fetch(`${API_BASE_URL}/steps/${id}`, {
    method: 'PATCH',
    headers: defaultHeaders,
    body: JSON.stringify(data),
  });
  return handleResponse<Step>(response);
}

export async function deleteStep(id: string) {
  const response = await fetch(`${API_BASE_URL}/steps/${id}`, {
    method: 'DELETE',
    headers: defaultHeaders,
  });
  return handleResponse<void>(response);
}