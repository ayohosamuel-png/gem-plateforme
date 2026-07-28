import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { thesisService } from '../../services/thesis';
import { paymentService } from '../../services/payment';
import { Thesis, PaymentMethod } from '../../types';
import { 
  CreditCard, 
  Smartphone, 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  Lock, 
  ArrowRight 
} from 'lucide-react';

interface PaymentProps {
  thesisId: string;
  onNavigate: (page: string, params?: any) => void;
}

export const Payment: React.FC<PaymentProps> = ({ thesisId, onNavigate }) => {
  const { user } = useAuth();
  const [thesis, setThesis] = useState<Thesis | null>(null);
  const [method, setMethod] = useState<PaymentMethod>('MTN_MOMO');
  const [phone, setPhone] = useState('+229 97 00 11 22');
  const [submitting, setSubmitting] = useState(false);
  const [successTx, setSuccessTx] = useState<any>(null);

  useEffect(() => {
    const loadThesis = async () => {
      try {
        const t = await thesisService.getThesisById(thesisId);
        setThesis(t);
      } catch (err) {
        console.error(err);
      }
    };
    loadThesis();
  }, [thesisId]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thesis) return;
    setSubmitting(true);

    try {
      const tx = await paymentService.createPayment({
        thesisId: thesis.id,
        amountFcfa: thesis.priceFcfa,
        paymentMethod: method,
        phoneNumber: phone
      });
      setSuccessTx(tx);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!thesis) return <div className="p-12 text-center text-slate-400">Chargement des données de paiement...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
        
        <div className="text-center border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-2">
            <CreditCard className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white font-serif">Paiement Sécurisé Mobile Money</h1>
          <p className="text-xs text-slate-400 mt-1">Déblocage immédiat de l'accès intégral au document PDF</p>
        </div>

        {/* Order Details */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
          <div className="flex justify-between text-slate-400">
            <span>Mémoire :</span>
            <strong className="text-white text-right max-w-xs truncate">"{thesis.title}"</strong>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Auteur :</span>
            <strong className="text-white">{thesis.studentName}</strong>
          </div>
          <div className="flex justify-between text-slate-400 border-t border-slate-900 pt-2 font-bold">
            <span className="text-slate-200">Montant Total :</span>
            <span className="text-emerald-400 text-sm font-mono">{thesis.priceFcfa} FCFA</span>
          </div>
        </div>

        {!successTx ? (
          <form onSubmit={handlePay} className="space-y-5">
            
            {/* Method Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Choisissez votre mode de paiement</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'MTN_MOMO', label: 'MTN MoMo', color: 'border-yellow-500/40 text-yellow-400' },
                  { id: 'MOOV_MONEY', label: 'Moov Money', color: 'border-blue-500/40 text-blue-400' },
                  { id: 'CELTIS_CASH', label: 'Celtis Cash', color: 'border-purple-500/40 text-purple-400' },
                  { id: 'VISA_CARD', label: 'Carte Visa/MC', color: 'border-emerald-500/40 text-emerald-400' },
                ].map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setMethod(m.id as PaymentMethod)}
                    className={`py-3 px-2 rounded-xl text-xs font-bold border transition text-center ${
                      method === m.id
                        ? `bg-slate-950 ${m.color} ring-2 ring-amber-500`
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {method !== 'VISA_CARD' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Numéro de Téléphone {method.replace('_', ' ')}
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+229 97 00 11 22"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-xs shadow-xl transition flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <span>Validation USSD en cours...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Payer {thesis.priceFcfa} FCFA & Débloquer</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-white font-serif">Paiement Validé avec Succès !</h3>
            <p className="text-xs text-slate-300">
              Référence de transaction : <strong className="font-mono text-amber-400">{successTx.transactionRef}</strong>
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`/api/theses/${thesis.id}/pdf`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg transition flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger le Mémoire PDF</span>
              </a>

              <button
                onClick={() => onNavigate('dashboard-visitor')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
              >
                Accéder à mon espace
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
