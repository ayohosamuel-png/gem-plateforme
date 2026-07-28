import { db } from '../database/db.js';
import { PaymentTransaction, PaymentMethod } from '../../src/types/index.js';

export class PaymentService {
  static createPayment(data: {
    userId: string;
    userName: string;
    thesisId: string;
    amountFcfa: number;
    paymentMethod: PaymentMethod;
    phoneNumber?: string;
  }): PaymentTransaction {
    const thesis = db.theses.get(data.thesisId);
    if (!thesis) throw new Error('Mémoire introuvable pour l\'achat.');

    const payId = `pay_${Date.now()}`;
    const prefix = data.paymentMethod === 'MTN_MOMO' ? 'MTN-BJ' :
                   data.paymentMethod === 'MOOV_MONEY' ? 'MOOV-BJ' :
                   data.paymentMethod === 'CELTIS_CASH' ? 'CELTIS-BJ' : 'VISA-CARD';

    const ref = `${prefix}-${new Date().getFullYear()}${String(new Date().getMonth()+1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const downloadToken = `dl_tok_${Math.random().toString(36).substring(2, 10)}_${data.thesisId}`;

    const transaction: PaymentTransaction = {
      id: payId,
      userId: data.userId,
      userName: data.userName,
      thesisId: data.thesisId,
      thesisTitle: thesis.title,
      amountFcfa: data.amountFcfa,
      paymentMethod: data.paymentMethod,
      phoneNumber: data.phoneNumber,
      transactionRef: ref,
      status: 'SUCCESS', // Simulation de validation bancaire/USSD instantanée
      paidAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      downloadToken
    };

    db.payments.set(payId, transaction);

    // Increment thesis downloads count
    thesis.downloadsCount += 1;

    // Notification au visiteur
    db.notifications.set(`notif_${Date.now()}`, {
      id: `notif_${Date.now()}`,
      userId: data.userId,
      title: 'Paiement Confirmé - Mémoire Débloqué 💳',
      message: `Votre achat de "${thesis.title.slice(0, 40)}..." (${data.amountFcfa} FCFA) par ${data.paymentMethod} est validé. Votre lien de téléchargement est actif.`,
      type: 'PAYMENT',
      read: false,
      linkUrl: `/dashboard/visitor`,
      createdAt: new Date().toISOString()
    });

    // Audit Log
    db.auditLogs.unshift({
      id: `log_${Date.now()}`,
      userId: data.userId,
      userName: data.userName,
      action: 'PAIEMENT_TRANSACTION',
      module: 'PAYMENT',
      details: `Achat mémoire ${data.thesisId} de ${data.amountFcfa} FCFA via ${data.paymentMethod}`,
      ipAddress: '197.234.221.10',
      timestamp: new Date().toISOString()
    });

    return transaction;
  }

  static getHistory(userId?: string): PaymentTransaction[] {
    const all = Array.from(db.payments.values());
    if (userId) {
      return all.filter(p => p.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static verifyDownloadToken(token: string, thesisId: string): boolean {
    const match = Array.from(db.payments.values()).find(
      p => p.downloadToken === token && p.thesisId === thesisId && p.status === 'SUCCESS'
    );
    return !!match;
  }
}
