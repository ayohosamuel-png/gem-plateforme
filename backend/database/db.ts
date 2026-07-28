import { User, Thesis, PlagiarismReport, PaymentTransaction, Certificate, Notification, AuditLog, Filiere } from '../../src/types/index.js';

// Base de données en mémoire synchronisée avec les schémas D1 Cloudflare pour le runtime
export class ImhotepDatabase {
  users: Map<string, User> = new Map();
  passwords: Map<string, string> = new Map();
  theses: Map<string, Thesis> = new Map();
  aiReports: Map<string, PlagiarismReport> = new Map();
  payments: Map<string, PaymentTransaction> = new Map();
  certificates: Map<string, Certificate> = new Map();
  notifications: Map<string, Notification> = new Map();
  auditLogs: AuditLog[] = [];
  filieres: Map<string, Filiere> = new Map();

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // 1. Filières
    const initialFilieres: Filiere[] = [
      { id: 'fil_1', name: 'Génie Informatique & Systèmes d\'Information', code: 'GISI', department: 'Informatique', thesisCount: 42, activeStudents: 120 },
      { id: 'fil_2', name: 'Informatique de Gestion & Sécurité SI', code: 'IGSSI', department: 'Informatique', thesisCount: 38, activeStudents: 95 },
      { id: 'fil_3', name: 'Finance, Banque & Microfinance', code: 'FBM', department: 'Gestion', thesisCount: 29, activeStudents: 85 },
      { id: 'fil_4', name: 'Marketing & Communication Digitale', code: 'MCD', department: 'Gestion', thesisCount: 21, activeStudents: 60 },
      { id: 'fil_5', name: 'Droit du Numérique & Cybersécurité', code: 'DNC', department: 'Droit', thesisCount: 15, activeStudents: 45 },
      { id: 'fil_6', name: 'Santé Publique & Biostatistiques', code: 'SPB', department: 'Santé', thesisCount: 18, activeStudents: 50 },
    ];
    initialFilieres.forEach(f => this.filieres.set(f.id, f));

    // 2. Utilisateurs de démonstration
    const seedUsers: (User & { pass: string })[] = [
      {
        id: 'usr_student_1',
        email: 'etudiant@uac.bj',
        pass: 'etudiant123',
        fullName: 'Koffi Samuel DOSSOU',
        role: 'student',
        university: 'Université d\'Abomey-Calavi (UAC)',
        filiere: 'Génie Informatique & Systèmes d\'Information',
        niveau: 'Master',
        matricule: '2021-08942-UAC',
        phone: '+229 97 00 11 22',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        createdAt: '2026-01-15T10:00:00Z',
        isVerified: true,
        status: 'active'
      },
      {
        id: 'usr_student_2',
        email: 'aimee.bio@uac.bj',
        pass: 'etudiant123',
        fullName: 'Aimée BIO',
        role: 'student',
        university: 'Université d\'Abomey-Calavi (UAC)',
        filiere: 'Informatique de Gestion & Sécurité SI',
        niveau: 'Licence',
        matricule: '2022-03112-UAC',
        phone: '+229 66 12 34 56',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
        createdAt: '2026-02-10T11:00:00Z',
        isVerified: true,
        status: 'active'
      },
      {
        id: 'usr_supervisor_1',
        email: 'prof.houessou@uac.bj',
        pass: 'prof123',
        fullName: 'Prof. Florent HOUESSOU',
        role: 'supervisor',
        university: 'Université d\'Abomey-Calavi (UAC)',
        filiere: 'Génie Informatique & Systèmes d\'Information',
        department: 'Institut de Formation et de Recherche en Informatique (IFRI)',
        phone: '+229 95 44 33 22',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        createdAt: '2025-09-01T08:00:00Z',
        isVerified: true,
        status: 'active'
      },
      {
        id: 'usr_supervisor_2',
        email: 'dr.adebayo@uac.bj',
        pass: 'prof123',
        fullName: 'Dr. Chantal ADEBAYO',
        role: 'supervisor',
        university: 'Université d\'Abomey-Calavi (UAC)',
        filiere: 'Finance, Banque & Microfinance',
        department: 'Ecole Nationale d\'Economie Appliquée et de Management (ENEAM)',
        phone: '+229 96 88 77 66',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        createdAt: '2025-09-01T08:00:00Z',
        isVerified: true,
        status: 'active'
      },
      {
        id: 'usr_visitor_1',
        email: 'visiteur@gmail.com',
        pass: 'visiteur123',
        fullName: 'Jean-Marc TCHIBOZO',
        role: 'visitor',
        phone: '+229 90 12 55 66',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        createdAt: '2026-03-01T14:30:00Z',
        isVerified: true,
        status: 'active'
      },
      {
        id: 'usr_admin_1',
        email: 'admin@imhotep-memoires.bj',
        pass: 'admin123',
        fullName: 'Dr. Aminata KOUATÉ (Admin Chef)',
        role: 'admin',
        university: 'Ministère de l\'Enseignement Supérieur et de la Recherche',
        phone: '+229 21 30 00 00',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
        createdAt: '2025-01-01T00:00:00Z',
        isVerified: true,
        status: 'active'
      }
    ];

