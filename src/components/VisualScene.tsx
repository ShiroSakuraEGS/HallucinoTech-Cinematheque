import React from 'react';
import { MovieInfo, SceneType } from '../types/game';
import { Film, Sparkles, Moon, Eye, Tv, Heart } from 'lucide-react';

interface VisualSceneProps {
  scene: SceneType;
  movie?: MovieInfo;
  customClerkImage?: string;
  isBlushing?: boolean;
  onOpenStory?: () => void;
}

export const VisualScene: React.FC<VisualSceneProps> = ({
  scene,
  movie,
  customClerkImage,
  isBlushing,
  onOpenStory
}) => {
  return (
    <div className="relative w-full h-[48vh] sm:h-[52vh] max-h-[460px] overflow-hidden bg-black select-none border-b border-amber-950/40">
      {/* Film grain & vignette overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none film-grain opacity-40 mix-blend-overlay" />
      <div className="absolute inset-0 z-20 pointer-events-none film-vignette opacity-80" />
      <div className="absolute inset-0 z-20 pointer-events-none screen-scanlines opacity-25" />

      {/* Dynamic Scene Renderer */}
      {renderSceneContent(scene, movie, customClerkImage, isBlushing, onOpenStory)}

      {/* Top subtle location badge */}
      <div className="absolute top-3 left-4 z-30 flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-vn-cinzel tracking-wider text-amber-200/80">
        <Film className="w-3 h-3 text-amber-400" />
        <span>{getSceneLocationName(scene)}</span>
      </div>
    </div>
  );
};

function getSceneLocationName(scene: SceneType): string {
  switch (scene) {
    case 'INTRO':
      return 'CINEMA FAÇADE · 幽巷入口';
    case 'COUNTER':
    case 'QR_PROMPT':
      return 'TICKET BOOTH · 昏暗票台';
    case 'POSTER_DECISION':
      return 'FILM ARCHIVE · 膠卷配對';
    case 'THEATER_WALK':
      return 'SHADOW CORRIDOR · 迴廊深處';
    case 'THEATER_WATCHING':
      return 'SCREENING ROOM 04 · 放映中';
    case 'CLERK_WHISPER':
      return 'ROW 07 · 耳語相伴';
    case 'CLERK_REVEAL':
    case 'HEART_FLUTTER':
      return 'ENCOUNTER · 怦然揭幕';
    case 'ENDING_CREDITS':
      return 'CURTAIN CALL · 落幕';
    default:
      return '致幻技電影館';
  }
}

