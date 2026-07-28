import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { thesisService } from '../../services/thesis';
import { 
  GraduationCap, 
  Upload, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface SubmitThesisProps {
  onNavigate: (page: string, params?: any) => void;
}

export const SubmitThesis: React.FC<SubmitThesisProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [filiere, setFiliere] = useState('Génie Informatique & Systèmes d\'Information');
  const [keywords, setKeywords] = useState('IA, Cloudflare, Sécurité, Bénin');
  const [supervisorName, setSupervisorName] = useState('Prof. Houessou Gabriel');
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [pdfFileName, setPdfFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !abstract) {
      setError('Veuillez remplir le titre et le résumé.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const thesis = await thesisService.submitThesis({
        title,
        abstract,
        filiere,
        keywords: keywords.split(',').map(k => k.trim()),
        supervisorId: 'usr_supervisor_1',
        supervisorName,
        academicYear,
        pdfUrl: `/storage/r2/pdfs/${Date.now()}_${pdfFileName || 'memoire.pdf'}`,
        pdfSizeMb: 4.2
      });

      onNavigate('plagiarism-report', { thesisId: thesis.id });
    } catch (err: any) {
      setError(err.message || 'Erreur lors du dépôt.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
        
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2 text-amber-400 mb-1">
            <GraduationCap className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-wider">Formulaire Officiel de Dépôt</span>
          </div>
          <h1 className="text-2xl font-bold text-white font-serif">Soumettre votre Mémoire de Fin d'Études</h1>
          <p className="text-xs text-slate-400 mt-1">
            Le document sera téléversé dans le bucket Cloudflare R2 et soumis à l'analyse anti-plagiat Gemini AI.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Titre Définitif du Mémoire
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex: Conception et implémentation d'une infrastructure IA sur Cloudflare Workers..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Filière / Spécialité</label>
              <select
                value={filiere}
                onChange={(e) => setFiliere(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs"
              >
                <option value="Génie Informatique & Systèmes d'Information">Génie Informatique & SI</option>
                <option value="Informatique de Gestion & Sécurité SI">Informatique de Gestion</option>
                <option value="Finance, Banque & Microfinance">Finance & Microfinance</option>
                <option value="Droit du Numérique & Cybersécurité">Droit du Numérique</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Année Académique</label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Encadreur Assigné
            </label>
            <input
              type="text"
              value={supervisorName}
              onChange={(e) => setSupervisorName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Résumé Académique (Abstract)
            </label>
            <textarea
              rows={5}
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Présentez brièvement la problématique, les objectifs, la méthodologie et les résultats clés..."
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Mots-clés (séparés par des virgules)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
            />
          </div>

          {/* Cloudflare R2 Upload box */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Document PDF du Mémoire (Stockage Cloudflare R2)
            </label>
            <div className="border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 text-center bg-slate-950 transition cursor-pointer relative">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 mx-auto text-amber-400 mb-2" />
              <p className="text-xs font-bold text-slate-200">
                {pdfFileName ? `PDF Sélectionné: ${pdfFileName}` : 'Cliquez ou glissez-déposez le fichier PDF ici'}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">Taille maximale : 50 Mo | Format PDF uniquement</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-xl shadow-amber-500/20 transition flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <span>Téléversement R2 & Analyse IA Gemini en cours...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Soumettre & Lancer l'Analyse IA</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
