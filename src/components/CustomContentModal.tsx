import React, { useState } from 'react';
import { X, Image as ImageIcon, Sliders, Check, RotateCcw } from 'lucide-react';
import { MovieId } from '../types/game';
import { MOVIES } from '../data/movies';

interface CustomContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  customClerkImage?: string;
  onSaveClerkImage: (dataUrl: string | undefined) => void;
  onSaveMoviePoster: (movieId: MovieId, dataUrl: string | undefined) => void;
}

export const CustomContentModal: React.FC<CustomContentModalProps> = ({
  isOpen,
  onClose,
  customClerkImage,
  onSaveClerkImage,
  onSaveMoviePoster
}) => {
  const [clerkPreview, setClerkPreview] = useState<string | undefined>(customClerkImage);
  const [selectedMovie, setSelectedMovie] = useState<MovieId>('xibuxi');

  if (!isOpen) return null;

  const handleClerkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setClerkPreview(url);
      onSaveClerkImage(url);
    };
    reader.readAsDataURL(file);
  };

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      onSaveMoviePoster(selectedMovie, url);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-sm rounded-2xl bg-[#0e1017] border border-amber-500/30 overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-vn-serif font-bold text-white tracking-wider">
              素材與文本自訂台
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-4 overflow-y-auto">
          <p className="text-[11px] font-vn-serif text-slate-400">
            預備支援創作者「白櫻蒼成」上傳自訂立繪圖像與海報。設定後即時生效並保存於本機。
          </p>

          {/* Clerk Image Setting */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex flex-col gap-2">
            <label className="text-xs font-vn-serif font-bold text-amber-300">
              1. 店員立繪圖像自訂
            </label>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg bg-black/60 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                {clerkPreview ? (
                  <img
                    src={clerkPreview}
                    alt="店員預覽"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] text-slate-500 text-center font-vn-serif">
                    預設立繪
                  </span>
                )}
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <input
                  type="file"
                  id="clerk-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleClerkUpload}
                />
                <label
                  htmlFor="clerk-upload"
                  className="cursor-pointer min-h-[36px] px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-vn-serif flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  上傳店員新立繪
                </label>
                {clerkPreview && (
                  <button
                    onClick={() => {
                      setClerkPreview(undefined);
                      onSaveClerkImage(undefined);
                    }}
                    className="text-[10px] text-slate-400 hover:text-rose-400 font-vn-serif flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    恢復電影館預設立繪
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Movie Poster Upload */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex flex-col gap-2">
            <label className="text-xs font-vn-serif font-bold text-amber-300">
              2. 電影海報自訂更換
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(MOVIES) as MovieId[]).map((id) => (
                <button
                  key={id}
                  onClick={() => setSelectedMovie(id)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-vn-serif text-left border transition-all ${
                    selectedMovie === id
                      ? 'bg-amber-500/20 border-amber-500/60 text-amber-200'
                      : 'bg-black/30 border-white/5 text-slate-400'
                  }`}
                >
                  {MOVIES[id].title}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <input
                type="file"
                id="poster-upload"
                accept="image/*"
                className="hidden"
                onChange={handlePosterUpload}
              />
              <label
                htmlFor="poster-upload"
                className="cursor-pointer min-h-[36px] w-full px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-vn-serif flex items-center justify-center gap-1.5 transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                更換《{MOVIES[selectedMovie].title}》海報圖
              </label>
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-white/10 bg-black/30 text-right">
          <button
            onClick={onClose}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-amber-500 text-black font-vn-serif font-bold text-xs hover:bg-amber-400 transition-colors"
          >
            完成儲存
          </button>
        </div>
      </div>
    </div>
  );
};
