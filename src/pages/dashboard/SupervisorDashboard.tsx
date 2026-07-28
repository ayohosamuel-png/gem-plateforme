import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { thesisService } from '../../services/thesis';
import { Thesis } from '../../types';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Sparkles, 
  Clock, 
  Eye, 
  MessageSquare,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { Modal } from '../../components/Modal';

interface SupervisorDashboardProps {
  onNavigate: (page: string, params?: any) => void;
}

export const SupervisorDashboard: React.FC<SupervisorDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [assignedTheses, setAssignedTheses] = useState<Thesis[]>([]);
  const [selectedThesis, setSelectedThesis] = useState<Thesis | null>(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionNotes, setActionNotes] = useState('');
  const [actionType, setActionType] = useState<'validate' | 'reject'>('validate');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    if (!user) return;
    try {
      const list = await thesisService.getTheses({ supervisorId: user.id });
      setAssignedTheses(list);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const pendingTheses = assignedTheses.filter(t => t.status === 'EXAMEN_ENCADREUR' || t.status === 'ANALYSE_IA');
  const validatedTheses = assignedTheses.filter(t => t.status === 'PUBLIÉ' || t.status === 'VALIDÉ_ENCADREUR');

  const handleProcessAction = async () => {
    if (!selectedThesis) return;
    setSubmitting(true);
    try {
      if (actionType === 'validate') {
        await thesisService.validateThesis(selectedThesis.id, actionNotes);
      } else {
        await thesisService.rejectThesis(selectedThesis.id, actionNotes);
      }
      setActionModalOpen(false);
      setSelectedThesis(null);
      setActionNotes('');
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
            alt={user?.fullName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/50"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-white font-serif">{user?.fullName}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-bold">
                Espace Encadreur
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Département: <strong className="text-slate-200">{user?.department || 'Informatique (IFRI)'}</strong> | Université: <strong className="text-slate-200">{user?.university}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-center">
          <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-lg font-black text-amber-400 font-mono">{pendingTheses.length}</div>
            <div className="text-[10px] text-slate-400">En attente d'examen</div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-lg font-black text-emerald-400 font-mono">{validatedTheses.length}</div>
            <div className="text-[10px] text-slate-400">Mémoires Validés</div>
          </div>
        </div>
      </div>

      {/* Pending Theses to Review */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white font-serif flex items-center space-x-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <span>Sujets & Mémoires Soumis pour Examen ({pendingTheses.length})</span>
          </h2>
          <span className="text-xs text-slate-400">Évaluation obligatoire avant publication</span>
        </div>

        {pendingTheses.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-emerald-500 opacity-40" />
            <p className="text-sm">Aucun sujet en attente de validation. Vous êtes à jour !</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingTheses.map((t) => (
              <div
                key={t.id}
                className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 hover:border-indigo-500/30 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-bold text-xs border border-indigo-500/20">
                      {t.filiere}
                    </span>
                    <span className="text-xs text-slate-400">Étudiant: <strong className="text-white">{t.studentName}</strong></span>
                  </div>
                  <span className="text-[11px] font-mono text-amber-400 font-bold">
                    Score Anti-Plagiat IA: {t.similarityScore}%
                  </span>
                </div>

                <h3 className="text-base font-bold text-white font-serif">"{t.title}"</h3>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{t.abstract}</p>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-900">
                  <button
                    onClick={() => onNavigate('plagiarism-report', { thesisId: t.id })}
                    className="text-xs text-amber-400 hover:underline flex items-center space-x-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Examiner le Rapport IA complet</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedThesis(t);
                        setActionType('reject');
                        setActionNotes('');
                        setActionModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition flex items-center space-x-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Demander Corrections</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedThesis(t);
                        setActionType('validate');
                        setActionNotes('Avis très favorable, sujet validé.');
                        setActionModalOpen(true);
                      }}
                      className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold shadow-md transition flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Valider & Publier</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Validated History */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-base font-bold text-white font-serif mb-4 flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Historique des Mémoires Validés</span>
        </h3>

        <div className="space-y-3">
          {validatedTheses.map((t) => (
            <div key={t.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white font-serif">{t.title}</h4>
                <p className="text-[11px] text-slate-400">
                  Étudiant: {t.studentName} | Validé le: {t.validatedAt ? new Date(t.validatedAt).toLocaleDateString('fr-FR') : 'Récemment'}
                </p>
              </div>
              <button
                onClick={() => onNavigate('thesis-details', { id: t.id })}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Validation / Correction Modal */}
      <Modal
        isOpen={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        title={actionType === 'validate' ? 'Validation Officielle du Mémoire' : 'Demande de Corrections Académiques'}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Mémoire : <strong className="text-white">"{selectedThesis?.title}"</strong>
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Remarques / Recommandations de l'Encadreur
            </label>
            <textarea
              rows={4}
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
              placeholder="Saisissez vos observations académiques..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={() => setActionModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
            >
              Annuler
            </button>
            <button
              onClick={handleProcessAction}
              disabled={submitting}
              className={`px-5 py-2 rounded-xl text-xs font-bold shadow-lg transition ${
                actionType === 'validate' 
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  : 'bg-rose-500 hover:bg-rose-400 text-white'
              }`}
            >
              {submitting ? 'Traitement...' : actionType === 'validate' ? 'Confirmer la Validation & Publier' : 'Envoyer la Demande'}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
