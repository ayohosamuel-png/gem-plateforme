import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { paymentService } from '../../services/payment';
import { PaymentTransaction } from '../../types';
import { 
  CreditCard, 
  Download, 
  Search, 
  BookOpen, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface VisitorDashboardProps {
  onNavigate: (page: string, params?: any) => void;
}

export const VisitorDashboard: React.FC<VisitorDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const history = await paymentService.getHistory();
        setPayments(history);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadPayments();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-2xl">
            👤
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-white font-serif">{user?.fullName || 'Espace Visiteur'}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold">
                Lecteur & Acheteur
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Consultez vos achats de mémoires et téléchargez vos documents débloqués
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('theses')}
          className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center space-x-2 shrink-0"
        >
          <Search className="w-4 h-4" />
          <span>Explorer de Nouveaux Mémoires</span>
        </button>
      </div>

      {/* Purchased Theses List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <h2 className="text-base font-bold text-white font-serif flex items-center space-x-2 border-b border-slate-800 pb-3">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <span>Vos Mémoires Débloqués & Téléchargements</span>
        </h2>

        {payments.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm mb-4">Vous n'avez pas encore effectué d'achat de mémoire.</p>
            <button
              onClick={() => onNavigate('theses')}
              className="px-4 py-2 rounded-xl bg-slate-800 text-amber-300 text-xs font-bold hover:bg-slate-700 transition"
            >
              Parcourir le catalogue
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white font-serif">{p.thesisTitle}</h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    Montant : <strong className="text-emerald-400">{p.amountFcfa} FCFA</strong> | Mode : {p.paymentMethod} | Réf : <span className="font-mono text-slate-300">{p.transactionRef}</span>
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <a
                    href={`/api/theses/${p.thesisId}/pdf`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-md transition flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Télécharger PDF</span>
                  </a>

                  <button
                    onClick={() => onNavigate('thesis-details', { id: p.thesisId })}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
