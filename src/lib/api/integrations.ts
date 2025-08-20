import { API_BASE_URL, defaultHeaders, handleResponse } from './config';

interface ZapierWebhookData {
  event: string;
  data: any;
}

interface PipedriveLead {
  // Define lead fields
}

interface PipedriveDeal {
  id: string;
  // Define deal fields
}

export async function zapierWebhook(event: string, data: ZapierWebhookData) {
  const response = await fetch(`${API_BASE_URL}/integrations/zapier/webhook/${event}`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(data),
  });
  return handleResponse<void>(response);
}

export async function createPipedriveLead(data: PipedriveLead) {
  const response = await fetch(`${API_BASE_URL}/integrations/pipedrive/leads`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(data),
  });
  return handleResponse<PipedriveLead>(response);
}

export async function updatePipedriveDeal(dealId: string, data: Partial<PipedriveDeal>) {
  const response = await fetch(`${API_BASE_URL}/integrations/pipedrive/deals/${dealId}`, {
    method: 'PATCH',
    headers: defaultHeaders,
    body: JSON.stringify(data),
  });
  return handleResponse<PipedriveDeal>(response);
}