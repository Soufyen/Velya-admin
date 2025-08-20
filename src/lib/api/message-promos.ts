import { API_BASE_URL, defaultHeaders, getAuthHeaders, handleResponse } from './config';
import { MessagePromo } from '@/lib/types';

export async function createMessagePromo(data: Partial<MessagePromo>) {
  const response = await fetch(`${API_BASE_URL}/message-promos`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<MessagePromo>(response);
}

export async function getMessagePromos() {
  const response = await fetch(`${API_BASE_URL}/message-promos`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<MessagePromo[]>(response);
}

export async function getPublicMessagePromos() {
  const response = await fetch(`${API_BASE_URL}/message-promos/public`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<MessagePromo[]>(response);
}

export async function getMessagePromo(id: string) {
  const response = await fetch(`${API_BASE_URL}/message-promos/${id}`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<MessagePromo>(response);
}

export async function updateMessagePromo(id: string, data: Partial<MessagePromo>) {
  const response = await fetch(`${API_BASE_URL}/message-promos/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<MessagePromo>(response);
}

export async function deleteMessagePromo(id: string) {
  const response = await fetch(`${API_BASE_URL}/message-promos/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse<void>(response);
}

export async function updateMessagePromoStatus(id: string, status: string) {
  const response = await fetch(`${API_BASE_URL}/message-promos/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  return handleResponse<MessagePromo>(response);
}