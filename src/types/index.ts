export type UserRole = 'student' | 'supervisor' | 'visitor' | 'admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  university?: string;
  filiere?: string;
  niveau?: 'Licence' | 'Master' | 'Doctorat';
  matricule?: string;
  department?: string;
  phone?: string;
  createdAt: string;
  isVerified?: boolean;
  status?: 'active' | 'blocked';
}

export type ThesisStatus = 
  | 'DÉPOSÉ'           // Submitted by student
  | 'ANALYSE_IA'       // Under AI analysis
  | 'EXAMEN_ENCADREUR' // Waiting supervisor approval
  | 'VALIDÉ_ENCADREUR' // Approved by supervisor, pending admin
  | 'PUBLIÉ'           // Fully validated & published
  | 'CORRECTION_REQUISE'// Corrections requested
  | 'REJETÉ';          // Rejected

export interface JuryMember {
  name: string;
  title: string; // e.g. Président du jury, Rapporteur, Examinateur
  institution?: string;
}

export interface Thesis {
  id: string;
  title: string;
  abstract: string;
  keywords: string[];
  filiere: string;
  academicYear: string;
  studentId: string;
  studentName: string;
  studentMatricule?: string;
  university: string;
  supervisorId: string;
  supervisorName: string;
  juryMembers?: JuryMember[];
  pdfUrl: string;
  pdfFileName: string;
  pdfSizeMb: number;
  status: ThesisStatus;
  similarityScore?: number; // %
  aiReportId?: string;
  isPublic: boolean;
  priceFcfa: number; // For visitors (0 for free access if public)
  downloadsCount: number;
  viewsCount: number;
  submittedAt: string;
  validatedAt?: string;
  supervisorNotes?: string;
  certificateId?: string;
}

export interface ThemeCheckResult {
  similarityScore: number;
  duplicationRisk: 'FAIBLE' | 'MOYEN' | 'ÉLEVÉ';
  similarTopics: {
    title: string;
    similarity: number;
    year: string;
    author: string;
    filiere: string;
  }[];
  analysis: string;
  suggestions: string[];
  problematicFeedback?: string;
}

export interface PlagiarismMatch {
  passage: string;
  sourceTitle: string;
  sourceAuthor: string;
  similarityPercentage: number;
}

export interface PlagiarismReport {
  id: string;
  thesisId: string;
  thesisTitle: string;
  overallSimilarity: number;
  status: 'ACCEPTABLE' | 'REVISION_REQUISE' | 'RISQUE_ELEVE';
  citationsPercentage: number;
  paraphrasePercentage: number;
  exactMatchPercentage: number;
  matches: PlagiarismMatch[];
  recommendations: string[];
  generatedAt: string;
}

export type PaymentMethod = 'MTN_MOMO' | 'MOOV_MONEY' | 'CELTIS_CASH' | 'VISA_CARD';

export interface PaymentTransaction {
  id: string;
  userId: string;
  userName: string;
  thesisId: string;
  thesisTitle: string;
  amountFcfa: number;
  paymentMethod: PaymentMethod;
  phoneNumber?: string;
  transactionRef: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  paidAt?: string;
  createdAt: string;
  downloadToken?: string;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  thesisId: string;
  studentName: string;
  supervisorName?: string;
  thesisTitle: string;
  filiere: string;
  university: string;
  issueDate: string;
  qrCodeUrl: string;
  verificationUrl: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'THESIS_UPDATE' | 'PAYMENT';
  read: boolean;
  linkUrl?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  userName?: string;
  action: string;
  module: 'AUTH' | 'THESIS' | 'AI' | 'PAYMENT' | 'ADMIN' | 'CERTIFICATE';
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface Filiere {
  id: string;
  name: string;
  code: string;
  department: string;
  thesisCount: number;
  activeStudents: number;
}
