/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/api.ts
import { API_BASE_URL, defaultHeaders, handleResponse } from './config';
import { Formation } from '../../lib/types';

export async function createFormation(data: Partial<Formation>) {
  const response = await fetch(`${API_BASE_URL}/formations`, {
    method: 'POST',
    headers: {
      ...defaultHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
      startDay: data.startDay ? new Date(data.startDay).toISOString() : undefined,
    }),
  });
  return handleResponse<Formation>(response);
}

export async function createFormationWithRelations(data: any) {
  const response = await fetch(`${API_BASE_URL}/formations/with-relations`, {
    method: 'POST',
    headers: {
      ...defaultHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<Formation>(response);
}

export async function getFormations() {
  const response = await fetch(`${API_BASE_URL}/formations`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<Formation[]>(response);
}

export async function getAdminFormations() {
  const response = await fetch(`${API_BASE_URL}/formations/admin`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<Formation[]>(response);
}

export async function getFormation(id: string) {
  const response = await fetch(`${API_BASE_URL}/formations/${id}`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<Formation>(response);
}

export async function getFormationBySlug(slug: string): Promise<Formation | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/formations/slug/${slug}`, {
      method: 'GET',
      headers: defaultHeaders,
    });
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Formation with slug ${slug} not found`);
        return null;
      }
      throw new Error(`Failed to fetch formation with slug ${slug}`);
    }
    const formation = await response.json();
    console.log(`Formation fetched for slug ${slug}:`, formation); // Debug log
    return formation;
  } catch (error) {
    console.error(`Error fetching formation with slug ${slug}:`, error);
    return null;
  }
}

export async function updateFormation(id: string, data: Partial<Formation>) {
  const response = await fetch(`${API_BASE_URL}/formations/${id}`, {
    method: 'PATCH',
    headers: {
      ...defaultHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
      startDay: data.startDay ? new Date(data.startDay).toISOString() : undefined,
    }),
  });
  return handleResponse<Formation>(response);
}

export async function updateFormationWithRelations(id: string, data: any) {
  const response = await fetch(`${API_BASE_URL}/formations/${id}/with-relations`, {
    method: 'PATCH',
    headers: {
      ...defaultHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<Formation>(response);
}

export async function deleteFormation(id: string) {
  const response = await fetch(`${API_BASE_URL}/formations/${id}`, {
    method: 'DELETE',
    headers: defaultHeaders,
  });
  return handleResponse<void>(response);
}

export async function publishFormation(id: string) {
  const response = await fetch(`${API_BASE_URL}/formations/${id}/publish`, {
    method: 'PATCH',
    headers: defaultHeaders,
  });
  return handleResponse<Formation>(response);
}

export async function archiveFormation(id: string) {
  const response = await fetch(`${API_BASE_URL}/formations/${id}/archive`, {
    method: 'PATCH',
    headers: defaultHeaders,
  });
  return handleResponse<Formation>(response);
}

export async function draftFormation(id: string) {
  const response = await fetch(`${API_BASE_URL}/formations/${id}/draft`, {
    method: 'PATCH',
    headers: defaultHeaders,
  });
  return handleResponse<Formation>(response);
}