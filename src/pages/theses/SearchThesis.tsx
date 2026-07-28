import React, { useState, useEffect } from 'react';
import { thesisService } from '../../services/thesis';
import { aiService } from '../../services/ai';
import { Thesis } from '../../types';
import { 
  Search, 
  Sparkles, 
  Filter, 
  BookOpen, 
  Eye, 
  CreditCard, 
  Calendar, 
  GraduationCap,
  Bot
} from 'lucide-react';

interface SearchThesisProps {
  onNavigate: (page: string, params?: any) => void;
}

export const SearchThesis: React.FC<SearchThesisProps> = ({ onNavigate }) => {
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiliere, setSelectedFiliere] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [isAiSearch, setIsAiSearch] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchTheses = async () => {
    setLoading(true);
    try {
      if (isAiSearch && searchQuery.trim()) {
        const aiResults = await aiService.smartSearch(searchQuery);
        setTheses(aiResults.map(r => r.thesis));
      } else {
        const list = await thesisService.getTheses({
          search: searchQuery,
          filiere: selectedFiliere,
          year: selectedYear,
          publicOnly: true
        });
        setTheses(list);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheses();
  }, [selectedFiliere, selectedYear, isAiSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTheses();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <h1 className="text-3xl font-bold text-white font-serif">Catalogue & Recherche de Mémoires</h1>
        <p className="text-xs text-slate-400">
          Explorez les travaux de recherche académique validés et archivés numériquement
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAiSearch ? "Mode IA : ex: Mémoires portant sur la sécurité des objets connectés..." : "Rechercher par titre, auteur, mots-clés..."}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition flex items-center justify-center space-x-2 shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Rechercher</span>
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800 text-xs">
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-1.5 text-slate-400 font-semibold">
              <Filter className="w-4 h-4 text-amber-400" />
              <span>Filtres :</span>
            </div>

            <select
              value={selectedFiliere}
              onChange={(e) => setSelectedFiliere(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs"
            >
              <option value="">Toutes les filières</option>
              <option value="Génie Informatique & Systèmes d'Information">Génie Informatique & SI</option>
              <option value="Informatique de Gestion & Sécurité SI">Informatique de Gestion</option>
              <option value="Finance, Banque & Microfinance">Finance & Microfinance</option>
              <option value="Droit du Numérique & Cybersécurité">Droit du Numérique</option>
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs"
            >
              <option value="">Toutes les années</option>
              <option value="2024-2025">2024-2025</option>
              <option value="2023-2024">2023-2024</option>
              <option value="2022-2023">2022-2023</option>
            </select>
          </div>

          {/* AI Search Toggle */}
          <button
            onClick={() => setIsAiSearch(!isAiSearch)}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition flex items-center space-x-2 ${
              isAiSearch
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="w-4 h-4 text-amber-400" />
            <span>Recherche Intelligente Sémantique Gemini IA {isAiSearch ? '(Activité)' : ''}</span>
          </button>

        </div>

      </div>

      {/* Results Grid */}
      <div>
        {loading ? (
          <div className="text-center py-16 text-slate-400">Recherche dans la base D1...</div>
        ) : theses.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Aucun mémoire ne correspond à vos critères.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {theses.map((thesis) => (
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

                  <div className="flex flex-wrap gap-1 mb-4">
                    {thesis.keywords.map((kw, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-300 mb-3">
                    <span>Auteur: <strong className="text-white">{thesis.studentName}</strong></span>
                    <span className="text-emerald-400 font-bold font-mono">{thesis.priceFcfa} FCFA</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onNavigate('thesis-details', { id: thesis.id })}
                      className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center justify-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Aperçu</span>
                    </button>

                    <button
                      onClick={() => onNavigate('payment', { thesisId: thesis.id })}
                      className="py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition flex items-center justify-center space-x-1"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Débloquer</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