    seedUsers.forEach(u => {
      const { pass, ...userData } = u;
      this.users.set(u.id, userData);
      this.passwords.set(u.email.toLowerCase(), pass);
    });

    // 3. Mémoires de démonstration
    const seedTheses: Thesis[] = [
      {
        id: 'ths_101',
        title: 'Système d\'Intelligence Artificielle pour la Détection Précoce du Paludisme en Milieu Rural Béninois',
        abstract: 'Ce travail propose un modèle de vision par ordinateur basé sur les réseaux de neurones convolutifs (CNN) pour l\'analyse automatisée de frottis sanguins. L\'objectif est d\'assister les agents de santé communautaires dans les zones reculées en fournissant un diagnostic rapide avec une précision globale de 96.4%.',
        keywords: ['Intelligence Artificielle', 'Deep Learning', 'Diagnostic Médical', 'Santé Publique', 'Vision par Ordinateur'],
        filiere: 'Génie Informatique & Systèmes d\'Information',
        academicYear: '2024-2025',
        studentId: 'usr_student_1',
        studentName: 'Koffi Samuel DOSSOU',
        studentMatricule: '2021-08942-UAC',
        university: 'Université d\'Abomey-Calavi (UAC)',
        supervisorId: 'usr_supervisor_1',
        supervisorName: 'Prof. Florent HOUESSOU',
        juryMembers: [
          { name: 'Prof. Eugene EZOUN', title: 'Président du Jury', institution: 'IFRI / UAC' },
          { name: 'Dr. Simplice AGOSSOU', title: 'Rapporteur', institution: 'EPAC / UAC' }
        ],
        pdfUrl: '/api/theses/ths_101/pdf',
        pdfFileName: 'Mémoire_DOSSOU_Samuel_IA_Paludisme_2025.pdf',
        pdfSizeMb: 4.8,
        status: 'PUBLIÉ',
        similarityScore: 8.2,
        aiReportId: 'rep_101',
        isPublic: true,
        priceFcfa: 2500,
        downloadsCount: 142,
        viewsCount: 680,
        submittedAt: '2025-06-15T09:30:00Z',
        validatedAt: '2025-07-02T16:00:00Z',
        supervisorNotes: 'Excellente qualité scientifique, démonstration pratique concluante.',
        certificateId: 'cert_101'
      },
      {
        id: 'ths_102',
        title: 'Architecture Blockchain Sécurisée pour l\'Interopérabilité des Paiements Mobile Money en Afrique de l\'Ouest',
        abstract: 'L\'interopérabilité des services de Mobile Money (MTN, Moov, Wave) constitue un enjeu majeur pour l\'inclusion financière. Ce mémoire conçoit un protocole basé sur un registre distribué privé garantissant l\'immuabilité des transactions et la réduction des frais interbancaires.',
        keywords: ['Blockchain', 'Mobile Money', 'Fintech', 'Sécurité Informatique', 'Inclusion Financière'],
        filiere: 'Informatique de Gestion & Sécurité SI',
        academicYear: '2024-2025',
        studentId: 'usr_student_2',
        studentName: 'Aimée BIO',
        studentMatricule: '2022-03112-UAC',
        university: 'Université d\'Abomey-Calavi (UAC)',
        supervisorId: 'usr_supervisor_1',
        supervisorName: 'Prof. Florent HOUESSOU',
        juryMembers: [
          { name: 'Dr. Martial KPANOU', title: 'Président du Jury', institution: 'ENEAM' }
        ],
        pdfUrl: '/api/theses/ths_102/pdf',
        pdfFileName: 'Mémoire_BIO_Aimee_Blockchain_MoMo_2025.pdf',
        pdfSizeMb: 6.2,
        status: 'PUBLIÉ',
        similarityScore: 11.5,
        aiReportId: 'rep_102',
        isPublic: true,
        priceFcfa: 3000,
        downloadsCount: 98,
        viewsCount: 420,
        submittedAt: '2025-07-10T14:15:00Z',
        validatedAt: '2025-07-20T10:00:00Z',
        supervisorNotes: 'Problématique très actuelle, méthodologie rigoureuse.',
        certificateId: 'cert_102'
      },
      {
        id: 'ths_103',
        title: 'Impact de la Microfinance Digitale sur la Résilience des Femmes Entrepreneures en Milieu Peri-Urbain au Bénin',
        abstract: 'Étude empirique menée auprès de 450 femmes commerçantes dans les marchés de Cotonou et Porto-Novo pour mesurer l\'impact de l\'octroi de crédits instantanés par téléphonie mobile sur leur chiffre d\'affaires et leur autonomie économique.',
        keywords: ['Microfinance', 'Digitalisation', 'Entrepreneuriat Féminin', 'Inclusion Financière', 'Économie Publique'],
        filiere: 'Finance, Banque & Microfinance',
        academicYear: '2024-2025',
        studentId: 'usr_student_1',
        studentName: 'Koffi Samuel DOSSOU',
        university: 'Université d\'Abomey-Calavi (UAC)',
        supervisorId: 'usr_supervisor_2',
        supervisorName: 'Dr. Chantal ADEBAYO',
        pdfUrl: '/api/theses/ths_103/pdf',
        pdfFileName: 'Memoire_Microfinance_Digitale_Benin.pdf',
        pdfSizeMb: 3.5,
        status: 'EXAMEN_ENCADREUR',
        similarityScore: 14.8,
        aiReportId: 'rep_103',
        isPublic: false,
        priceFcfa: 2500,
        downloadsCount: 12,
        viewsCount: 89,
        submittedAt: '2026-07-01T11:20:00Z'
      },
      {
        id: 'ths_104',
        title: 'Cadre Juridique de la Protection des Données Personnelles dans la Stratégie Nationale d\'Intelligence Artificielle au Bénin',
        abstract: 'Analyse comparative du Code du Numérique du Bénin et du RGPD européen face aux enjeux de collecte massive de données pour l\'entraînement des algorithmes de Machine Learning.',
        keywords: ['Droit du Numérique', 'Protection des Données', 'RGPD', 'Code du Numérique', 'Intelligence Artificielle'],
        filiere: 'Droit du Numérique & Cybersécurité',
        academicYear: '2023-2024',
        studentId: 'usr_student_2',
        studentName: 'Aimée BIO',
        university: 'Université d\'Abomey-Calavi (UAC)',
        supervisorId: 'usr_supervisor_2',
        supervisorName: 'Dr. Chantal ADEBAYO',
        pdfUrl: '/api/theses/ths_104/pdf',
        pdfFileName: 'Droit_Numerique_Donnees_IA_Benin.pdf',
        pdfSizeMb: 5.1,
        status: 'PUBLIÉ',
        similarityScore: 9.0,
        aiReportId: 'rep_104',
        isPublic: true,
        priceFcfa: 2000,
        downloadsCount: 215,
        viewsCount: 1100,
        submittedAt: '2024-06-18T10:00:00Z',
        validatedAt: '2024-07-01T09:00:00Z',
        certificateId: 'cert_104'
      }
    ];

