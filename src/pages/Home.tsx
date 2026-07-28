import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  Bot, 
  QrCode, 
  ArrowRight, 
  FileCheck, 
  Users, 
  TrendingUp,
  Download,
  Eye,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { thesisService } from '../services/thesis';
import { aiService } from '../services/ai';
import { Thesis, ThemeCheckResult } from '../types';

interface HomeProps {
  onNavigate: (page: string, params?: any) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [recentTheses, setRecentTheses] = useState<Thesis[]>([]);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickFiliere, setQuickFiliere] = useState('Génie Informatique & Systèmes d\'Information');
  const [quickCheckLoading, setQuickCheckLoading] = useState(false);
  const [quickResult, setQuickResult] = useState<ThemeCheckResult | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await thesisService.getTheses({ publicOnly: true });
        setRecentTheses(data.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  const handleQuickThemeCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    setQuickCheckLoading(true);
    try {
      const res = await aiService.checkTheme(quickTitle, '', '', quickFiliere);
      setQuickResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setQuickCheckLoading(false);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-16 pb-20 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(245,158,11,0.08),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Plateforme Nationale de Valorisation des Mémoires Académiques</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight text-white leading-none">
                L'Excellence Académique
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl font-light leading-relaxed">
                <strong>Mémoire Universitaire</strong> est le système électronique de référence pour la gestion, la vérification anti-plagiat, la validation par les encadreurs et la certification par QR Code des mémoires d'étudiants en Afrique de l'Ouest.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onNavigate('theses')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 transition flex items-center justify-center space-x-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Explorer le Catalogue des Mémoires</span>
                </button>

                <button
                  onClick={() => onNavigate('theme-check')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm transition flex items-center justify-center space-x-2"
                >
                  <Bot className="w-4 h-4 text-amber-400" />
                  <span>Tester mon Sujet avec l'IA</span>
                </button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800/80">
                <div>
                  <div className="text-2xl font-black text-amber-400 font-mono">1 240+</div>
                  <div className="text-xs text-slate-400">Mémoires Archivés</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">98.4%</div>
                  <div className="text-xs text-slate-400">Précision Anti-Plagiat IA</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-cyan-400 font-mono">100%</div>
                  <div className="text-xs text-slate-400">QR Code Certifié</div>
                </div>
              </div>

            </div>

            {/* Quick Theme Check Widget Card */}
            <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-serif">Vérificateur Rapide de Thème IA</h3>
                  <p className="text-xs text-slate-400">Testez l'originalité de votre titre en 2 secondes</p>
                </div>
              </div>

              <form onSubmit={handleQuickThemeCheck} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Titre du Mémoire Proposé
                  </label>
                  <input
                    type="text"
                    value={quickTitle}
                    onChange={(e) => setQuickTitle(e.target.value)}
                    placeholder="ex: Application mobile d'apprentissage avec IA..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Filière / Domaine d'Étude
                  </label>
                  <select
                    value={quickFiliere}
                    onChange={(e) => setQuickFiliere(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Génie Informatique & Systèmes d'Information">Génie Informatique & SI</option>
                    <option value="Informatique de Gestion & Sécurité SI">Informatique de Gestion</option>
                    <option value="Finance, Banque & Microfinance">Finance & Microfinance</option>
                    <option value="Droit du Numérique & Cybersécurité">Droit du Numérique</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={quickCheckLoading}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
                >
                  {quickCheckLoading ? (
                    <span>Analyse Gemini en cours...</span>
                  ) : (
                    <>
                      <Bot className="w-4 h-4" />
                      <span>Analyser le Sujet avec l'IA</span>
                    </>
                  )}
                </button>
              </form>

              {/* Quick Result Preview */}
              {quickResult && (
                <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-amber-500/30 text-xs space-y-2 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">Score de Similarité:</span>
                    <span className={`px-2 py-0.5 rounded font-mono font-bold ${
                      quickResult.similarityScore > 50 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {quickResult.similarityScore}% ({quickResult.duplicationRisk})
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-2">
                    {quickResult.analysis}
                  </p>
                  <button
                    onClick={() => onNavigate('theme-check')}
                    className="text-amber-400 font-bold hover:underline text-[11px] block text-right w-full"
                  >
                    Voir le rapport complet & suggestions IA →
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* Main Features Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-white font-serif mb-3">
            Fonctionnalités Clés de Mémoire Universitaire
          </h2>
          <p className="text-slate-400 text-sm">
            Une suite d'outils intelligents conçue pour automatiser tout le cycle de vie d'un mémoire académique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 font-serif">1. Vérification de Thème IA</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              L'IA Gemini évalue le titre, la problématique et les objectifs pour prévenir la duplication et guider la formulation académique.
            </p>
            <button
              onClick={() => onNavigate('theme-check')}
              className="text-amber-400 text-xs font-bold hover:underline inline-flex items-center space-x-1"
            >
              <span>Tester un thème</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 font-serif">2. Anti-Plagiat & Similitude</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Analyse complète du contenu PDF, détection des citations directs, paraphrases et génération automatique d'un rapport explicatif.
            </p>
            <button
              onClick={() => onNavigate('plagiarism-report')}
              className="text-emerald-400 text-xs font-bold hover:underline inline-flex items-center space-x-1"
            >
              <span>Voir un exemple de rapport</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 font-serif">3. Assistant Académique IA</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Copilote intelligent aidant l'étudiant à formaliser son plan de rédaction, sa méthodologie et la revue de littérature.
            </p>
            <button
              onClick={() => onNavigate('ai-assistant')}
              className="text-indigo-400 text-xs font-bold hover:underline inline-flex items-center space-x-1"
            >
              <span>Ouvrir l'assistant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 font-serif">4. Certificats par QR Code</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Chaque mémoire validé génère un certificat d'authenticité numérique infalsifiable vérifiable par scan instantané.
            </p>
            <button
              onClick={() => onNavigate('verify-certificate')}
              className="text-cyan-400 text-xs font-bold hover:underline inline-flex items-center space-x-1"
            >
              <span>Vérifier un QR Code</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* Recent Published Theses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white font-serif">Mémoires Récemment Publiés</h2>
            <p className="text-slate-400 text-xs">Consultables et téléchargeables en accès sécurisé</p>
          </div>
          <button
            onClick={() => onNavigate('theses')}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 text-xs font-bold hover:bg-slate-800 transition"
          >
            Voir Tout le Catalogue →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentTheses.map((thesis) => (
            <div
              key={thesis.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500/40 transition shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20">
                    {thesis.filiere}
                  </span>
                  <span className="text-slate-400 font-mono">{thesis.academicYear}</span>
                </div>

                <h3 
                  onClick={() => onNavigate('thesis-details', { id: thesis.id })}
                  className="text-base font-bold text-white font-serif mb-2 line-clamp-2 hover:text-amber-400 cursor-pointer transition"
                >
                  "{thesis.title}"
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {thesis.abstract}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-300 mb-3">
                  <span>Auteur: <strong>{thesis.studentName}</strong></span>
                  <span className="text-emerald-400 font-bold">{thesis.priceFcfa} FCFA</span>
                </div>

                <button
                  onClick={() => onNavigate('thesis-details', { id: thesis.id })}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs transition flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Consulter le Mémoire</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
