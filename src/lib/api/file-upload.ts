import { API_BASE_URL, defaultHeaders, handleResponse } from './config';

interface FileUploadResponse {
  url: string;
}

export async function uploadSingleFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_BASE_URL}/file-upload/single`, {
    method: 'POST',
    body: formData,
  });
  return handleResponse<FileUploadResponse>(response);
}

export async function uploadMultipleFiles(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  const response = await fetch(`${API_BASE_URL}/file-upload/multiple`, {
    method: 'POST',
    body: formData,
  });
  return handleResponse<FileUploadResponse[]>(response);
}

export async function getPresignedUrl(data: { filename: string; contentType: string }) {
  const response = await fetch(`${API_BASE_URL}/file-upload/presigned-url`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(data),
  });
  return handleResponse<{ url: string; key: string }>(response);
}