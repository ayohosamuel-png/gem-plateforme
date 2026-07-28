import React, { useState } from 'react';
import { aiService } from '../../services/ai';
import { ThemeCheckResult } from '../../types';
import { 
  Sparkles, 
  Bot, 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  Lightbulb, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const ThemeChecker: React.FC = () => {
  const [title, setTitle] = useState('');
  const [problematique, setProblematique] = useState('');
  const [objectifs, setObjectifs] = useState('');
  const [filiere, setFiliere] = useState('Génie Informatique & Systèmes d\'Information');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ThemeCheckResult | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setLoading(true);
    try {
      const res = await aiService.checkTheme(title, problematique, objectifs, filiere);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-white font-serif">Vérificateur de Thème IA Gemini</h1>
        <p className="text-xs text-slate-400">
          Évaluez la pertinence, la faisabilité et le risque de duplication de votre sujet de mémoire avant la soumission officielle.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white font-serif border-b border-slate-800 pb-3 flex items-center space-x-2">
            <Bot className="w-5 h-5 text-amber-400" />
            <span>Formulaire du Sujet Proposé</span>
          </h2>

          <form onSubmit={handleCheck} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Titre Provisoire du Mémoire
              </label>
              <textarea
                rows={2}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ex: Sécurisation des transactions Mobile Money par Intelligence Artificielle..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Filière / Spécialité</label>
              <select
                value={filiere}
                onChange={(e) => setFiliere(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
              >
                <option value="Génie Informatique & Systèmes d'Information">Génie Informatique & SI</option>
                <option value="Informatique de Gestion & Sécurité SI">Informatique de Gestion</option>
                <option value="Finance, Banque & Microfinance">Finance & Microfinance</option>
                <option value="Droit du Numérique & Cybersécurité">Droit du Numérique</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Problématique Principale (Optionnel)
              </label>
              <textarea
                rows={2}
                value={problematique}
                onChange={(e) => setProblematique(e.target.value)}
                placeholder="Quel est le problème scientifique ou technique à résoudre ?"
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Analyse Sémantique Gemini en cours...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyser le Sujet</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* AI Result Card */}
        <div className="lg:col-span-6 space-y-4">
          {!result ? (
            <div className="h-full bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center text-slate-500">
              <Bot className="w-12 h-12 mb-3 opacity-30 text-amber-400" />
              <p className="text-xs">Renseignez votre sujet et lancez l'analyse pour visualiser le rapport de similitude Gemini.</p>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-5 animate-in fade-in duration-300">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-300 font-serif">Verdict de l'Intelligence Artificielle</span>
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                  result.similarityScore > 50 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  Risque: {result.duplicationRisk} ({result.similarityScore}%)
                </span>
              </div>

              {/* Analysis Text */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Diagnostic Sémantique</h4>
                <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {result.analysis}
                </p>
              </div>

              {/* Similar Existing Themes */}
              {result.similarThemes.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center space-x-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Sujets Semblables Déjà Traités dans la Base</span>
                  </h4>
                  <div className="space-y-1.5">
                    {result.similarThemes.map((st, i) => (
                      <div key={i} className="text-[11px] p-2 rounded-lg bg-slate-950 text-slate-300 border border-slate-800">
                        • {st}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Improvement Suggestions */}
              {result.suggestions.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center space-x-1">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Reformulations Recommandées par l'IA</span>
                  </h4>
                  <div className="space-y-1.5">
                    {result.suggestions.map((s, i) => (
                      <div key={i} className="text-[11px] p-2 rounded-lg bg-emerald-500/10 text-emerald-200 border border-emerald-500/20">
                        💡 {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>

    </div>
  );
};
