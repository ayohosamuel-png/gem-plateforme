import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Loader } from './Loader';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  onNavigate: (page: string) => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles, onNavigate }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen message="Vérification des autorisations..." />;
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white font-serif mb-2">Authentification Requise</h2>
        <p className="text-slate-400 text-sm max-w-md mb-6">
          Vous devez vous connecter à votre compte IMHOTEP MÉMOIRES pour accéder à cette section.
        </p>
        <button
          onClick={() => onNavigate('login')}
          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-amber-500/20"
        >
          Se Connecter
        </button>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white font-serif mb-2">Accès Non Autorisé</h2>
        <p className="text-slate-400 text-sm max-w-md mb-6">
          Votre compte (rôle: <strong className="text-rose-400">{user.role}</strong>) n'a pas les droits requis pour accéder à cette page.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition"
        >
          Retour à l'Accueil
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
