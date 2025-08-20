import { User } from '../types';
import { API_BASE_URL, defaultHeaders, handleResponse, getAuthHeaders } from './config';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    phone?: string;
  };
}

interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export async function login(data: LoginCredentials) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(data),
  });
  return handleResponse<LoginResponse>(response);
}

// Alias pour compatibilité avec AuthContext
export const apiLogin = login;

export async function register(data: RegisterDto) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(data),
  });
  return handleResponse<User>(response);
}

export async function getProfile(token?: string) {
  const headers = token 
    ? { ...defaultHeaders, Authorization: `Bearer ${token}` }
    : getAuthHeaders();
    
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: 'GET',
    headers,
  });
  return handleResponse<User>(response);
}

// Fonction pour vérifier si le token est valide
export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    await getProfile(token);
    return true;
  } catch (error) {
    return false;
  }
};

// Fonction de déconnexion (côté serveur si nécessaire)
export const apiLogout = async (token?: string): Promise<void> => {
  try {
    const headers = token 
      ? { ...defaultHeaders, Authorization: `Bearer ${token}` }
      : getAuthHeaders();
      
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers,
    });
  } catch (error) {
    // Ignorer les erreurs de déconnexion côté serveur
    console.warn('Erreur lors de la déconnexion côté serveur:', error);
  } finally {
    // Always remove tokens from localStorage
    localStorage.removeItem('admin_token');
  }
};