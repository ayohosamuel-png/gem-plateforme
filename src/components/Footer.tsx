import React from 'react';
import { GraduationCap } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-white font-serif tracking-tight">Mémoire Universitaire</span>
          </div>

          <p className="text-center md:text-left">
            © {new Date().getFullYear()} Mémoire Universitaire. Tous droits réservés. Université d'Abomey-Calavi (UAC) & Ministère de l'Enseignement Supérieur.
          </p>

          <div className="flex space-x-4">
            <span className="hover:text-slate-300 cursor-pointer transition">Mentions Légales</span>
            <span className="hover:text-slate-300 cursor-pointer transition">Confidentialité</span>
            <span className="hover:text-slate-300 cursor-pointer transition">Support Technique</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

