import React from 'react';
import { X, BookOpen, Film, Heart } from 'lucide-react';
import { MovieInfo } from '../types/game';

interface StoryReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie?: MovieInfo;
}

export const StoryReaderModal: React.FC<StoryReaderModalProps> = ({
  isOpen,
  onClose,
  movie
}) => {
  if (!isOpen || !movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0c0e17] border border-amber-500/30 overflow-hidden shadow-2xl flex flex-col h-[88vh] max-h-[750px]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/60 shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-vn-serif font-bold text-white tracking-wider">
              原著小說 ·《{movie.title}》
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Story Content Area with Elegant Typography */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Title lockup */}
          <div className="text-center pb-4 border-b border-white/10">
            <span className="text-[10px] font-vn-cinzel tracking-widest text-amber-400">
              {movie.subtitle}
            </span>
            <h1 className="text-xl font-vn-serif font-bold text-white tracking-widest mt-1">
              《{movie.title}》
            </h1>
            <p className="text-xs font-vn-serif text-slate-400 mt-1">
              作者：{movie.author || '白櫻蒼成'} · {movie.genre}
            </p>
            <p className="text-xs font-vn-serif text-amber-200/80 italic mt-2">
              「{movie.tagline}」
            </p>
          </div>

          {/* Full Markdown Text */}
          <div className="text-xs sm:text-sm font-vn-serif text-slate-200 leading-relaxed whitespace-pre-line tracking-wide selection:bg-amber-500/30">
            {movie.fullStoryMarkdown || movie.summary}
          </div>

          {/* Footnote */}
          <div className="pt-6 border-t border-white/10 text-center space-y-1">
            <p className="text-[11px] font-vn-serif text-amber-300">
              致幻技電影館 · 特約文創放映
            </p>
            <p className="text-[10px] font-vn-serif text-slate-500">
              文本及圖像創作：白櫻蒼成
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 bg-black/40 text-center shrink-0">
          <button
            onClick={onClose}
            className="min-h-[44px] w-full px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 font-vn-serif font-bold text-xs transition-colors"
          >
            關閉小說閱讀
          </button>
        </div>
      </div>
    </div>
  );
};
