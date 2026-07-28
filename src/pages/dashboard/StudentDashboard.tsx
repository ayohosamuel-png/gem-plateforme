import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { thesisService } from '../../services/thesis';
import { Thesis } from '../../types';
import { 
  GraduationCap, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  QrCode, 
  PlusCircle, 
  Eye, 
  Download,
  BookOpen
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (page: string, params?: any) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudentData = async () => {
      if (!user) return;
      try {
        const list = await thesisService.getTheses({ studentId: user.id });
        setTheses(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadStudentData();
  }, [user]);

  const activeThesis = theses[0]; // Most recent

  const statusSteps = [
    { key: 'DÉPOSÉ', label: '1. Dépôt Initial' },
    { key: 'ANALYSE_IA', label: '2. Analyse Anti-Plagiat IA' },
    { key: 'EXAMEN_ENCADREUR', label: '3. Examen Encadreur' },
    { key: 'PUBLIÉ', label: '4. Validation & Publication' }
  ];

  const getStepStatus = (stepKey: string, currentStatus: string) => {
    const statusOrder = ['DÉPOSÉ', 'ANALYSE_IA', 'EXAMEN_ENCADREUR', 'VALIDÉ_ENCADREUR', 'PUBLIÉ'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (currentStatus === 'CORRECTION_REQUISE') {
      return stepKey === 'EXAMEN_ENCADREUR' ? 'warning' : stepIndex < 2 ? 'completed' : 'pending';
    }

    if (currentIndex >= stepIndex) return 'completed';
    return 'pending';
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={user?.fullName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/50"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-white font-serif">{user?.fullName}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                Espace Déposant
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Filière : <strong className="text-slate-200">{user?.filiere}</strong> | Matricule : <strong className="font-mono text-amber-400">{user?.matricule}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('submit-thesis')}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition flex items-center space-x-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Déposer un Nouveau Mémoire</span>
        </button>
      </div>

      {/* Active Submission Lifecycle Stepper */}
      {activeThesis && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Suivi en temps réel de votre dépôt</span>
              <h2 className="text-lg font-bold text-white font-serif mt-0.5">"{activeThesis.title}"</h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
              Statut: {activeThesis.status}
            </span>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
            {statusSteps.map((s, idx) => {
              const state = getStepStatus(s.key, activeThesis.status);
              return (
                <div
                  key={s.key}
                  className={`p-4 rounded-xl border transition ${
                    state === 'completed'
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                      : state === 'warning'
                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold">{s.label}</span>
                    {state === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : state === 'warning' ? (
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                  <p className="text-[11px] opacity-80">
                    {s.key === 'ANALYSE_IA' && activeThesis.similarityScore !== undefined
                      ? `Score similitude: ${activeThesis.similarityScore}%`
                      : s.key === 'EXAMEN_ENCADREUR'
                      ? `Encadreur: ${activeThesis.supervisorName}`
                      : 'Étape automatique'}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Supervisor Notes Alert */}
          {activeThesis.supervisorNotes && (
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-200">
              <strong className="text-indigo-300 block mb-1">💬 Remarques de l'Encadreur ({activeThesis.supervisorName}) :</strong>
              "{activeThesis.supervisorNotes}"
            </div>
          )}

          {/* Quick Action bar for Active Thesis */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigate('plagiarism-report', { thesisId: activeThesis.id })}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300 border border-slate-700 transition flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Consulter le Rapport Anti-Plagiat IA</span>
            </button>

            {activeThesis.certificateId && (
              <button
                onClick={() => onNavigate('verify-certificate', { number: activeThesis.certificateId })}
                className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-xs font-bold text-emerald-300 border border-emerald-500/40 transition flex items-center space-x-2"
              >
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>Télécharger le Certificat Numérique QR</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* History of Submissions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-base font-bold text-white font-serif mb-4 flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <span>Historique de vos Dépôts de Mémoire</span>
        </h3>

        {theses.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p className="text-sm mb-4">Vous n'avez pas encore déposé de mémoire.</p>
            <button
              onClick={() => onNavigate('submit-thesis')}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition"
            >
              Créer mon premier dépôt
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {theses.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-bold text-white font-serif">{t.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">
                      {t.academicYear}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Encadreur: {t.supervisorName} | Date: {new Date(t.submittedAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 text-amber-300 text-xs font-bold border border-slate-700">
                    {t.status}
                  </span>
                  <button
                    onClick={() => onNavigate('thesis-details', { id: t.id })}
                    className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                    title="Voir le mémoire"
                  >
                    <Eye className="w-4 h-4" />
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
