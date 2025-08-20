/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/config.ts
export const API_BASE_URL: string = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Function to get headers with authentication token
export const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const defaultHeaders = {
  'Content-Type': 'application/json',
  // Add authentication headers if needed, e.g., Authorization: `Bearer ${token}`
};

export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP error! Status: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join(', ');
        } else {
          errorMessage = errorData.message;
        }
      }
    } catch (e) {
      // Si on ne peut pas parser la réponse JSON, on garde le message par défaut
    }
    const error = new Error(errorMessage);
    (error as any).response = { data: { message: errorMessage }, status: response.status };
    throw error;
  }
  
  // Vérifier si la réponse a du contenu
  const contentLength = response.headers.get('content-length');
  const contentType = response.headers.get('content-type');
  
  // Si pas de contenu ou contenu vide, retourner undefined
  if (contentLength === '0' || (!contentType?.includes('application/json') && !contentLength)) {
    return undefined as T;
  }
  
  // Essayer de parser le JSON, retourner undefined si échec
  try {
    return await response.json();
  } catch (e) {
    return undefined as T;
  }
}