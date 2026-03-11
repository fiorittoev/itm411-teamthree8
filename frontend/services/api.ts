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

export interface SearchItemResult {
  id: string;
  name: string;
  price: string;
  description: string;
  category: string;
  image: string;
  owner_id: string;
  owner_username: string;
  created_at: string;
}

export interface SearchUserResult {
  id: string;
  username: string;
  bio: string;
  profile_image_url: string;
  address: string;
}

export interface SearchCommunityResult {
  id: string;
  name: string;
  description: string;
  lake_name: string;
  member_count: number;
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
  
  // Search endpoints
  search: {
    items: (q: string, communityId?: string, limit?: number) => {
      let path = `/search/items?q=${encodeURIComponent(q)}`;
      if (communityId) path += `&community_id=${communityId}`;
      if (limit) path += `&limit=${limit}`;
      return request<SearchItemResult[]>('GET', path);
    },
    users: (q: string, communityId?: string, limit?: number) => {
      let path = `/search/users?q=${encodeURIComponent(q)}`;
      if (communityId) path += `&community_id=${communityId}`;
      if (limit) path += `&limit=${limit}`;
      return request<SearchUserResult[]>('GET', path);
    },
    communities: (q: string, limit?: number) => {
      let path = `/search/communities?q=${encodeURIComponent(q)}`;
      if (limit) path += `&limit=${limit}`;
      return request<SearchCommunityResult[]>('GET', path);
    },
  },
};