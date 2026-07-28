import { apiFetch } from './api';
import { User, UserRole } from '../types';

export const authService = {
  async login(email: string, pass: string) {
    const res = await apiFetch<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: pass })
    });
    localStorage.setItem('imhotep_token', res.token);
    return res.user;
  },

  async register(data: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    university?: string;
    filiere?: string;
    niveau?: 'Licence' | 'Master' | 'Doctorat';
    matricule?: string;
    phone?: string;
  }) {
    const res = await apiFetch<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    localStorage.setItem('imhotep_token', res.token);
    return res.user;
  },

  async getMe() {
    const res = await apiFetch<{ user: User }>('/api/auth/me');
    return res.user;
  },

  logout() {
    localStorage.removeItem('imhotep_token');
  }
};
