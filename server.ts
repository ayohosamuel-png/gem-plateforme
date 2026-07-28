import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './backend/database/db.js';
import { AuthService } from './backend/services/auth.service.js';
import { ThesisService } from './backend/services/thesis.service.js';
import { AIService } from './backend/services/ai.service.js';
import { PaymentService } from './backend/services/payment.service.js';
import { jwtMiddleware, AuthenticatedRequest } from './backend/middleware/jwt.js';
import { corsMiddleware } from './backend/middleware/cors.js';
import QRCode from 'qrcode';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '25mb' }));
  app.use(corsMiddleware);
  app.use(jwtMiddleware);

  // --- API ROUTES ---

  // 1. Authentification
  app.post('/api/auth/login', (req, res) => {
    try {
      const { email, password } = req.body;
      const result = AuthService.login(email, password);
      if (!result) {
        return res.status(401).json({ success: false, message: 'Identifiants incorrects (email ou mot de passe).' });
      }
      return res.json({ success: true, user: result.user, token: result.token });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  });

  app.post('/api/auth/register', (req, res) => {
    try {
      const result = AuthService.register(req.body);
      return res.status(201).json({ success: true, user: result.user, token: result.token });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  });

  app.get('/api/auth/me', (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Non authentifié.' });
    }
    return res.json({ success: true, user: req.user });
  });

  // 2. Filières
  app.get('/api/filieres', (_req, res) => {
    const list = Array.from(db.filieres.values());
    return res.json({ success: true, data: list });
  });

  // 3. Mémoires (Theses)
  app.get('/api/theses', (req, res) => {
    const { filiere, year, status, search, publicOnly, studentId, supervisorId } = req.query;
    const items = ThesisService.getAll({
      filiere: filiere as string,
      year: year as string,
      status: status as any,
      search: search as string,
      publicOnly: publicOnly === 'true',
      studentId: studentId as string,
      supervisorId: supervisorId as string
    });
    return res.json({ success: true, data: items });
  });

  app.get('/api/theses/:id', (req, res) => {
    const thesis = ThesisService.getById(req.params.id);
    if (!thesis) return res.status(404).json({ success: false, message: 'Mémoire introuvable' });
    return res.json({ success: true, data: thesis });
  });

  app.post('/api/theses', async (req: AuthenticatedRequest, res) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'Connexion requise pour soumettre un mémoire.' });
    try {
      const thesis = await ThesisService.submitThesis({
        ...req.body,
        student: req.user
      });
      return res.status(201).json({ success: true, data: thesis });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  });

  app.post('/api/theses/:id/validate', async (req: AuthenticatedRequest, res) => {
    if (!req.user || (req.user.role !== 'supervisor' && req.user.role !== 'admin')) {
      return res.status(403).json({ success: false, message: 'Autorisation réservée aux encadreurs et administrateurs.' });
    }
    try {
      const thesis = await ThesisService.validateThesis(req.params.id, req.body.notes);
      return res.json({ success: true, data: thesis });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  });

  app.post('/api/theses/:id/reject', (req: AuthenticatedRequest, res) => {
    if (!req.user || (req.user.role !== 'supervisor' && req.user.role !== 'admin')) {
      return res.status(403).json({ success: false, message: 'Autorisation réservée aux encadreurs.' });
    }
    try {
      const thesis = ThesisService.rejectThesis(req.params.id, req.body.reason || 'Corrections demandées');
      return res.json({ success: true, data: thesis });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  });

  // Téléchargement / Aperçu PDF
  app.get('/api/theses/:id/pdf', (req, res) => {
    const thesis = db.theses.get(req.params.id);
    if (!thesis) return res.status(404).send('Mémoire introuvable.');

    // Contenu SVG/HTML d'aperçu de document académique
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <title>${thesis.title}</title>
      <style>
        body { font-family: 'Times New Roman', serif; padding: 40px; background: #fdfbf7; color: #1a1a1a; line-height: 1.6; }
        .border-frame { border: 4px double #1b365d; padding: 30px; }
        .univ { text-align: center; font-size: 20px; font-weight: bold; text-transform: uppercase; color: #1b365d; }
        .sub-univ { text-align: center; font-size: 14px; margin-bottom: 30px; color: #555; }
        .badge { text-align: center; font-size: 16px; font-weight: bold; margin: 20px 0; letter-spacing: 2px; color: #b8860b; }
        .title { text-align: center; font-size: 22px; font-weight: bold; margin: 30px 0; color: #0d233a; line-height: 1.4; }
        .meta { margin: 30px 0; font-size: 15px; }
        .meta-line { margin-bottom: 8px; }
        .abstract-title { font-weight: bold; margin-top: 30px; border-bottom: 2px solid #1b365d; padding-bottom: 4px; }
        .abstract { text-align: justify; margin-top: 10px; font-size: 14px; }
        .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #777; border-top: 1px solid #ccc; padding-top: 15px; }
      </style>
    </head>
    <body>
      <div class="border-frame">
        <div class="univ">${thesis.university}</div>
        <div class="sub-univ">RÉPUBLIQUE DU BÉNIN — MINISTÈRE DE L'ENSEIGNEMENT SUPÉRIEUR</div>
        <div class="badge">MÉMOIRE DE ${thesis.filiere.toUpperCase()}</div>
        <div class="title">"${thesis.title}"</div>
        <div class="meta">
          <div class="meta-line"><strong>Auteur :</strong> ${thesis.studentName} (Matricule: ${thesis.studentMatricule || 'N/A'})</div>
          <div class="meta-line"><strong>Encadreur :</strong> ${thesis.supervisorName}</div>
          <div class="meta-line"><strong>Année Académique :</strong> ${thesis.academicYear}</div>
          <div class="meta-line"><strong>Statut de Validation :</strong> <span style="color: green; font-weight: bold;">${thesis.status}</span></div>
        </div>
        <div class="abstract-title">RÉSUMÉ ACADÉMIQUE</div>
        <div class="abstract">${thesis.abstract}</div>
        <div class="abstract-title" style="margin-top: 20px;">MOTS-CLÉS</div>
        <div>${thesis.keywords.join(', ')}</div>
        <div class="footer">Archivé électroniquement via IMHOTEP MÉMOIRES — Empreinte Numérique Certifiée</div>
      </div>
    </body>
    </html>
    `;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(htmlContent);
  });

  // 4. Intelligence Artificielle (Gemini API)
  app.post('/api/ai/theme-check', async (req, res) => {
    try {
      const result = await AIService.checkTheme(req.body);
      return res.json({ success: true, data: result });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  app.post('/api/ai/plagiarism', async (req, res) => {
    try {
      const { title, abstract } = req.body;
      const report = await AIService.checkPlagiarism(title, abstract);
      return res.json({ success: true, data: report });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  app.post('/api/ai/assistant', async (req, res) => {
    try {
      const { message, contextType } = req.body;
      const reply = await AIService.askAssistant(message, contextType);
      return res.json({ success: true, reply });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  app.post('/api/ai/search', async (req, res) => {
    try {
      const { query } = req.body;
      const results = await AIService.smartSearch(query);
      return res.json({ success: true, data: results });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // 5. Paiements (Mobile Money & Cards)
  app.post('/api/payments/create', (req: AuthenticatedRequest, res) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentification requise pour effectuer un achat.' });
    try {
      const transaction = PaymentService.createPayment({
        ...req.body,
        userId: req.user.id,
        userName: req.user.fullName
      });
      return res.status(201).json({ success: true, data: transaction });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  });

  app.get('/api/payments/history', (req: AuthenticatedRequest, res) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'Non authentifié.' });
    const history = PaymentService.getHistory(req.user.role === 'admin' ? undefined : req.user.id);
    return res.json({ success: true, data: history });
  });

  // 6. Certificats
  app.get('/api/certificates/:id', (req, res) => {
    const cert = db.certificates.get(req.params.id);
    if (!cert) return res.status(404).json({ success: false, message: 'Certificat introuvable.' });
    return res.json({ success: true, data: cert });
  });

  app.get('/api/certificates/:id/qr', async (req, res) => {
    const cert = db.certificates.get(req.params.id);
    if (!cert) return res.status(404).send('Certificat introuvable.');

    try {
      const qrBuffer = await QRCode.toBuffer(`https://imhotep-memoires.pages.dev${cert.verificationUrl}`);
      res.setHeader('Content-Type', 'image/png');
      return res.send(qrBuffer);
    } catch {
      return res.status(500).send('Erreur génération QR Code');
    }
  });

  app.get('/api/certificates/verify/:number', (req, res) => {
    const cert = Array.from(db.certificates.values()).find(c => c.certificateNumber.toLowerCase() === req.params.number.toLowerCase());
    if (!cert) return res.status(404).json({ success: false, verified: false, message: 'Numéro de certificat invalide ou introuvable.' });
    return res.json({ success: true, verified: true, data: cert });
  });

  // 7. Notifications
  app.get('/api/notifications', (req: AuthenticatedRequest, res) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'Non authentifié.' });
    const userNotifs = Array.from(db.notifications.values())
      .filter(n => n.userId === req.user?.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return res.json({ success: true, data: userNotifs });
  });

  app.put('/api/notifications/:id/read', (req: AuthenticatedRequest, res) => {
    const notif = db.notifications.get(req.params.id);
    if (notif) notif.read = true;
    return res.json({ success: true });
  });

  // 8. Administration
  app.get('/api/admin/dashboard', (req: AuthenticatedRequest, res) => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Accès réservé aux administrateurs.' });
    }

    const totalUsers = db.users.size;
    const totalTheses = db.theses.size;
    const publishedTheses = Array.from(db.theses.values()).filter(t => t.status === 'PUBLIÉ').length;
    const totalPayments = Array.from(db.payments.values()).reduce((sum, p) => sum + p.amountFcfa, 0);

    const filieresStats = Array.from(db.filieres.values()).map(f => {
      const count = Array.from(db.theses.values()).filter(t => t.filiere === f.name).length;
      return { ...f, thesisCount: count };
    });

    return res.json({
      success: true,
      data: {
        totalUsers,
        totalTheses,
        publishedTheses,
        totalPaymentsFcfa: totalPayments,
        filieresStats,
        recentLogs: db.auditLogs.slice(0, 10)
      }
    });
  });

  app.get('/api/admin/users', (req: AuthenticatedRequest, res) => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Accès réservé aux administrateurs.' });
    }
    return res.json({ success: true, data: Array.from(db.users.values()) });
  });

  app.put('/api/admin/users/:id/status', (req: AuthenticatedRequest, res) => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Accès réservé aux administrateurs.' });
    }
    const targetUser = db.users.get(req.params.id);
    if (!targetUser) return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
    targetUser.status = req.body.status;
    return res.json({ success: true, data: targetUser });
  });

  app.get('/api/admin/audit-logs', (req: AuthenticatedRequest, res) => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Accès réservé aux administrateurs.' });
    }
    return res.json({ success: true, data: db.auditLogs });
  });

  // --- VITE MIDDLEWARE / PRODUCTION SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🏛️ Serveur IMHOTEP MÉMOIRES démarré sur http://localhost:${PORT}`);
  });
}

startServer();
