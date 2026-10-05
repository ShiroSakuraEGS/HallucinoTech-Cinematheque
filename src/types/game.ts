export type SceneType =
  | 'INTRO'             // Arriving at the eerie cinema entrance
  | 'COUNTER'           // Approaching the dark counter, clerk silhouette
  | 'QR_PROMPT'         // Clerk asks for QR code
  | 'POSTER_DECISION'   // Movie matched! Poster revealed, choose to watch or save
  | 'THEATER_WALK'      // Walking into the dim theater
  | 'THEATER_WATCHING'  // Movie playing, cinematic commentary
  | 'CLERK_WHISPER'     // Clerk sits next to player and whispers
  | 'CLERK_REVEAL'      // Lights dim up, stunning androgynous clerk revealed
  | 'HEART_FLUTTER'     // Heartbeat, attraction, clerk's intimate invitation
  | 'ENDING_CREDITS';   // Roll credits: 白櫻蒼成

export type MovieId = 'xibuxi' | 'dianziqian' | 'fenweibiancheng' | 'qingrenguan';

export interface MovieInfo {
  id: MovieId;
  title: string;
  subtitle: string;
  tagline: string;
  genre: string;
  duration: string;
  themeColor: string;
  secondaryColor: string;
  gradientBg: string;
  summary: string;
  posterArt: {
    symbol: string;
    bgPattern: string;
    accentGlow: string;
    quote: string;
  };
  customImageUrl?: string;
  author: string;
  fullStoryMarkdown?: string;
  dialogueScripts: {
    watchingThoughts: string[];
    clerkWhispers: string[];
    postMovieReflection: string[];
  };
}

export interface DialogueLine {
  id: string;
  speaker: string;
  text: string;
  mood?: 'mysterious' | 'scared' | 'intimate' | 'blushing' | 'whisper' | 'normal';
  choices?: {
    text: string;
    action: () => void;
  }[];
}

export interface CollectedTicket {
  movie: MovieInfo;
  collectedAt: number;
  scannedCode?: string;
  watched: boolean;
}
