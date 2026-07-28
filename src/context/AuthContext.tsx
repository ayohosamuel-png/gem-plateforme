import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Notification } from '../types';
import { authService } from '../services/auth';
import { apiFetch } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<User>;
  register: (data: any) => Promise<User>;
  logout: () => void;
  switchDemoRole: (role: 'student' | 'supervisor' | 'visitor' | 'admin') => Promise<void>;
  notifications: Notification[];
  unreadNotifsCount: number;
  markNotifAsRead: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    try {
      const res = await apiFetch<{ data: Notification[] }>('/api/notifications');
      setNotifications(res.data);
    } catch {
      // Ignore if unauthenticated
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('imhotep_token');
      if (token) {
        try {
          const me = await authService.getMe();
          setUser(me);
          await fetchNotifications();
        } catch {
          localStorage.removeItem('imhotep_token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    const loggedUser = await authService.login(email, pass);
    setUser(loggedUser);
    await fetchNotifications();
    return loggedUser;
  };

  const register = async (data: any) => {
    const registeredUser = await authService.register(data);
    setUser(registeredUser);
    await fetchNotifications();
    return registeredUser;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setNotifications([]);
  };

  const switchDemoRole = async (role: 'student' | 'supervisor' | 'visitor' | 'admin') => {
    const demoEmails = {
      student: 'etudiant@uac.bj',
      supervisor: 'prof.houessou@uac.bj',
      visitor: 'visiteur@gmail.com',
      admin: 'admin@imhotep-memoires.bj'
    };
    const demoPasses = {
      student: 'etudiant123',
      supervisor: 'prof123',
      visitor: 'visiteur123',
      admin: 'admin123'
    };
    await login(demoEmails[role], demoPasses[role]);
  };

  const markNotifAsRead = async (id: string) => {
    try {
      await apiFetch(`/api/notifications/${id}/read`, { method: 'PUT' });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      switchDemoRole,
      notifications,
      unreadNotifsCount,
      markNotifAsRead
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé au sein d\'un AuthProvider');
  return context;
};
