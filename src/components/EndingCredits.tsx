import React from 'react';
import { MovieInfo } from '../types/game';
import { RotateCcw, Film, Sliders, Heart, Share2, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface EndingCreditsProps {
  movie?: MovieInfo;
  onRestart: () => void;
  onOpenCollection: () => void;
  onOpenCustomizer: () => void;
}

export const EndingCredits: React.FC<EndingCreditsProps> = ({
  movie,
  onRestart,
  onOpenCollection,
  onOpenCustomizer
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    sound.playChime(true);
    const text = `我在「致幻技電影館」邂逅了《${movie?.title || '神秘電影'}》，還有那位雌雄莫辨、令人心動的可愛店員……✨ 文本及圖像創作：白櫻蒼成`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between bg-black p-6 text-center select-none overflow-y-auto">
      {/* Upper cinematic title */}
      <div className="space-y-4 pt-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-500/30 text-[11px] font-vn-cinzel text-amber-300">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>CURTAIN FALL · 體驗落幕</span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-vn-cinzel font-bold text-amber-100 tracking-widest drop-shadow-md">
            致幻技電影館
          </h1>
          <p className="text-[11px] font-vn-cinzel tracking-widest text-amber-500/80 mt-1">
            THE PHANTASM CINEMA
          </p>
        </div>

        {/* Watched Movie Recap Ticket */}
        {movie && (
          <div className="max-w-xs mx-auto p-3.5 rounded-xl bg-[#0f1118] border border-amber-500/30 shadow-lg text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
              <span className="text-[10px] font-vn-cinzel text-amber-400">
                OFFICIAL ADMISSION STUB
              </span>
              <span className="text-[10px] text-slate-400 font-vn-serif">
                入場兌換憑證
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-vn-serif font-black shadow-inner shrink-0"
                style={{
                  backgroundColor: `${movie.themeColor}25`,
                  color: movie.themeColor,
                  border: `1px solid ${movie.themeColor}60`
                }}
              >
                {movie.posterArt.symbol}
              </div>
              <div>
                <h3 className="text-sm font-vn-serif font-bold text-white">
                  《{movie.title}》
                </h3>
                <p className="text-[11px] font-vn-serif text-slate-400 italic line-clamp-1">
                  {movie.posterArt.quote}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Creator Attribution Section (Specifically requested by user) */}
        <div className="max-w-xs mx-auto py-5 my-2 border-t border-b border-white/10 space-y-2">
          <p className="text-xs font-vn-serif text-slate-400 tracking-wider">
            文本及圖像創作
          </p>
          <p className="text-xl font-vn-serif font-bold text-amber-200 tracking-widest">
            白 櫻 蒼 成
          </p>
          <p className="text-[10px] font-vn-serif text-slate-400 tracking-wide">
            「性別不明卻擁有雌雄同體的可愛外表……為什麼永遠都是這個人呢？」
          </p>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="max-w-xs mx-auto w-full pt-4 space-y-2">
        <button
          onClick={onRestart}
          className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-vn-serif font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          再次踏入電影館（重新體驗）
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onOpenCollection}
            className="min-h-[44px] px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-vn-serif text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Film className="w-3.5 h-3.5 text-amber-400" />
            查看票夾海報
          </button>

          <button
            onClick={onOpenCustomizer}
            className="min-h-[44px] px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-vn-serif text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            素材自訂
          </button>
        </div>

        <button
          onClick={handleShare}
          className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-black/40 hover:bg-white/5 border border-white/10 text-[11px] font-vn-serif text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-amber-400" />
          <span>{copied ? '已複製心動心得到剪貼簿！' : '分享這次的心動邂逅'}</span>
        </button>
      </div>
    </div>
  );
};
