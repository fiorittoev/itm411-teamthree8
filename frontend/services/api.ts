// api.ts
import { supabase } from './supabase';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface PostOut {
  id: string;
  title: string;
  content: string;
  post_type: string;
  created_at: string;
  author_id: string;
  author_username: string;
}

export interface ItemOut {
  id: string;
  name: string;
  price: string;
  description: string;
  category: string;
  image: string; // base64 data-URI
  owner_id: string;
  owner_username: string;
  created_at: string;
}

// ── Auth header helper ────────────────────────────────────────────────────────
async function authHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Not authenticated');

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

// ── Core fetch ────────────────────────────────────────────────────────────────
async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const headers = await authHeader();

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  let json: any;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (!res.ok) {
    throw new Error(json?.detail ?? `HTTP ${res.status}`);
  }
  return json as T;
}

// ── Public API ────────────────────────────────────────────────────────────────
export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
  delete: (path: string) => request<void>('DELETE', path),
};