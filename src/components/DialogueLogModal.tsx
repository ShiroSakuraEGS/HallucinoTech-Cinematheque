import React from 'react';
import { X, History } from 'lucide-react';

export interface LogEntry {
  speaker: string;
  text: string;
}

interface DialogueLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: LogEntry[];
}

export const DialogueLogModal: React.FC<DialogueLogModalProps> = ({
  isOpen,
  onClose,
  logs
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-sm rounded-2xl bg-[#0c0e16] border border-amber-500/30 overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/50">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-vn-serif font-bold text-white tracking-wider">
              對話回顧 · LOG
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Log stream */}
        <div className="p-4 flex flex-col gap-4 overflow-y-auto divide-y divide-white/5">
          {logs.length === 0 ? (
            <p className="text-xs text-slate-500 text-center font-vn-serif py-6">
              尚無對話記錄。
            </p>
          ) : (
            logs.map((entry, idx) => (
              <div key={idx} className="pt-3 first:pt-0">
                <span className="text-[11px] font-vn-serif font-bold text-amber-400 tracking-wider">
                  {entry.speaker || '旁白'}
                </span>
                <p className="text-xs sm:text-sm font-vn-serif text-slate-200 mt-1 leading-relaxed">
                  {entry.text}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
