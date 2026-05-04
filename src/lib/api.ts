const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://backendcs10dbs-production.up.railway.app';


export interface UserSession {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  balance: number;
  token: string;
}

export function saveSession(data: UserSession): void {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data));
}

export function getSession(): UserSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as UserSession) : null;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function clearSession(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}


export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<{ success: boolean; message: string; payload: T }> {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  let json;
  try {
    const text = await res.text();
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { message: `Unable to parse response: ${res.status}` };
  }

  if (!res.ok) {
    throw new Error(json?.message ?? `HTTP ${res.status}`);
  }

  return json;
}