import { apiFetch } from './api';
import { PaymentTransaction, PaymentMethod } from '../types';

export const paymentService = {
  async createPayment(data: {
    thesisId: string;
    amountFcfa: number;
    paymentMethod: PaymentMethod;
    phoneNumber?: string;
  }) {
    const res = await apiFetch<{ data: PaymentTransaction }>('/api/payments/create', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.data;
  },

  async getHistory() {
    const res = await apiFetch<{ data: PaymentTransaction[] }>('/api/payments/history');
    return res.data;
  }
};
