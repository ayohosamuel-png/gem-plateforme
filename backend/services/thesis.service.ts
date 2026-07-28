import { db } from '../database/db.js';
import { Thesis, ThesisStatus, User } from '../../src/types/index.js';
import { AIService } from './ai.service.js';
import QRCode from 'qrcode';

export class ThesisService {
  static getAll(filters?: {
    filiere?: string;
    year?: string;
    status?: ThesisStatus;
    search?: string;
    publicOnly?: boolean;
    studentId?: string;
    supervisorId?: string;
  }): Thesis[] {
    let result = Array.from(db.theses.values());

    if (filters?.publicOnly) {
      result = result.filter(t => t.isPublic && t.status === 'PUBLIÉ');
    }

    if (filters?.studentId) {
      result = result.filter(t => t.studentId === filters.studentId);
    }

    if (filters?.supervisorId) {
      result = result.filter(t => t.supervisorId === filters.supervisorId);
    }

    if (filters?.filiere) {
      result = result.filter(t => t.filiere === filters.filiere);
    }

    if (filters?.year) {
      result = result.filter(t => t.academicYear === filters.year);
    }

    if (filters?.status) {
      result = result.filter(t => t.status === filters.status);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(q) ||
        t.studentName.toLowerCase().includes(q) ||
        t.supervisorName.toLowerCase().includes(q) ||
        t.keywords.some(k => k.toLowerCase().includes(q))
      );
    }

