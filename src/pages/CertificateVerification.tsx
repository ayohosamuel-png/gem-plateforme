import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { Certificate } from '../types';
import { QrCode, Search, ShieldCheck, CheckCircle2, AlertTriangle, GraduationCap } from 'lucide-react';

interface CertificateVerificationProps {
  initialNumber?: string;
}

export const CertificateVerification: React.FC<CertificateVerificationProps> = ({ initialNumber }) => {
  const [certNumber, setCertNumber] = useState(initialNumber || 'CERT-2025-UAC-94812');
  const [cert, setCert] = useState<Certificate | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!certNumber.trim()) return;
    setLoading(true);
    setError('');
    setCert(null);

    try {
      const res = await apiFetch<{ data: Certificate }>(`/api/certificates/verify/${certNumber.trim()}`);
      setCert(res.data);
    } catch (err: any) {
      setError('Certificat non trouvé ou invalide. Vérifiez la saisie.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialNumber) handleVerify();
  }, [initialNumber]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center">
          <QrCode className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-white font-serif">Vérification Numérique de Certificat</h1>
        <p className="text-xs text-slate-400">
          Contrôle d'authenticité et d'intégrité par QR Code et registre national D1
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <QrCode className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={certNumber}
              onChange={(e) => setCertNumber(e.target.value)}
              placeholder="ex: CERT-2025-UAC-94812"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition flex items-center justify-center space-x-2 shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Vérifier</span>
          </button>
        </form>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Render Certificate Card */}
      {cert && (
        <div className="bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-8 shadow-2xl space-y-6 relative overflow-hidden animate-in fade-in duration-300">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-serif">
                  CERTIFICAT D'AUTHENTICITÉ DE MÉMOIRE
                </h2>
                <p className="text-[10px] text-amber-400 font-mono">№ OFFICIEL : {cert.certificateNumber}</p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>AUTHENTIQUE & CERTIFIÉ</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-8 space-y-3 text-xs text-slate-300">
              <p>
                Il est certifié que le mémoire de fin d'études intitulé :
              </p>
              <p className="text-sm font-bold text-white font-serif bg-slate-950 p-3 rounded-xl border border-slate-800">
                "{cert.thesisTitle}"
              </p>
              
              <div className="space-y-1 pt-2">
                <div>Auteur : <strong className="text-white">{cert.studentName}</strong></div>
                <div>Encadreur : <strong className="text-white">{cert.supervisorName}</strong></div>
                <div>Établissement : <strong className="text-amber-300">{cert.university}</strong></div>
                <div>Date d'Émission : <span className="font-mono text-slate-400">{new Date(cert.issueDate).toLocaleDateString('fr-FR')}</span></div>
                <div>Numéro Certificat : <span className="font-mono text-[10px] text-slate-400 font-bold block truncate">{cert.certificateNumber}</span></div>
              </div>
            </div>

            <div className="md:col-span-4 text-center bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <img
                src={`/api/certificates/${cert.id}/qr`}
                alt="QR Code Certificat"
                className="w-32 h-32 mx-auto rounded-lg border border-slate-800 bg-white p-1"
              />
              <span className="text-[10px] text-slate-400 font-mono block">Scannez pour vérifier</span>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
