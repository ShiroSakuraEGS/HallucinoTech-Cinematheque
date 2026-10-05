import React from 'react';
import { X, Film, CheckCircle2, Play, Sparkles } from 'lucide-react';
import { MovieInfo } from '../types/game';
import { MOVIES } from '../data/movies';

interface PosterCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectedMovieIds: string[];
  currentMovieId?: string;
  onSelectMovieToWatch: (movie: MovieInfo) => void;
  onReadStory?: (movie: MovieInfo) => void;
}

export const PosterCollectionModal: React.FC<PosterCollectionModalProps> = ({
  isOpen,
  onClose,
  collectedMovieIds,
  currentMovieId,
  onSelectMovieToWatch,
  onReadStory
}) => {
  if (!isOpen) return null;

  const allMovies = Object.values(MOVIES);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-sm rounded-2xl bg-[#0e1017] border border-amber-500/30 overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-vn-serif font-bold text-white tracking-wider">
              我的電影票夾與海報庫
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 flex flex-col gap-3 overflow-y-auto">
          <p className="text-[11px] font-vn-serif text-slate-400">
            你在致幻技電影館探索獲取的海報。點擊已收藏的海報，可隨時交由店員安排放映。
          </p>

          <div className="flex flex-col gap-2.5">
            {allMovies.map((movie) => {
              const isCollected = collectedMovieIds.includes(movie.id);
              const isCurrent = currentMovieId === movie.id;

              return (
                <div
                  key={movie.id}
                  className={`p-3 rounded-xl border transition-all flex flex-col gap-2 ${
                    isCollected
                      ? 'bg-[#151924] border-amber-500/40'
                      : 'bg-black/30 border-white/5 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center font-vn-serif font-bold text-sm shadow-sm"
                        style={{
                          backgroundColor: `${movie.themeColor}25`,
                          color: movie.themeColor,
                          border: `1px solid ${movie.themeColor}50`
                        }}
                      >
                        {movie.posterArt.symbol}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-vn-serif font-bold text-white">
                            《{movie.title}》
                          </h4>
                          {isCurrent && (
                            <span className="text-[9px] font-vn-cinzel px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-vn-serif">
                          {movie.genre} · {movie.duration}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      {isCollected ? (
                        <span className="text-[10px] font-vn-serif text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          已入庫
                        </span>
                      ) : (
                        <span className="text-[10px] font-vn-serif text-slate-500">
                          未解鎖
                        </span>
                      )}
                    </div>
                  </div>

                  {isCollected && (
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                      <p className="text-[10px] font-vn-serif text-amber-200/80 italic truncate flex-1">
                        {movie.posterArt.quote}
                      </p>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {onReadStory && (
                          <button
                            onClick={() => onReadStory(movie)}
                            className="min-h-[36px] px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-[11px] font-vn-serif"
                            title="閱讀白櫻蒼成原著小說"
                          >
                            小說
                          </button>
                        )}
                        <button
                          onClick={() => {
                            onSelectMovieToWatch(movie);
                            onClose();
                          }}
                          className="min-h-[36px] px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-[11px] font-vn-serif flex items-center gap-1"
                        >
                          <Play className="w-3 h-3 fill-amber-300" />
                          選擇觀看
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
