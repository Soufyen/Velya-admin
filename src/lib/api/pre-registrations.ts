import { API_BASE_URL, defaultHeaders, getAuthHeaders, handleResponse } from './config';
import { PreRegistration } from '../../lib/types';

export async function createPreRegistration(data: Partial<PreRegistration>) {
  const response = await fetch(`${API_BASE_URL}/pre-registrations`, {
    method: 'POST',
    headers: {
      ...defaultHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<PreRegistration>(response);
}

export async function getPreRegistrations() {
  const response = await fetch(`${API_BASE_URL}/pre-registrations`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<PreRegistration[]>(response);
}

export async function getPreRegistration(id: string) {
  const response = await fetch(`${API_BASE_URL}/pre-registrations/${id}`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<PreRegistration>(response);
}

export async function updatePreRegistration(id: string, data: Partial<PreRegistration>) {
  const response = await fetch(`${API_BASE_URL}/pre-registrations/${id}`, {
    method: 'PATCH',
    headers: {
      ...defaultHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<PreRegistration>(response);
}

export async function deletePreRegistration(id: string) {
  const response = await fetch(`${API_BASE_URL}/pre-registrations/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse<void>(response);
}

export async function getPreRegistrationsByStatus(status: string) {
  const response = await fetch(`${API_BASE_URL}/pre-registrations/status/${status}`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<PreRegistration[]>(response);
}

export async function updatePreRegistrationStatus(id: string, status: string) {
  const response = await fetch(`${API_BASE_URL}/pre-registrations/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  return handleResponse<PreRegistration>(response);
}