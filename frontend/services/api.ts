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
  author_is_business?: boolean;
  author_business_name?: string;
  author_profile_image_url?: string;
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
  owner_is_business?: boolean;
  owner_business_name?: string;
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
  owner_is_business?: boolean;
  owner_business_name?: string;
  created_at: string;
}

export interface SearchUserResult {
  id: string;
  username: string;
  bio: string;
  profile_image_url: string;
  address: string;
  is_business?: boolean;
  business_name?: string;
}

export interface SearchCommunityResult {
  id: string;
  name: string;
  description: string;
  lake_name: string;
  member_count: number;
}

export interface AdOut {
  id: string;
  title: string;
  body: string;
  ad_type: 'post' | 'marketplace';
  image?: string;
  link_url?: string;
  status: string;
  owner_username: string;
  business_name?: string;
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
  patch: <T>(path: string, body: unknown) => request<T>('PATCH', path, body),
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
  // Add to your api object:
    connections: {
      list:       (q?: string) =>
        api.get<ConnectionProfile[]>(`/connections${q ? `?q=${encodeURIComponent(q)}` : ''}`),
      requests:   () =>
        api.get<ConnectionProfile[]>('/connections/requests'),
      status:     (userId: string) =>
        api.get<{ status: ConnectionStatus }>(`/connections/status/${userId}`),
      send:       (userId: string) =>
        api.post<{ status: string }>(`/connections/${userId}`, {}),
      respond: (userId: string, action: 'accept' | 'decline') =>
        api.patch<{ status: string }>(`/connections/${userId}?action=${action}`, {}),
      remove:     (userId: string) =>
        api.delete(`/connections/${userId}`),
    },
    messages: {
      list: () => api.get<ConversationOut[]>('/messages'),
      get: (userId: string) => api.get<MessageOut[]>(`/messages/${userId}`),
      send: (userId: string, content: string) => api.post<MessageOut>(`/messages/${userId}`, { content }),
    },
    ads: {
      submit: (body: { title: string; body: string; ad_type?: string; image?: string; link_url?: string }) =>
        api.post<AdOut>('/ads', body),
      listApproved: () => api.get<AdOut[]>('/ads'),
      listMine: () => api.get<AdOut[]>('/ads/mine'),
    },
};

export interface MessageOut {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export interface ConversationOut {
  other_user_id: string;
  other_username: string;
  profile_image_url: string;
  latest_message: MessageOut;
}

export interface ConnectionProfile {
  id: string;
  username: string;
  bio: string;
  address: string;
  profile_image_url: string;
  is_business?: boolean;
  business_name?: string;
}

export type ConnectionStatus = 
  | 'none' 
  | 'pending_sent' 
  | 'pending_received' 
  | 'accepted';

