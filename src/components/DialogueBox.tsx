import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, FastForward, Play, History, ChevronRight } from 'lucide-react';
import { sound } from '../utils/audio';

export interface ChoiceOption {
  text: string;
  action: () => void;
}

interface DialogueBoxProps {
  speaker: string;
  text: string;
  choices?: ChoiceOption[];
  onNext: () => void;
  canAdvance: boolean;
  onOpenLog: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  speaker,
  text,
  choices,
  onNext,
  canAdvance,
  onOpenLog,
  isMuted,
  onToggleMute
}) => {
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsTyping(true);

    const timer = setInterval(() => {
      index++;
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
        if (index % 3 === 0) {
          sound.playTypewriterClick();
        }
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 28);

    return () => clearInterval(timer);
  }, [text]);

  // Auto-play logic
  useEffect(() => {
    let autoTimer: number | null = null;
    if (autoPlay && !isTyping && !choices && canAdvance) {
      autoTimer = window.setTimeout(() => {
        onNext();
      }, 2200);
    }
    return () => {
      if (autoTimer) clearTimeout(autoTimer);
    };
  }, [autoPlay, isTyping, choices, canAdvance, onNext]);

  const handleBoxClick = () => {
    if (choices && choices.length > 0) return;

    if (isTyping) {
      // Complete text instantly
      setDisplayedText(text);
      setIsTyping(false);
    } else if (canAdvance) {
      onNext();
    }
  };

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between bg-gradient-to-t from-[#08090f] via-[#0d0f18] to-[#111422] p-4 border-t border-amber-500/20">
      {/* Top micro toolbar */}
      <div className="flex items-center justify-between pb-2 mb-1 border-b border-white/5">
        {/* Speaker Name Tag */}
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-3.5 bg-amber-500 rounded-sm" />
          <span className="text-xs font-vn-serif font-bold text-amber-300 tracking-widest uppercase">
            {speaker || '旁白'}
          </span>
        </div>

        {/* VN Utility Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={onOpenLog}
            className="min-h-[44px] px-2 flex items-center gap-1 text-[11px] font-vn-serif text-slate-400 hover:text-white transition-colors"
            title="對話回顧"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">歷史</span>
          </button>

          <button
            onClick={() => setAutoPlay((prev) => !prev)}
            className={`min-h-[44px] px-2 flex items-center gap-1 text-[11px] font-vn-serif transition-colors ${
              autoPlay ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="自動播放"
          >
            <Play className={`w-3.5 h-3.5 ${autoPlay ? 'fill-amber-400' : ''}`} />
            <span>AUTO</span>
          </button>

          <button
            onClick={onToggleMute}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            title="音效開關"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-400" />
            )}
          </button>
        </div>
      </div>

      {/* Main Dialogue Text Content Area */}
      <div
        onClick={handleBoxClick}
        className="flex-1 cursor-pointer py-1 flex flex-col justify-start"
      >
        <p className="text-sm sm:text-base font-vn-serif text-slate-100 leading-relaxed tracking-wide select-none min-h-[4.5rem]">
          {displayedText}
          {isTyping && (
            <span className="inline-block w-1.5 h-4 ml-1 bg-amber-400 animate-pulse align-middle" />
          )}
        </p>

        {/* Choice Branching Buttons */}
        {choices && choices.length > 0 && !isTyping && (
          <div className="mt-3 flex flex-col gap-2">
            {choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playChime(true);
                  choice.action();
                }}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-950/40 via-amber-900/30 to-black/60 hover:from-amber-900/60 hover:to-black/80 border border-amber-500/40 text-xs sm:text-sm font-vn-serif text-amber-100 flex items-center justify-between text-left transition-all active:scale-[0.99] shadow-lg shadow-black/40"
              >
                <span>{choice.text}</span>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Advance Prompt Indicator at Bottom Right */}
      {!choices && (
        <div
          onClick={handleBoxClick}
          className="flex justify-end pt-1 cursor-pointer"
        >
          <div className="flex items-center gap-1 text-[11px] font-vn-serif text-amber-400/80 animate-pulse select-none">
            <span>{isTyping ? '點擊跳過' : '點擊推進'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      )}
    </div>
  );
};