function renderSceneContent(
  scene: SceneType,
  movie?: MovieInfo,
  customClerkImage?: string,
  isBlushing?: boolean,
  onOpenStory?: () => void
) {
  switch (scene) {
    case 'INTRO':
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-end pb-8 bg-gradient-to-b from-[#090b10] via-[#10141d] to-[#08090d]">
          {/* Distant streetlamp and dilapidated neon */}
          <div className="absolute top-8 w-64 h-24 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          
          {/* Cinema Facade Silhouette SVG */}
          <svg className="w-full h-full absolute inset-0 opacity-80" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e2430" />
                <stop offset="100%" stopColor="#0a0d14" />
              </linearGradient>
              <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            {/* Old art deco architecture */}
            <path d="M 40,300 L 40,90 L 80,70 L 320,70 L 360,90 L 360,300 Z" fill="url(#wallGrad)" />
            {/* Decaying marquee */}
            <rect x="65" y="110" width="270" height="42" rx="4" fill="#0b0e14" stroke="#d97706" strokeWidth="2" strokeDasharray="6 3" />
            <text x="200" y="137" fill="#fbbf24" textAnchor="middle" fontSize="19" fontFamily="Noto Serif TC, serif" fontWeight="900" letterSpacing="4">
              致 幻 技 電 影 館
            </text>
            {/* Entrance doors shrouded in shadow */}
            <rect x="145" y="180" width="110" height="120" rx="3" fill="#05070a" stroke="#374151" strokeWidth="1.5" />
            {/* Warm light leaking from under door */}
            <ellipse cx="200" cy="298" rx="60" ry="12" fill="#f59e0b" opacity="0.3" />
            <line x1="145" y1="298" x2="255" y2="298" stroke="#fbbf24" strokeWidth="2" opacity="0.8" />
          </svg>

          {/* Floating dust motes */}
          <div className="absolute inset-0 pointer-events-none flex justify-around">
            <span className="w-1 h-1 bg-amber-200/40 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
            <span className="w-1.5 h-1.5 bg-amber-300/30 rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
          </div>

          <div className="relative z-10 text-center px-6">
            <p className="text-xs font-vn-cinzel tracking-widest text-amber-500/70 mb-1">HALLUCINATORY CINEMA</p>
            <p className="text-sm font-vn-serif text-slate-300/80 italic">隱匿於巷弄幽暗處的老牌放映館……</p>
          </div>
        </div>
      );

    case 'COUNTER':
    case 'QR_PROMPT':
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-[#06070a] via-[#0d1017] to-[#040507]">
          {/* Amber desk lamp cone of light */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-96 bg-gradient-to-b from-amber-500/20 via-amber-600/5 to-transparent blur-2xl pointer-events-none" />

          {/* Mysterious Counter & Silhouette SVG */}
          <svg className="w-full h-full absolute inset-0" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient id="lampGlow" cx="50%" cy="30%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#b45309" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Counter window glass reflections */}
            <rect x="50" y="30" width="300" height="200" rx="10" fill="#090d14" stroke="#1f2937" strokeWidth="2" />
            <line x1="80" y1="40" x2="160" y2="220" stroke="#ffffff" strokeWidth="1" opacity="0.04" />

            {/* Brass vintage desk lamp */}
            <circle cx="280" cy="180" r="45" fill="url(#lampGlow)" />
            <path d="M 280,140 Q 285,160 280,185" stroke="#d97706" strokeWidth="3" fill="none" />
            <ellipse cx="280" cy="140" rx="18" ry="8" fill="#f59e0b" opacity="0.9" />

            {/* Mystery Clerk Silhouette - Too dark to see face! */}
            <g className="animate-film-flicker">
              {/* Shoulders and chest in dark shadow */}
              <path d="M 120,300 C 130,220 160,205 200,205 C 240,205 270,220 280,300 Z" fill="#06080d" />
              {/* Slender neck & chin */}
              <path d="M 188,210 L 188,185 L 212,185 L 212,210 Z" fill="#080b12" />
              {/* Head and soft hair silhouette */}
              <circle cx="200" cy="155" r="32" fill="#05070a" />
              <path d="M 166,155 C 166,120 180,115 200,115 C 220,115 234,120 234,155 C 230,175 220,185 200,185 C 180,185 170,175 166,155 Z" fill="#06090e" />
              
              {/* Ethereal glowing eye glimpse in shadows */}
              <circle cx="192" cy="153" r="1.5" fill="#fef3c7" opacity="0.45" />
              <circle cx="208" cy="153" r="1.5" fill="#fef3c7" opacity="0.45" />
            </g>

            {/* Ticket Counter Surface */}
            <rect x="30" y="240" width="340" height="60" fill="#111827" stroke="#4b5563" strokeWidth="1" />
            {/* Old brass bell on counter */}
            <ellipse cx="140" cy="244" rx="12" ry="4" fill="#b45309" />
            <path d="M 132,244 C 132,236 148,236 148,244 Z" fill="#f59e0b" />
            {/* QR scanner slot glowing gently */}
            {scene === 'QR_PROMPT' && (
              <g>
                <rect x="180" y="248" width="40" height="8" rx="2" fill="#ef4444" opacity="0.8" className="animate-pulse" />
                <polygon points="180,248 130,295 270,295 220,248" fill="rgba(239, 68, 68, 0.08)" />
              </g>
            )}
          </svg>

          <div className="absolute bottom-4 text-center z-10 px-4">
            <span className="text-[11px] font-vn-serif text-amber-200/60 tracking-wider">
              {scene === 'QR_PROMPT' ? '「請出示您的 QR Code……」' : '「請問……是要來看電影的嗎？」'}
            </span>
          </div>
        </div>
      );

    case 'POSTER_DECISION':
      if (!movie) return null;
      return (
        <div className={`relative w-full h-full flex items-center justify-center p-2.5 bg-gradient-to-b ${movie.gradientBg}`}>
          {/* Subtle background glow */}
          <div
            className="absolute inset-0 opacity-40 blur-2xl"
            style={{ background: movie.posterArt.bgPattern }}
          />

          {/* Film Poster Card */}
          <div className="relative z-10 w-full max-w-[280px] h-[95%] rounded-xl overflow-hidden border border-amber-500/40 bg-[#0c0d14]/95 shadow-2xl flex flex-col justify-between p-3.5">
            {/* Poster Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
              <span className="text-[10px] font-vn-cinzel tracking-widest text-amber-400">
                PHANTASM ARCHIVE
              </span>
              <div className="flex items-center gap-2">
                {onOpenStory && (
                  <button
                    onClick={onOpenStory}
                    className="text-[10px] font-vn-serif px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors"
                  >
                    原著小說
                  </button>
                )}
                <span className="text-[10px] text-slate-400 font-vn-serif">
                  {movie.duration}
                </span>
              </div>
            </div>

            {/* Poster Center Visual Image or Symbol */}
            {movie.customImageUrl ? (
              <div className="relative my-1 w-full flex-1 max-h-[160px] rounded-lg overflow-hidden border border-white/15 bg-black/80 flex items-center justify-center group">
                <img
                  src={movie.customImageUrl}
                  alt={movie.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to stylized SVG if image path not found
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="relative my-auto flex flex-col items-center justify-center py-2">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg text-3xl font-vn-serif font-black mb-1.5 animate-pulse-glow"
                  style={{
                    color: movie.themeColor,
                    borderColor: movie.themeColor,
                    boxShadow: `0 0 30px ${movie.posterArt.accentGlow}`
                  }}
                >
                  {movie.posterArt.symbol}
                </div>
                <h3 className="text-lg font-vn-serif font-bold text-white tracking-widest">
                  {movie.title}
                </h3>
                <p className="text-[9px] font-vn-cinzel text-slate-400 tracking-wider mt-0.5">
                  {movie.subtitle}
                </p>
              </div>
            )}

            {/* Poster Footer Info */}
            <div className="pt-1.5 border-t border-white/10 text-center">
              <h4 className="text-xs font-vn-serif font-bold text-white tracking-wider">
                《{movie.title}》
              </h4>
              <p className="text-[10px] font-vn-serif text-amber-200/90 italic line-clamp-1 mb-1">
                {movie.posterArt.quote}
              </p>
              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-vn-serif">
                <span>{movie.genre}</span>
                <span>·</span>
                <span className="text-amber-400">白櫻蒼成 著</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'THEATER_WALK':
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#07090e]">
          {/* Vanishing point corridor SVG */}
          <svg className="w-full h-full absolute inset-0" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
            {/* Ceiling, walls, carpet */}
            <polygon points="0,0 400,0 240,130 160,130" fill="#050608" />
            <polygon points="0,300 400,300 240,160 160,160" fill="#4c0519" opacity="0.6" />
            <polygon points="0,0 0,300 160,160 160,130" fill="#0a0d13" />
            <polygon points="400,0 400,300 240,160 240,130" fill="#0a0d13" />
            {/* End door light */}
            <rect x="175" y="132" width="50" height="28" fill="#f59e0b" opacity="0.3" />
            {/* Wall amber sconces */}
            <circle cx="80" cy="140" r="3" fill="#f59e0b" />
            <circle cx="320" cy="140" r="3" fill="#f59e0b" />
            {/* Shadows */}
            <ellipse cx="200" cy="160" rx="30" ry="6" fill="#000" opacity="0.7" />
          </svg>
          <div className="relative z-10 text-center px-6">
            <p className="text-xs font-vn-cinzel tracking-widest text-amber-400/80 mb-1">PROCEEDING IN SILENCE</p>
            <p className="text-sm font-vn-serif text-slate-300">走在厚重暗紅的地毯上，店員在前方引領著……</p>
          </div>
        </div>
      );

    case 'THEATER_WATCHING':
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-4 bg-[#05060a]">
          {/* Projector beam cutting across the room */}
          <div
            className="absolute top-0 right-10 w-96 h-full bg-gradient-to-bl from-white/15 via-white/5 to-transparent blur-md pointer-events-none transform -rotate-12 origin-top-right"
          />

          {/* Big Cinema Screen */}
          <div className="relative z-10 w-full max-w-[340px] h-[65%] mt-2 rounded-lg overflow-hidden border border-white/20 shadow-2xl bg-black flex flex-col items-center justify-center p-4">
            {/* Subtle glow of the movie */}
            <div
              className="absolute inset-0 opacity-30 animate-pulse"
              style={{ backgroundColor: movie?.themeColor || '#e11d48' }}
            />
            {/* Film frame projection */}
            <div className="relative text-center z-10">
              <span className="text-2xl font-vn-serif font-black tracking-widest text-white/90 drop-shadow-md">
                《{movie?.title || '電影放映中'}》
              </span>
              <p className="text-xs text-amber-200/80 font-vn-serif mt-2 tracking-wide max-w-xs px-2 line-clamp-2">
                {movie?.summary}
              </p>
            </div>
            {/* Scanline bar passing through */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 animate-bounce" />
          </div>

          {/* Empty Theater Seat Silhouettes */}
          <div className="relative z-10 w-full flex justify-between px-6 opacity-60">
            <div className="w-16 h-8 bg-neutral-900 rounded-t-lg border-t border-neutral-700" />
            <div className="w-16 h-8 bg-neutral-900 rounded-t-lg border-t border-neutral-700" />
            <div className="w-16 h-8 bg-neutral-900 rounded-t-lg border-t border-neutral-700" />
          </div>
        </div>
      );

    case 'CLERK_WHISPER':
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-[#07080d]">
          {/* Dim projection light bouncing onto clerk beside player */}
          <div
            className="absolute inset-0 opacity-20"
            style={{ backgroundColor: movie?.themeColor || '#f59e0b' }}
          />

          {/* Intimate Silhouette beside player */}
          <svg className="w-full h-full absolute inset-0" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
            {/* Theater velvet seats */}
            <path d="M 0,260 L 400,260 L 400,300 L 0,300 Z" fill="#2d0611" />
            {/* Clerk leaning in close from the right */}
            <g className="animate-pulse" style={{ animationDuration: '4s' }}>
              {/* Torso leaning */}
              <path d="M 230,300 C 240,210 270,180 320,180 C 370,180 390,210 400,300 Z" fill="#090c14" />
              {/* Soft hair contour */}
              <circle cx="310" cy="140" r="38" fill="#070a10" />
              {/* Side profile silhouette leaning towards player */}
              <path d="M 285,142 Q 295,145 285,155 Q 295,160 286,165" stroke="#fef08a" strokeWidth="1" fill="none" opacity="0.6" />
              {/* Whispering breath particle or soft aura */}
              <ellipse cx="270" cy="160" rx="15" ry="8" fill="#fef08a" opacity="0.1" />
            </g>
          </svg>

          <div className="absolute top-6 left-6 z-10">
            <span className="flex items-center gap-1.5 text-xs font-vn-serif text-amber-300 bg-black/60 px-3 py-1 rounded-full border border-amber-500/20">
              <Sparkles className="w-3 h-3 text-amber-400" />
              身旁的溫熱氣息
            </span>
          </div>
        </div>
      );

    case 'CLERK_REVEAL':
    case 'HEART_FLUTTER':
      if (customClerkImage) {
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#14121a] via-[#1a141b] to-[#0d090e] overflow-hidden">
            {/* Subtle glow behind the clerk */}
            <div className="absolute top-4 w-72 h-72 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />

            <img
              src={customClerkImage}
              alt="致幻技電影館店員"
              referrerPolicy="no-referrer"
              className="relative z-10 w-full h-full object-contain object-bottom drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
            />

            {/* Warm soft lighting scrim */}
            <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
            {isBlushing && (
              <div className="absolute inset-0 z-20 bg-rose-500/20 pointer-events-none mix-blend-color transition-opacity duration-700" />
            )}

            {/* Heart pulse visual indicator */}
            <div className="absolute bottom-4 z-30 flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-[11px] font-vn-serif text-rose-200 shadow-lg backdrop-blur-sm">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-500 animate-pulse" />
              <span>心動的瞬間 · 為什麼永遠都是這個……</span>
            </div>
          </div>
        );
      }

      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#14121a] via-[#1a141b] to-[#0d090e]">
          {/* Golden gentle theater illumination */}
          <div className="absolute top-2 w-72 h-72 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />
          {isBlushing && (
            <div className="absolute inset-0 bg-rose-500/10 pointer-events-none transition-opacity duration-1000" />
          )}

          {/* Stylized High-Fidelity Character Portrait of the Androgynous Cute Clerk */}
          <svg className="w-full h-full absolute inset-0" viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2a222e" />
                <stop offset="100%" stopColor="#141117" />
              </linearGradient>
              <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fff1e8" />
                <stop offset="100%" stopColor="#fed7aa" />
              </linearGradient>
              <linearGradient id="vestGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1e1b2e" />
                <stop offset="50%" stopColor="#2c2742" />
                <stop offset="100%" stopColor="#1e1b2e" />
              </linearGradient>
              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Cinema Uniform Vest & Collar */}
            <path d="M 120,320 L 140,240 L 260,240 L 280,320 Z" fill="url(#vestGrad)" />
            {/* White inner shirt collar */}
            <polygon points="180,240 200,270 170,265" fill="#f8fafc" />
            <polygon points="220,240 200,270 230,265" fill="#f1f5f9" />
            {/* Small bronze vintage cinema pin */}
            <circle cx="160" cy="270" r="4" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />

            {/* Slender Graceful Neck */}
            <path d="M 188,245 L 188,205 L 212,205 L 212,245 Z" fill="url(#skinGrad)" />

            {/* Delicate Face Contour (Ethereal, Gender-Ambiguous Beauty) */}
            <path
              d="M 162,150 C 162,208 184,228 200,228 C 216,228 238,208 238,150 C 238,125 162,125 162,150 Z"
              fill="url(#skinGrad)"
            />

            {/* Soft Peach Blush on Cheeks */}
            <ellipse cx="174" cy="182" rx="10" ry="5" fill="#f43f5e" opacity={isBlushing ? 0.45 : 0.25} />
            <ellipse cx="226" cy="182" rx="10" ry="5" fill="#f43f5e" opacity={isBlushing ? 0.45 : 0.25} />

            {/* Charming Anime/VN Style Luminous Eyes */}
            {/* Left Eye */}
            <ellipse cx="180" cy="164" rx="7" ry="9" fill="#1c1917" />
            <ellipse cx="180" cy="164" rx="5" ry="7" fill="#854d0e" />
            <circle cx="178" cy="161" r="2.5" fill="#ffffff" filter="url(#softGlow)" />
            <circle cx="182" cy="167" r="1.2" fill="#fef08a" />
            {/* Left Eyelash */}
            <path d="M 172,157 Q 180,153 189,158" stroke="#1c1917" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Right Eye */}
            <ellipse cx="220" cy="164" rx="7" ry="9" fill="#1c1917" />
            <ellipse cx="220" cy="164" rx="5" ry="7" fill="#854d0e" />
            <circle cx="218" cy="161" r="2.5" fill="#ffffff" filter="url(#softGlow)" />
            <circle cx="222" cy="167" r="1.2" fill="#fef08a" />
            {/* Right Eyelash */}
            <path d="M 211,158 Q 220,153 228,157" stroke="#1c1917" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Delicate Nose */}
            <circle cx="200" cy="178" r="1" fill="#b45309" opacity="0.6" />

            {/* Gentle, Enchanting Smile */}
            <path
              d="M 193,195 Q 200,201 207,195"
              stroke="#be185d"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

            {/* Soft Messy Feathered Hair (Bangs & Framing Strands) */}
            <path
              d="M 155,150 C 150,110 170,85 200,85 C 230,85 250,110 245,150 C 242,130 236,115 220,105 C 205,120 195,110 180,105 C 164,115 158,130 155,150 Z"
              fill="url(#hairGrad)"
            />
            {/* Bangs falling over forehead */}
            <path d="M 170,110 Q 180,145 186,138 Q 195,155 202,135 Q 212,150 220,132 Q 228,145 233,125" fill="url(#hairGrad)" />
            {/* Side strands gently curling around neck */}
            <path d="M 158,150 Q 155,200 166,220 Q 163,180 166,160" fill="url(#hairGrad)" />
            <path d="M 242,150 Q 245,200 234,220 Q 237,180 234,160" fill="url(#hairGrad)" />
          </svg>

          {/* Heart pulse visual indicator */}
          <div className="absolute bottom-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/30 text-[11px] font-vn-serif text-rose-200">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-500 animate-pulse" />
            <span>心動的瞬間 · 為什麼永遠都是這個……</span>
          </div>
        </div>
      );

    case 'ENDING_CREDITS':
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-black p-6 text-center">
          <div className="w-12 h-0.5 bg-amber-500/60 mb-4" />
          <h2 className="text-xl font-vn-cinzel font-bold text-amber-200 tracking-widest mb-1">
            THE PHANTASM CINEMA
          </h2>
          <p className="text-xs font-vn-serif text-amber-400/80 tracking-widest mb-4">
            「致幻技電影館」
          </p>
          <div className="border-t border-b border-white/10 py-3 my-2 w-full max-w-xs">
            <p className="text-xs text-slate-400 font-vn-serif">文本及圖像創作</p>
            <p className="text-base font-vn-serif font-bold text-white tracking-widest mt-1">
              白 櫻 蒼 成
            </p>
          </div>
          <div className="w-12 h-0.5 bg-amber-500/60 mt-4" />
        </div>
      );

    default:
      return null;
  }
}
