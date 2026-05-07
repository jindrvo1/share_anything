import api from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'HELPER' | 'ADMIN';
  bio?: string;
  location?: string;
}

// NOTE: Tokens are stored in localStorage for simplicity in this local app.
// In a production environment, prefer httpOnly cookies to reduce XSS exposure.
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function setToken(token: string) {
  localStorage.setItem('token', token);
}

export function removeToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
}

export function setUser(user: User) {
  localStorage.setItem('user', JSON.stringify(user));
}

export async function login(email: string, password: string) {
  const res = await api.post('/auth/login', { email, password });
  setToken(res.data.access_token);
  setUser(res.data.user);
  return res.data;
}

export async function logout() {
  removeToken();
}
