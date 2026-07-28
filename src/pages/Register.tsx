import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { GraduationCap, Mail, Lock, User, Phone, BookOpen, ArrowRight } from 'lucide-react';

interface RegisterProps {
  onNavigate: (page: string) => void;
}

export const Register: React.FC<RegisterProps> = ({ onNavigate }) => {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [filiere, setFiliere] = useState('Génie Informatique & Systèmes d\'Information');
  const [niveau, setNiveau] = useState<'Licence' | 'Master' | 'Doctorat'>('Master');
  const [matricule, setMatricule] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const newUser = await register({
        fullName,
        email,
        password,
        role,
        filiere,
        niveau,
        matricule,
        phone,
        university: 'Université d\'Abomey-Calavi (UAC)'
      });
      onNavigate(`dashboard-${newUser.role}`);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création de compte.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-6 bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
        
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-3">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-white font-serif">Créer un Compte IMHOTEP</h2>
          <p className="text-xs text-slate-400 mt-1">Rejoignez le réseau académique intelligent</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Role Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Type de Compte (Rôle)</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'student', label: '👨‍🎓 Déposant (Étudiant)' },
                { id: 'supervisor', label: '👨‍🏫 Encadreur' },
                { id: 'visitor', label: '👤 Visiteur' }
              ].map((r) => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setRole(r.id as UserRole)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition text-center ${
                    role === r.id
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nom & Prénoms</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="ex: Marcel KOFFI"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Téléphone Mobile</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+229 97 00 11 22"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Adresse Email Institutionnelle ou Personnelle</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="marcel.koffi@uac.bj"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>

          {role === 'student' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Filière</label>
                <select
                  value={filiere}
                  onChange={(e) => setFiliere(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
                >
                  <option value="Génie Informatique & Systèmes d'Information">Génie Informatique & SI</option>
                  <option value="Informatique de Gestion & Sécurité SI">Informatique de Gestion</option>
                  <option value="Finance, Banque & Microfinance">Finance & Microfinance</option>
                  <option value="Droit du Numérique & Cybersécurité">Droit du Numérique</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Matricule Étudiant</label>
                <input
                  type="text"
                  value={matricule}
                  onChange={(e) => setMatricule(e.target.value)}
                  placeholder="2022-09841-UAC"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Mot de Passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition flex items-center justify-center space-x-2"
          >
            <span>{submitting ? 'Création...' : 'Valider l\'Inscription'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2">
          Déjà inscrit ?{' '}
          <button onClick={() => onNavigate('login')} className="text-amber-400 font-bold hover:underline">
            Se connecter
          </button>
        </div>

      </div>
    </div>
  );
};
