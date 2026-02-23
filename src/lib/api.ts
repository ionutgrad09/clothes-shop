const BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

function headers(extra: Record<string, string> = {}) {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: headers(options?.headers as Record<string, string>),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  auth: {
    register: (email: string, password: string, name: string) =>
      req<{ user: any; token: string }>('/auth-register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      }),
    login: (email: string, password: string) =>
      req<{ user: any; token: string }>('/auth-login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    me: () => req<{ user: any }>('/auth-me'),
  },
  products: {
    list: (search?: string, category?: string) => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      return req<{ products: any[] }>(`/products-list?${params}`);
    },
    get: (id: string) => req<{ product: any }>(`/products-get?id=${id}`),
    create: (data: any) =>
      req<{ product: any }>('/products-create', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      req<{ product: any }>('/products-update', { method: 'PUT', body: JSON.stringify({ id, ...data }) }),
    delete: (id: string) =>
      req<{ success: boolean }>('/products-delete', { method: 'DELETE', body: JSON.stringify({ id }) }),
  },
  orders: {
    create: (items: any[], shipping_address: string) =>
      req<{ order: any }>('/orders-create', {
        method: 'POST',
        body: JSON.stringify({ items, shipping_address }),
      }),
    list: () => req<{ orders: any[] }>('/orders-list'),
    adminList: () => req<{ orders: any[] }>('/orders-admin-list'),
  },
};
