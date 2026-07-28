import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

interface LoginProps {
  onNavigate: (page: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const { login, switchDemoRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(email, password);
      onNavigate(`dashboard-${user.role}`);
    } catch (err: any) {
      setError(err.message || 'Échec de la connexion.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = async (role: 'student' | 'supervisor' | 'visitor' | 'admin') => {
    setSubmitting(true);
    try {
      await switchDemoRole(role);
      onNavigate(`dashboard-${role}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
        
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-3">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-white font-serif">Connexion Sécurisée</h2>
          <p className="text-xs text-slate-400 mt-1">Accédez à votre espace IMHOTEP MÉMOIRES</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Adresse Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ex: etudiant@uac.bj"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Mot de Passe</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition flex items-center justify-center space-x-2"
          >
            <span>{submitting ? 'Connexion...' : 'Se Connecter'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Login Preset Buttons */}
        <div className="pt-4 border-t border-slate-800">
          <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider text-center mb-3">
            ⚡ Connexion Rapide Démo (1-Click)
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickLogin('student')}
              className="px-3 py-2 rounded-lg bg-slate-950 border border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-300 font-semibold text-left flex items-center space-x-2"
            >
              <UserCheck className="w-3.5 h-3.5 shrink-0" />
              <span>👨‍🎓 Étudiant</span>
            </button>

            <button
              onClick={() => handleQuickLogin('supervisor')}
              className="px-3 py-2 rounded-lg bg-slate-950 border border-indigo-500/30 hover:bg-indigo-500/10 text-indigo-300 font-semibold text-left flex items-center space-x-2"
            >
              <UserCheck className="w-3.5 h-3.5 shrink-0" />
              <span>👨‍🏫 Encadreur</span>
            </button>

            <button
              onClick={() => handleQuickLogin('visitor')}
              className="px-3 py-2 rounded-lg bg-slate-950 border border-amber-500/30 hover:bg-amber-500/10 text-amber-300 font-semibold text-left flex items-center space-x-2"
            >
              <UserCheck className="w-3.5 h-3.5 shrink-0" />
              <span>👤 Visiteur</span>
            </button>

            <button
              onClick={() => handleQuickLogin('admin')}
              className="px-3 py-2 rounded-lg bg-slate-950 border border-rose-500/30 hover:bg-rose-500/10 text-rose-300 font-semibold text-left flex items-center space-x-2"
            >
              <UserCheck className="w-3.5 h-3.5 shrink-0" />
              <span>👨‍💼 Admin</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400 pt-2">
          Pas encore de compte ?{' '}
          <button onClick={() => onNavigate('register')} className="text-amber-400 font-bold hover:underline">
            S'inscrire gratuitement
          </button>
        </div>

      </div>
    </div>
  );
};
