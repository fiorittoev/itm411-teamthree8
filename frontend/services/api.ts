const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function apiFetch(path: string, options = {}) {
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options as any).headers,
    },
  });
}
