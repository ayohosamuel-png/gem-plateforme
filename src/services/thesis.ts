import { apiFetch } from './api';
import { Thesis, ThesisStatus } from '../types';

export const thesisService = {
  async getTheses(filters?: {
    filiere?: string;
    year?: string;
    status?: ThesisStatus;
    search?: string;
    publicOnly?: boolean;
    studentId?: string;
    supervisorId?: string;
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== '') params.append(k, String(v));
      });
    }
    const res = await apiFetch<{ data: Thesis[] }>(`/api/theses?${params.toString()}`);
    return res.data;
  },

  async getThesisById(id: string) {
    const res = await apiFetch<{ data: Thesis }>(`/api/theses/${id}`);
    return res.data;
  },

  async submitThesis(data: Partial<Thesis>) {
    const res = await apiFetch<{ data: Thesis }>('/api/theses', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.data;
  },

  async validateThesis(id: string, notes?: string) {
    const res = await apiFetch<{ data: Thesis }>(`/api/theses/${id}/validate`, {
      method: 'POST',
      body: JSON.stringify({ notes })
    });
    return res.data;
  },

  async rejectThesis(id: string, reason: string) {
    const res = await apiFetch<{ data: Thesis }>(`/api/theses/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
    return res.data;
  }
};