    return result.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }

  static getById(id: string): Thesis | null {
    const thesis = db.theses.get(id);
    if (thesis) {
      // Increment view counter
      thesis.viewsCount += 1;
    }
    return thesis || null;
  }

  static async submitThesis(data: {
    title: string;
    abstract: string;
    keywords: string[];
    filiere: string;
    academicYear: string;
    supervisorId: string;
    juryMembers?: { name: string; title: string; institution?: string }[];
    pdfFileName: string;
    pdfSizeMb: number;
    student: User;
    priceFcfa?: number;
  }): Promise<Thesis> {
    const thesisId = `ths_${Date.now()}`;
    const supervisor = db.users.get(data.supervisorId);
    const supervisorName = supervisor ? supervisor.fullName : 'Dr. Encadreur Non Assigné';

    const newThesis: Thesis = {
      id: thesisId,
      title: data.title,
      abstract: data.abstract,
      keywords: data.keywords,
      filiere: data.filiere,
      academicYear: data.academicYear,
      studentId: data.student.id,
      studentName: data.student.fullName,
      studentMatricule: data.student.matricule || 'MAT-2026-N/A',
      university: data.student.university || 'Université d\'Abomey-Calavi (UAC)',
      supervisorId: data.supervisorId,
      supervisorName,
      juryMembers: data.juryMembers || [],
      pdfUrl: `/api/theses/${thesisId}/pdf`,
      pdfFileName: data.pdfFileName || `${data.title.slice(0, 20)}.pdf`,
      pdfSizeMb: data.pdfSizeMb || 4.2,
      status: 'ANALYSE_IA',
      isPublic: true,
      priceFcfa: data.priceFcfa || 2500,
      downloadsCount: 0,
      viewsCount: 1,
      submittedAt: new Date().toISOString()
    };

    db.theses.set(thesisId, newThesis);

    // Lancement de l'analyse IA automatique
    const aiReport = await AIService.checkPlagiarism(data.title, data.abstract);
    aiReport.thesisId = thesisId;
    db.aiReports.set(aiReport.id, aiReport);

    newThesis.similarityScore = aiReport.overallSimilarity;
    newThesis.aiReportId = aiReport.id;
    newThesis.status = 'EXAMEN_ENCADREUR';

    // Notification à l'encadreur
    if (supervisor) {
      db.notifications.set(`notif_${Date.now()}`, {
        id: `notif_${Date.now()}`,
        userId: supervisor.id,
        title: 'Nouveau Dépôt de Mémoire à Valider 📥',
        message: `L'étudiant ${data.student.fullName} a déposé son mémoire: "${data.title.slice(0, 60)}..."`,
        type: 'THESIS_UPDATE',
        read: false,
        linkUrl: `/dashboard/supervisor`,
        createdAt: new Date().toISOString()
      });
    }

    // Audit Log
    db.auditLogs.unshift({
      id: `log_${Date.now()}`,
      userId: data.student.id,
      userName: data.student.fullName,
      action: 'DÉPÔT_MÉMOIRE',
      module: 'THESIS',
      details: `Dépôt mémoire ID ${thesisId} dans filière ${data.filiere}`,
      ipAddress: '197.234.221.10',
      timestamp: new Date().toISOString()
    });

    return newThesis;
  }

  static async validateThesis(thesisId: string, supervisorNotes?: string): Promise<Thesis> {
    const thesis = db.theses.get(thesisId);
    if (!thesis) throw new Error('Mémoire introuvable.');

    thesis.status = 'PUBLIÉ';
    thesis.validatedAt = new Date().toISOString();
    thesis.supervisorNotes = supervisorNotes || 'Validé avec succès par l\'encadreur académique.';

    // Génération du certificat numérique avec QR Code
    const certId = `cert_${Date.now()}`;
    const certNum = `IMH-${new Date().getFullYear()}-UAC-${Math.floor(10000 + Math.random() * 90000)}`;
    const verificationUrl = `/verify-certificate/${certNum}`;

    let qrCodeDataUrl = '';
    try {
      qrCodeDataUrl = await QRCode.toDataURL(`https://imhotep-memoires.pages.dev${verificationUrl}`);
    } catch {
      qrCodeDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    }

    const certificate = {
      id: certId,
      certificateNumber: certNum,
      thesisId,
      studentName: thesis.studentName,
      thesisTitle: thesis.title,
      filiere: thesis.filiere,
      university: thesis.university,
      issueDate: new Date().toISOString(),
      qrCodeUrl: qrCodeDataUrl,
      verificationUrl
    };

    db.certificates.set(certId, certificate);
    thesis.certificateId = certId;

    // Notification à l'étudiant
    db.notifications.set(`notif_${Date.now()}`, {
      id: `notif_${Date.now()}`,
      userId: thesis.studentId,
      title: 'Félicitations! Mémoire Validé & Publié 🎓',
      message: `Votre mémoire "${thesis.title.slice(0, 50)}..." a été validé et archivé. Votre certificat numérique est prêt.`,
      type: 'SUCCESS',
      read: false,
      linkUrl: `/thesis/${thesis.id}`,
      createdAt: new Date().toISOString()
    });

    // Audit Log
    db.auditLogs.unshift({
      id: `log_${Date.now()}`,
      userId: thesis.supervisorId,
      userName: thesis.supervisorName,
      action: 'VALIDATION_MÉMOIRE',
      module: 'THESIS',
      details: `Validation et publication du mémoire ${thesisId}`,
      ipAddress: '197.234.221.10',
      timestamp: new Date().toISOString()
    });

    return thesis;
  }

  static rejectThesis(thesisId: string, reason: string): Thesis {
    const thesis = db.theses.get(thesisId);
    if (!thesis) throw new Error('Mémoire introuvable.');

    thesis.status = 'CORRECTION_REQUISE';
    thesis.supervisorNotes = reason;

    // Notification à l'étudiant
    db.notifications.set(`notif_${Date.now()}`, {
      id: `notif_${Date.now()}`,
      userId: thesis.studentId,
      title: 'Demande de Corrections sur votre Mémoire 📝',
      message: `L'encadreur a sollicité des révisions: "${reason}"`,
      type: 'WARNING',
      read: false,
      linkUrl: `/dashboard/student`,
      createdAt: new Date().toISOString()
    });

    return thesis;
  }
}
