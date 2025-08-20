import { API_BASE_URL, defaultHeaders, handleResponse } from './config';
import { User } from '@/lib/types';

export async function createUser(data: Partial<User>) {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(data),
  });
  return handleResponse<User>(response);
}

export async function getUsers() {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<User[]>(response);
}

export async function getUser(id: string) {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<User>(response);
}

export async function updateUser(id: string, data: Partial<User>) {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PATCH',
    headers: defaultHeaders,
    body: JSON.stringify(data),
  });
  return handleResponse<User>(response);
}

export async function deleteUser(id: string) {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: defaultHeaders,
  });
  return handleResponse<void>(response);
}