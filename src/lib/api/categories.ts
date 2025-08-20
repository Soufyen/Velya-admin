import { API_BASE_URL, defaultHeaders, handleResponse } from './config';
import { Category } from '@/lib/types';

export async function createCategory(data: Partial<Category>) {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: {
      ...defaultHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<Category>(response);
}

export async function getCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<Category[]>(response);
}

export async function getCategory(id: string) {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<Category>(response);
}

export async function updateCategory(id: string, data: Partial<Category>) {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'PATCH',
    headers: {
      ...defaultHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<Category>(response);
}

export async function deleteCategory(id: string) {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'DELETE',
    headers: defaultHeaders,
  });
  return handleResponse<void>(response);
}