import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ message = 'Chargement en cours...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
        <Loader2 className="w-6 h-6 text-amber-400 absolute inset-0 m-auto animate-pulse" />
      </div>
      <p className="text-sm font-medium text-slate-300 font-serif">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};
