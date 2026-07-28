import React, { useState, useEffect } from 'react';
import { thesisService } from '../../services/thesis';
import { Thesis } from '../../types';
import { 
  GraduationCap, 
  Calendar, 
  User, 
  ShieldCheck, 
  CreditCard, 
  Download, 
  Eye, 
  QrCode, 
  Share2,
  FileText
} from 'lucide-react';

interface ThesisDetailsProps {
  thesisId: string;
  onNavigate: (page: string, params?: any) => void;
}

export const ThesisDetails: React.FC<ThesisDetailsProps> = ({ thesisId, onNavigate }) => {
  const [thesis, setThesis] = useState<Thesis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const data = await thesisService.getThesisById(thesisId);
        setThesis(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [thesisId]);

  if (loading) return <div className="p-12 text-center text-slate-400">Chargement des détails du mémoire...</div>;
  if (!thesis) return <div className="p-12 text-center text-slate-400">Mémoire introuvable.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Main Document Info Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 font-bold text-xs border border-amber-500/30">
              {thesis.filiere}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 font-bold text-xs border border-emerald-500/30 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Statut: {thesis.status}</span>
            </span>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Année Académique : <strong className="text-white">{thesis.academicYear}</strong>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif leading-snug">
          "{thesis.title}"
        </h1>

        {/* Authors & Univ Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
          <div>
            <span className="text-slate-500 block mb-0.5">Auteur (Étudiant) :</span>
            <strong className="text-white text-sm">{thesis.studentName}</strong>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">Encadreur :</span>
            <strong className="text-white text-sm">{thesis.supervisorName}</strong>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">Établissement :</span>
            <strong className="text-amber-400 text-xs">{thesis.university}</strong>
          </div>
        </div>

        {/* Abstract */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider border-l-2 border-amber-500 pl-2">
            Résumé Académique
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed text-justify bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            {thesis.abstract}
          </p>
        </div>

        {/* Keywords & Certificate Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap gap-1.5">
            {thesis.keywords.map((kw, idx) => (
              <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800">
                #{kw}
              </span>
            ))}
          </div>

          {thesis.certificateId && (
            <button
              onClick={() => onNavigate('verify-certificate', { number: thesis.certificateId })}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center space-x-2 hover:bg-cyan-500/20 transition"
            >
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span>Certificat QR #{thesis.certificateId.slice(0, 10)}...</span>
            </button>
          )}
        </div>

        {/* Action Bar (Unlock/Pay / Download PDF) */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 block">Accès Intégral au Document PDF :</span>
            <span className="text-xl font-black text-emerald-400 font-mono">{thesis.priceFcfa} FCFA</span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('payment', { thesisId: thesis.id })}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-xl shadow-amber-500/20 transition flex items-center justify-center space-x-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Acheter & Télécharger (MoMo / Carte)</span>
            </button>
          </div>
        </div>

      </div>

      {/* PDF Document Preview Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white font-serif">Aperçu du Document PDF</h3>
          </div>
          <a
            href={`/api/theses/${thesis.id}/pdf`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-amber-400 hover:underline font-bold"
          >
            Ouvrir plein écran ↗
          </a>
        </div>

        <div className="w-full h-[600px] rounded-xl overflow-hidden border border-slate-800 bg-white">
          <iframe
            src={`/api/theses/${thesis.id}/pdf`}
            title={thesis.title}
            className="w-full h-full border-none"
          />
        </div>
      </div>

    </div>
  );
};
