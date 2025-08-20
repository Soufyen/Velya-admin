import { API_BASE_URL, defaultHeaders, getAuthHeaders, handleResponse } from './config';
import { Video } from '@/lib/types';

export async function createVideo(data: Partial<Video>) {
  const response = await fetch(`${API_BASE_URL}/videos`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Video>(response);
}

export async function getVideos() {
  const response = await fetch(`${API_BASE_URL}/videos`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<Video[]>(response);
}

export async function getAdminVideos() {
  const response = await fetch(`${API_BASE_URL}/videos/admin`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<Video[]>(response);
}

export async function getVideo(id: string) {
  const response = await fetch(`${API_BASE_URL}/videos/${id}`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<Video>(response);
}

export async function updateVideo(id: string, data: Partial<Video>) {
  const response = await fetch(`${API_BASE_URL}/videos/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Video>(response);
}

export async function deleteVideo(id: string) {
  const response = await fetch(`${API_BASE_URL}/videos/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse<void>(response);
}

export async function publishVideo(id: string) {
  const response = await fetch(`${API_BASE_URL}/videos/${id}/publish`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  return handleResponse<Video>(response);
}