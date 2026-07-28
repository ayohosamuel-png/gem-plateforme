import { db } from '../database/db.js';
import { User, UserRole } from '../../src/types/index.js';

export class AuthService {
  static login(email: string, pass: string): { user: User; token: string } | null {
    const user = Array.from(db.users.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;

    const storedPass = db.passwords.get(email.toLowerCase());
    if (storedPass !== pass) return null;

    if (user.status === 'blocked') {
      throw new Error('Votre compte est temporairement bloqué par l\'administration.');
    }

    // Token JWT simulé avec payload base64
    const payload = { id: user.id, email: user.email, role: user.role, exp: Date.now() + 86400000 };
    const token = `imhotep_jwt_${Buffer.from(JSON.stringify(payload)).toString('base64')}`;

    // Audit Log
    db.auditLogs.unshift({
      id: `log_${Date.now()}`,
      userId: user.id,
      userName: user.fullName,
      action: 'CONNEXION_RÉUSSIE',
      module: 'AUTH',
      details: `Connexion au compte (${user.role})`,
      ipAddress: '197.234.221.10',
      timestamp: new Date().toISOString()
    });

    return { user, token };
  }

  static register(data: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    university?: string;
    filiere?: string;
    niveau?: 'Licence' | 'Master' | 'Doctorat';
    matricule?: string;
    phone?: string;
  }): { user: User; token: string } {
    const existing = Array.from(db.users.values()).find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      throw new Error('Un compte existe déjà avec cette adresse email.');
    }

    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newUser: User = {
      id: userId,
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      university: data.university || 'Université d\'Abomey-Calavi (UAC)',
      filiere: data.filiere || 'Génie Informatique & Systèmes d\'Information',
      niveau: data.niveau || 'Master',
      matricule: data.matricule,
      phone: data.phone,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
      createdAt: new Date().toISOString(),
      isVerified: true,
      status: 'active'
    };

    db.users.set(userId, newUser);
    db.passwords.set(data.email.toLowerCase(), data.password);

    // Initial notification
    db.notifications.set(`notif_${Date.now()}`, {
      id: `notif_${Date.now()}`,
      userId,
      title: 'Bienvenue sur IMHOTEP MÉMOIRES 🏛️',
      message: 'Votre compte a été créé avec succès. Vous pouvez maintenant accéder à votre espace personnalisé.',
      type: 'INFO',
      read: false,
      createdAt: new Date().toISOString()
    });

    // Audit Log
    db.auditLogs.unshift({
      id: `log_${Date.now()}`,
      userId: newUser.id,
      userName: newUser.fullName,
      action: 'INSCRIPTION_COMPTE',
      module: 'AUTH',
      details: `Création de compte rôle ${data.role}`,
      ipAddress: '197.234.221.10',
      timestamp: new Date().toISOString()
    });

    const payload = { id: newUser.id, email: newUser.email, role: newUser.role, exp: Date.now() + 86400000 };
    const token = `imhotep_jwt_${Buffer.from(JSON.stringify(payload)).toString('base64')}`;

    return { user: newUser, token };
  }

  static verifyToken(token: string): User | null {
    if (!token || !token.startsWith('imhotep_jwt_')) return null;
    try {
      const raw = token.replace('imhotep_jwt_', '');
      const payload = JSON.parse(Buffer.from(raw, 'base64').toString('utf-8'));
      if (payload.exp < Date.now()) return null;
      return db.users.get(payload.id) || null;
    } catch {
      return null;
    }
  }
}
