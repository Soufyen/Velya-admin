import { API_BASE_URL, defaultHeaders, getAuthHeaders, handleResponse } from './config';
import { Testimonial } from '@/lib/types';

export async function createTestimonial(data: Partial<Testimonial>) {
  const response = await fetch(`${API_BASE_URL}/testimonials`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Testimonial>(response);
}

export async function getTestimonials() {
  const response = await fetch(`${API_BASE_URL}/testimonials`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse<Testimonial[]>(response);
}

export async function getPublicTestimonials() {
  const response = await fetch(`${API_BASE_URL}/testimonials/public`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<Testimonial[]>(response);
}

export async function getTestimonial(id: string) {
  const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<Testimonial>(response);
}

export async function updateTestimonial(id: string, data: Partial<Testimonial>) {
  const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Testimonial>(response);
}

export async function publishTestimonial(id: string) {
  const response = await fetch(`${API_BASE_URL}/testimonials/${id}/publish`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  return handleResponse<Testimonial>(response);
}

export async function deleteTestimonial(id: string) {
  const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse<void>(response);
}