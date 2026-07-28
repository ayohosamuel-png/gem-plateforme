import React, { useState, useEffect } from 'react';
import { thesisService } from '../../services/thesis';
import { aiService } from '../../services/ai';
import { PlagiarismReport as PlagiarismType, Thesis } from '../../types';
import { 
  FileCheck, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Download, 
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface PlagiarismReportProps {
  thesisId?: string;
  onNavigate: (page: string, params?: any) => void;
}

export const PlagiarismReportPage: React.FC<PlagiarismReportProps> = ({ thesisId, onNavigate }) => {
  const [report, setReport] = useState<PlagiarismType | null>(null);
  const [thesis, setThesis] = useState<Thesis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      try {
        if (thesisId) {
          const t = await thesisService.getThesisById(thesisId);
          setThesis(t);
          const rep = await aiService.checkPlagiarism(t.title, t.abstract);
          setReport(rep);
        } else {
          // Default sample report
          const defaultThesis = (await thesisService.getTheses({ publicOnly: true }))[0];
          setThesis(defaultThesis);
          const rep = await aiService.checkPlagiarism(defaultThesis.title, defaultThesis.abstract);
          setReport(rep);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, [thesisId]);

  if (loading) return <div className="p-12 text-center text-slate-400">Analyse Anti-Plagiat Gemini AI en cours...</div>;
  if (!report || !thesis) return <div className="p-12 text-center text-slate-400">Rapport introuvable.</div>;

  const isAcceptable = report.overallPlagiarismPercentage <= 15;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Badge */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white font-serif">Rapport Officiel Anti-Plagiat IA</h1>
              <p className="text-xs text-slate-400 font-mono">ID Analyse: {report.id}</p>
            </div>
          </div>

          <div className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center space-x-2 ${
            isAcceptable 
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
          }`}>
            <ShieldCheck className="w-4 h-4" />
            <span>{isAcceptable ? 'Mémoire Conforme (< 15%)' : 'Alerte Similitude Élevée'}</span>
          </div>
        </div>

        {/* Document Info */}
        <div>
          <span className="text-xs text-slate-400 block mb-1">Mémoire Analysé :</span>
          <h2 className="text-lg font-bold text-white font-serif">"{thesis.title}"</h2>
          <p className="text-xs text-slate-400 mt-1">Auteur: {thesis.studentName} | Filière: {thesis.filiere}</p>
        </div>

        {/* Metrics Score Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="text-center">
            <div className="text-3xl font-black text-amber-400 font-mono">{report.overallPlagiarismPercentage}%</div>
            <div className="text-[11px] text-slate-400 font-medium">Taux de Taux de Similitude Globale</div>
          </div>
          <div className="text-center border-y sm:border-y-0 sm:border-x border-slate-800 py-2 sm:py-0">
            <div className="text-3xl font-black text-emerald-400 font-mono">{100 - report.overallPlagiarismPercentage}%</div>
            <div className="text-[11px] text-slate-400 font-medium">Originalité du Contenu</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-cyan-400 font-mono">{report.sourcesCount}</div>
            <div className="text-[11px] text-slate-400 font-medium">Sources Correspondantes</div>
          </div>
        </div>

        {/* AI Conclusion */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Conclusion Sémantique Gemini AI</h3>
          <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
            {report.aiConclusion}
          </p>
        </div>

        {/* Detected Sources List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Sources Correspondantes Détectées</h3>
          {report.matchedSources.map((src, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-serif">{src.sourceTitle}</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                  {src.matchPercentage}% de correspondance
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">{src.authorOrUniv}</p>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 italic">
                "{src.snippet}"
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
