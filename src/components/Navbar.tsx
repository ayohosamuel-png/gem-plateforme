import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  Search, 
  Sparkles, 
  Bot, 
  Bell, 
  LogOut, 
  User as UserIcon, 
  ShieldCheck, 
  Menu, 
  X, 
  ChevronDown,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface NavbarProps {
  onNavigate: (page: string, params?: any) => void;
  currentPage: string;
  onToggleNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage, onToggleNotifications }) => {
  const { user, logout, switchDemoRole, unreadNotifsCount } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Accueil', icon: GraduationCap },
    { id: 'theses', label: 'Rechercher Mémoires', icon: Search },
    { id: 'theme-check', label: 'Vérificateur Thème IA', icon: Sparkles, badge: 'IA' },
    { id: 'ai-assistant', label: 'Assistant IA', icon: Bot, badge: 'IA' },
  ];

  const roleLabels = {
    student: '👨‍🎓 Déposant (Étudiant)',
    supervisor: '👨‍🏫 Encadreur',
    visitor: '👤 Visiteur',
    admin: '👨‍💼 Administrateur'
  };

  const roleColors = {
    student: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    supervisor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    visitor: 'bg-amber-100 text-amber-800 border-amber-300',
    admin: 'bg-rose-100 text-rose-800 border-rose-300'
  };

  return (
    <nav className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-600 to-yellow-400 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-slate-950 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5 font-serif">
                Mémoire <span className="text-amber-400 font-sans text-sm font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/20">Universitaire</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">Gestion Intelligente de Thèses & Mémoires</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action Menu & Quick Role Switcher */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* Quick Demo Role Selector */}
            <div className="relative">
              <button
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="flex items-center space-x-2 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition"
                title="Sélecteur rapide de rôles pour test"
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Rôle: <strong className="text-amber-300">{user ? roleLabels[user.role].split(' ')[1] : 'Visiteur'}</strong></span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/60">
                    Changer de Rôle (Test)
                  </div>
                  {(['student', 'supervisor', 'visitor', 'admin'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={async () => {
                        await switchDemoRole(r);
                        setRoleSwitcherOpen(false);
                        onNavigate(`dashboard-${r}`);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-700/80 transition ${
                        user?.role === r ? 'text-amber-300 font-bold bg-amber-500/10' : 'text-slate-300'
                      }`}
                    >
                      <span>{roleLabels[r]}</span>
                      {user?.role === r && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            {user && (
              <button
                onClick={onToggleNotifications}
                className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>
            )}

            {/* User Account / Dashboard Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-800 transition border border-slate-700/50"
                >
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full object-cover border border-amber-500/50"
                  />
                  <div className="text-left hidden lg:block">
                    <div className="text-xs font-semibold text-slate-200">{user.fullName}</div>
                    <div className={`text-[10px] px-1.5 py-0.2 rounded border font-medium inline-block ${roleColors[user.role]}`}>
                      {user.role.toUpperCase()}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-700/80">
                      <p className="text-xs text-slate-400">Connecté en tant que</p>
                      <p className="text-sm font-bold text-white truncate">{user.fullName}</p>
                      <p className="text-[11px] text-amber-400 font-mono truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate(`dashboard-${user.role}`);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-slate-700 flex items-center space-x-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <span>Mon Tableau de Bord ({user.role})</span>
                      </button>

                      {user.role === 'student' && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onNavigate('submit-thesis');
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-slate-700 flex items-center space-x-2"
                        >
                          <GraduationCap className="w-4 h-4 text-emerald-400" />
                          <span>Déposer un Mémoire</span>
                        </button>
                      )}
                    </div>

                    <div className="border-t border-slate-700/80 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          onNavigate('home');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Déconnexion</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700 transition"
                >
                  Connexion
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md transition"
                >
                  Créer un Compte
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center space-x-2">
            {user && (
              <button
                onClick={onToggleNotifications}
                className="p-2 text-slate-300 relative"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
                currentPage === item.id ? 'bg-amber-500/20 text-amber-300' : 'text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <item.icon className="w-4 h-4 text-amber-400" />
                <span>{item.label}</span>
              </div>
              {item.badge && <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-bold">{item.badge}</span>}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-800">
            {user ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onNavigate(`dashboard-${user.role}`);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg bg-slate-800 text-sm font-semibold text-amber-300 flex items-center space-x-2"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Tableau de Bord ({user.role})</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}
                  className="w-full py-2 text-xs font-semibold bg-slate-800 text-slate-200 rounded-lg text-center"
                >
                  Connexion
                </button>
                <button
                  onClick={() => { onNavigate('register'); setMobileMenuOpen(false); }}
                  className="w-full py-2 text-xs font-semibold bg-amber-500 text-slate-950 rounded-lg text-center"
                >
                  Inscription
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
