import { API_BASE_URL, defaultHeaders, getAuthHeaders, handleResponse } from './config';
import { Post } from '@/lib/types';

export async function createPost(data: Partial<Post>) {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<Post>(response);
}

export async function getPosts() {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<Post[]>(response);
}

export async function getAdminPosts() {
  const response = await fetch(`${API_BASE_URL}/posts/admin`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse<Post[]>(response);
}

export async function getPostsByCategory(categoryId: string) {
  const response = await fetch(`${API_BASE_URL}/posts/category/${categoryId}`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<Post[]>(response);
}

export async function getPost(id: string) {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<Post>(response);
}

export async function updatePost(id: string, data: Partial<Post>) {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'PATCH',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<Post>(response);
}

export async function deletePost(id: string) {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse<void>(response);
}

export async function publishPost(id: string) {
  const response = await fetch(`${API_BASE_URL}/posts/${id}/publish`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  return handleResponse<Post>(response);
}