    seedTheses.forEach(t => this.theses.set(t.id, t));

    // 4. Rapports IA de démonstration
    const seedReports: PlagiarismReport[] = [
      {
        id: 'rep_101',
        thesisId: 'ths_101',
        thesisTitle: 'Système d\'Intelligence Artificielle pour la Détection Précoce du Paludisme en Milieu Rural Béninois',
        overallSimilarity: 8.2,
        status: 'ACCEPTABLE',
        citationsPercentage: 6.0,
        paraphrasePercentage: 1.8,
        exactMatchPercentage: 0.4,
        matches: [
          {
            passage: 'Le paludisme demeure l\'une des principales causes de morbidité et de mortalité en Afrique subsaharienne selon l\'OMS.',
            sourceTitle: 'Rapport Annuel sur le Paludisme dans le Monde',
            sourceAuthor: 'Organisation Mondiale de la Santé (2023)',
            similarityPercentage: 92.0
          }
        ],
        recommendations: [
          'Taux de similitude très satisfaisant (< 15%).',
          'Toutes les citations d\'auteurs scientifiques sont dûment référencées en style APA.',
          'Validation recommandée sans modification requise.'
        ],
        generatedAt: '2025-06-15T09:35:00Z'
      },
      {
        id: 'rep_102',
        thesisId: 'ths_102',
        thesisTitle: 'Architecture Blockchain Sécurisée pour l\'Interopérabilité des Paiements Mobile Money en Afrique de l\'Ouest',
        overallSimilarity: 11.5,
        status: 'ACCEPTABLE',
        citationsPercentage: 8.2,
        paraphrasePercentage: 2.5,
        exactMatchPercentage: 0.8,
        matches: [
          {
            passage: 'L\'interopérabilité permet l\'échange transparent de valeurs financières entre différentes plateformes d\'argent mobile.',
            sourceTitle: 'Rapport sur la Fintech et l\'Inclusion Financière en UEMOA',
            sourceAuthor: 'BCEAO (2022)',
            similarityPercentage: 88.0
          }
        ],
        recommendations: [
          'Seuil d\'acceptabilité respecté.',
          'S\'assurer de la mise à jour des liens d\'accès aux textes réglementaires de la BCEAO dans la bibliographie.'
        ],
        generatedAt: '2025-07-10T14:20:00Z'
      }
    ];
    seedReports.forEach(r => this.aiReports.set(r.id, r));

