const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export function getAuthToken(): string | null {
  return localStorage.getItem('skillmappingpro_token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('skillmappingpro_token', token);
}

export function removeAuthToken(): void {
  localStorage.removeItem('skillmappingpro_token');
}

export async function apiRequest<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = API_URL ? `${API_URL}${path}` : path;
  const token = getAuthToken();

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (!(options.body instanceof FormData)) {
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
  }

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid
      removeAuthToken();
    }
    const errorMessage = data.message || data.error || `Request failed with status ${response.status}`;
    const err = new Error(errorMessage);
    (err as any).status = response.status;
    (err as any).data = data;
    throw err;
  }

  return data;
}
