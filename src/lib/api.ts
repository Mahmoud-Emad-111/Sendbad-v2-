export const API_BASE = 'https://www.backend.sindbad.om/public/api';
// export const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export async function apiFetch(path: string, opts: RequestInit = {}) {
  const isAbsolute = /^https?:\/\//i.test(path);
  const base = API_BASE.replace(/\/+$/, '');
  const p = isAbsolute ? path : String(path).replace(/^\/+/, '');
  const url = isAbsolute ? path : `${base}/${p}`;

  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

export async function apiFetchAuth(path: string, token?: string, opts: RequestInit = {}) {
  const headers = new Headers(opts.headers || {});
  const t = token || (typeof window !== 'undefined' ? localStorage.getItem('api_token') : undefined);
  if (t) headers.set('Authorization', `Bearer ${t}`);
  return apiFetch(path, { ...opts, headers });
}