    // 5. Certificats
    const seedCertificates: Certificate[] = [
      {
        id: 'cert_101',
        certificateNumber: 'IMH-2025-UAC-00891',
        thesisId: 'ths_101',
        studentName: 'Koffi Samuel DOSSOU',
        thesisTitle: 'Système d\'Intelligence Artificielle pour la Détection Précoce du Paludisme en Milieu Rural Béninois',
        filiere: 'Génie Informatique & Systèmes d\'Information',
        university: 'Université d\'Abomey-Calavi (UAC)',
        issueDate: '2025-07-02T16:00:00Z',
        qrCodeUrl: '/api/certificates/cert_101/qr',
        verificationUrl: '/verify-certificate/IMH-2025-UAC-00891'
      },
      {
        id: 'cert_102',
        certificateNumber: 'IMH-2025-UAC-00942',
        thesisId: 'ths_102',
        studentName: 'Aimée BIO',
        thesisTitle: 'Architecture Blockchain Sécurisée pour l\'Interopérabilité des Paiements Mobile Money en Afrique de l\'Ouest',
        filiere: 'Informatique de Gestion & Sécurité SI',
        university: 'Université d\'Abomey-Calavi (UAC)',
        issueDate: '2025-07-20T10:00:00Z',
        qrCodeUrl: '/api/certificates/cert_102/qr',
        verificationUrl: '/verify-certificate/IMH-2025-UAC-00942'
      }
    ];
    seedCertificates.forEach(c => this.certificates.set(c.id, c));

    // 6. Paiement initial pour visiteur
    const seedPayment: PaymentTransaction = {
      id: 'pay_301',
      userId: 'usr_visitor_1',
      userName: 'Jean-Marc TCHIBOZO',
      thesisId: 'ths_101',
      thesisTitle: 'Système d\'Intelligence Artificielle pour la Détection Précoce du Paludisme en Milieu Rural Béninois',
      amountFcfa: 2500,
      paymentMethod: 'MTN_MOMO',
      phoneNumber: '+229 97 88 99 00',
      transactionRef: 'MTN-BJ-20260720-8912',
      status: 'SUCCESS',
      downloadToken: 'dl_tok_99812_ths_101',
      paidAt: '2026-07-20T15:10:00Z',
      createdAt: '2026-07-20T15:08:00Z'
    };
    this.payments.set(seedPayment.id, seedPayment);

    // 7. Notifications
    const seedNotifs: Notification[] = [
      {
        id: 'notif_1',
        userId: 'usr_student_1',
        title: 'Validation de Mémoire Réussie 🎉',
        message: 'Votre mémoire sur l\'IA & le Paludisme a été validé par le Prof. Florent HOUESSOU et publié.',
        type: 'SUCCESS',
        read: false,
        linkUrl: '/thesis/ths_101',
        createdAt: '2025-07-02T16:05:00Z'
      },
      {
        id: 'notif_2',
        userId: 'usr_supervisor_1',
        title: 'Nouveau Dépôt de Mémoire 📥',
        message: 'L\'étudiante Aimée BIO a soumis son sujet de mémoire pour examen.',
        type: 'THESIS_UPDATE',
        read: true,
        linkUrl: '/dashboard/supervisor',
        createdAt: '2025-07-10T14:16:00Z'
      }
    ];
    seedNotifs.forEach(n => this.notifications.set(n.id, n));

    // 8. Audit Logs
    this.auditLogs.push(
      {
        id: 'log_1',
        userId: 'usr_admin_1',
        userName: 'Dr. Aminata KOUATÉ',
        action: 'INITIALISATION_SYSTÈME',
        module: 'ADMIN',
        details: 'Démarrage du conteneur Cloudflare Workers & D1 Database',
        ipAddress: '127.0.0.1',
        timestamp: '2026-07-28T06:00:00Z'
      },
      {
        id: 'log_2',
        userId: 'usr_student_1',
        userName: 'Koffi Samuel DOSSOU',
        action: 'DÉPÔT_MÉMOIRE',
        module: 'THESIS',
        details: 'Soumission du document ths_101 avec rapport IA généré',
        ipAddress: '41.85.160.22',
        timestamp: '2025-06-15T09:30:00Z'
      }
    );
  }
}

export const db = new ImhotepDatabase();
