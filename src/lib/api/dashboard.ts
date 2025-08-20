import { API_BASE_URL,defaultHeaders, handleResponse } from './config'

const DASHBOARD_API_BASE_URL = API_BASE_URL;

export interface DashboardStats {
  formations: {
    total: number;
    published: number;
  };
  posts: {
    total: number;
    published: number;
  };
  registrations: {
    total: number;
    confirmed: number;
    pending: number;
  };
}

export interface ChartData {
  month: string;
  registrations: number;
  confirmations: number;
}

export interface CategoryData {
  category: string;
  count: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await fetch(`${DASHBOARD_API_BASE_URL}/dashboard/stats`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<DashboardStats>(response);
}

export async function getDashboardChartData(): Promise<ChartData[]> {
  const response = await fetch(`${DASHBOARD_API_BASE_URL}/dashboard/chart-data`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<ChartData[]>(response);
}

export async function getRegistrationsByCategory(): Promise<CategoryData[]> {
  const response = await fetch(`${DASHBOARD_API_BASE_URL}/dashboard/registrations-by-category`, {
    method: 'GET',
    headers: defaultHeaders,
  });
  return handleResponse<CategoryData[]>(response);
}