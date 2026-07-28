import React from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Bell, CheckCircle, Info, AlertTriangle, CreditCard, GraduationCap } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose, onNavigate }) => {
  const { notifications, markNotifAsRead } = useAuth();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'WARNING': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'PAYMENT': return <CreditCard className="w-5 h-5 text-indigo-400" />;
      case 'THESIS_UPDATE': return <GraduationCap className="w-5 h-5 text-cyan-400" />;
      default: return <Info className="w-5 h-5 text-sky-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white font-serif">Notifications</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Aucune notification pour le moment.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  markNotifAsRead(n.id);
                  if (n.linkUrl) {
                    onClose();
                    onNavigate(n.linkUrl.replace('/', ''));
                  }
                }}
                className={`p-4 rounded-xl border transition cursor-pointer ${
                  n.read
                    ? 'bg-slate-900/60 border-slate-800/80 text-slate-400'
                    : 'bg-slate-800/90 border-amber-500/30 text-white shadow-md'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-slate-200">{n.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(n.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-1">{n.message}</p>
                    {!n.read && (
                      <span className="text-[10px] font-semibold text-amber-400 hover:underline">
                        Marquer comme lu →
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
