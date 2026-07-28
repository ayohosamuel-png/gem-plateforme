import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { User, AuditLog } from '../../types';
import { 
  Users, 
  FileText, 
  CreditCard, 
  ShieldCheck, 
  Activity, 
  Lock, 
  Unlock, 
  TrendingUp,
  BarChart3,
  Search
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'audit'>('overview');

  const loadAdminData = async () => {
    try {
      const res = await apiFetch<{ data: any }>('/api/admin/dashboard');
      setData(res.data);
      const userRes = await apiFetch<{ data: User[] }>('/api/admin/users');
      setUsers(userRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await apiFetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus as any } : u));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white font-serif">Administration Centrale</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-bold">
              Super Admin
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Supervision globale de la plateforme, gestion des accès et traçabilité audit</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'overview' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Vue d'Ensemble
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'users' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Utilisateurs ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'audit' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Logs d'Audit
          </button>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && data && (
        <div className="space-y-8">
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-medium">Utilisateurs Inscrits</span>
                <Users className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">{data.totalUsers}</div>
              <p className="text-[11px] text-emerald-400 mt-1">
                Étudiants, Encadreurs, Visiteurs
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-medium">Mémoires Total</span>
                <FileText className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">{data.totalTheses}</div>
              <p className="text-[11px] text-amber-400 mt-1">
                {data.publishedTheses} Publiés et Certifiés
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-medium">Revenus MoMo / Cartes</span>
                <CreditCard className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono">{data.totalPaymentsFcfa} FCFA</div>
              <p className="text-[11px] text-slate-400 mt-1">
                Ventes de mémoires débloqués
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-medium">Sûreté & Sécurité IA</span>
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-cyan-400 font-mono">100%</div>
              <p className="text-[11px] text-cyan-300 mt-1">
                D1 Database & R2 Storage
              </p>
            </div>
          </div>

          {/* Filières Stats Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-base font-bold text-white font-serif mb-4 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-amber-400" />
              <span>Répartition des Mémoires par Filière</span>
            </h3>

            <div className="space-y-3">
              {data.filieresStats.map((f: any) => (
                <div key={f.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{f.name}</h4>
                    <p className="text-[11px] text-slate-400">Code: {f.code}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 font-mono font-bold text-xs border border-amber-500/20">
                    {f.thesisCount} Mémoires
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="text-base font-bold text-white font-serif flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Users className="w-5 h-5 text-amber-400" />
            <span>Gestion des Comptes Utilisateurs</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold uppercase">
                <tr>
                  <th className="p-3">Nom & Email</th>
                  <th className="p-3">Rôle</th>
                  <th className="p-3">Filière / Dpt</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/50">
                    <td className="p-3">
                      <div className="font-bold text-white">{u.fullName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold uppercase text-[10px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{u.filiere || u.department || 'Général'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleUserStatus(u.id, u.status)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                          u.status === 'ACTIVE'
                            ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? 'Suspendre' : 'Activer'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AUDIT LOGS TAB */}
      {activeTab === 'audit' && data && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="text-base font-bold text-white font-serif flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span>Journal d'Audit Système</span>
          </h3>

          <div className="space-y-3">
            {data.recentLogs.map((log: AuditLog) => (
              <div key={log.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-amber-400">{log.action}</span>
                    <span className="text-slate-400">par {log.userName}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] mt-0.5">{log.details}</p>
                </div>
                <div className="text-right text-[10px] font-mono text-slate-500">
                  <div>{new Date(log.timestamp).toLocaleString('fr-FR')}</div>
                  <div>IP: {log.ipAddress}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
