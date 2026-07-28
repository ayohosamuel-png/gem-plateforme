import { apiFetch } from './api';
import { ThemeCheckResult, PlagiarismReport, Thesis } from '../types';

export const aiService = {
  async checkTheme(title: string, problematique?: string, objectifs?: string, filiere?: string) {
    const res = await apiFetch<{ data: ThemeCheckResult }>('/api/ai/theme-check', {
      method: 'POST',
      body: JSON.stringify({ title, problematique, objectifs, filiere })
    });
    return res.data;
  },

  async checkPlagiarism(title: string, abstract: string) {
    const res = await apiFetch<{ data: PlagiarismReport }>('/api/ai/plagiarism', {
      method: 'POST',
      body: JSON.stringify({ title, abstract })
    });
    return res.data;
  },

  async askAssistant(message: string, contextType: string = 'GENERAL') {
    const res = await apiFetch<{ reply: string }>('/api/ai/assistant', {
      method: 'POST',
      body: JSON.stringify({ message, contextType })
    });
    return res.reply;
  },

  async smartSearch(query: string) {
    const res = await apiFetch<{ data: { thesis: Thesis; score: number; reason: string }[] }>('/api/ai/search', {
      method: 'POST',
      body: JSON.stringify({ query })
    });
    return res.data;
  }
};
