/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SceneType, MovieInfo, MovieId } from './types/game';
import { MOVIES, MOVIE_LIST, matchMovieFromQR } from './data/movies';
import { VisualScene } from './components/VisualScene';
import { DialogueBox, ChoiceOption } from './components/DialogueBox';
import { QRScannerModal } from './components/QRScannerModal';
import { PosterCollectionModal } from './components/PosterCollectionModal';
import { CustomContentModal } from './components/CustomContentModal';
import { DialogueLogModal, LogEntry } from './components/DialogueLogModal';
import { StoryReaderModal } from './components/StoryReaderModal';
import { EndingCredits } from './components/EndingCredits';
import { sound } from './utils/audio';
import { Film, QrCode, Sliders, Ticket } from 'lucide-react';

export default function App() {
  // Game Scene State
  const [currentScene, setCurrentScene] = useState<SceneType>('INTRO');
  const [dialogueIndex, setDialogueIndex] = useState<number>(0);
  const [currentMovie, setCurrentMovie] = useState<MovieInfo>(MOVIES.xibuxi);
  const [collectedMovieIds, setCollectedMovieIds] = useState<string[]>([]);

  // Sound & Modals State
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState<boolean>(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [isLogOpen, setIsLogOpen] = useState<boolean>(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState<boolean>(false);
  const [readingMovie, setReadingMovie] = useState<MovieInfo>(MOVIES.xibuxi);
  const [dialogueLogs, setDialogueLogs] = useState<LogEntry[]>([]);

  // Custom User Assets (Creator: 白櫻蒼成)
  const [customClerkImage, setCustomClerkImage] = useState<string | undefined>(
    'materials/images/characters/clerk.png'
  );
  const [customMoviePosters, setCustomMoviePosters] = useState<Partial<Record<MovieId, string>>>({});

  // Restore stored user customizations and check /materials/ folder
  useEffect(() => {
    try {
      const savedClerk = localStorage.getItem('phantasm_clerk_img');
      if (savedClerk) {
        setCustomClerkImage(savedClerk);
      } else {
        // Test if clerk image exists in materials/images/characters/clerk.png
        const img = new Image();
        img.src = 'materials/images/characters/clerk.png';
        img.onload = () => setCustomClerkImage('materials/images/characters/clerk.png');
      }

      // Check poster files in materials/images/posters/
      const movieIds: MovieId[] = ['xibuxi', 'dianziqian', 'fenweibiancheng', 'qingrenguan'];
      movieIds.forEach((id) => {
        const posterImg = new Image();
        posterImg.src = `materials/images/posters/${id}.png`;
        posterImg.onload = () => {
          setCustomMoviePosters((prev) => ({
            ...prev,
            [id]: `materials/images/posters/${id}.png`
          }));
        };
      });

      // Load custom dialogues if present
      fetch('materials/texts/dialogues.json')
        .then((res) => {
          if (res.ok) return res.json();
          return null;
        })
        .then((data) => {
          if (data && data.movies) {
            Object.keys(data.movies).forEach((key) => {
              const k = key as MovieId;
              if (MOVIES[k] && data.movies[k]) {
                if (data.movies[k].watchingThoughts) {
                  MOVIES[k].dialogueScripts.watchingThoughts = data.movies[k].watchingThoughts;
                }
                if (data.movies[k].clerkWhispers) {
                  MOVIES[k].dialogueScripts.clerkWhispers = data.movies[k].clerkWhispers;
                }
              }
            });
          }
        })
        .catch(() => {});

      const savedTickets = localStorage.getItem('phantasm_tickets');
      if (savedTickets) {
        setCollectedMovieIds(JSON.parse(savedTickets));
      }
    } catch {
      // LocalStorage access fallback
    }
  }, []);

  const saveClerkImage = (dataUrl: string | undefined) => {
    setCustomClerkImage(dataUrl);
    try {
      if (dataUrl) {
        localStorage.setItem('phantasm_clerk_img', dataUrl);
      } else {
        localStorage.removeItem('phantasm_clerk_img');
      }
    } catch {}
  };

  const saveMoviePoster = (movieId: MovieId, dataUrl: string | undefined) => {
    setCustomMoviePosters((prev) => ({
      ...prev,
      [movieId]: dataUrl
    }));
  };

  // Add to dialogue log
  const pushLog = (speaker: string, text: string) => {
    setDialogueLogs((prev) => [...prev, { speaker, text }]);
  };

  const toggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  // Handler for QR scanning match
  const handleQRMatched = (movie: MovieInfo, rawCode: string) => {
    setIsScannerOpen(false);

    // Apply any custom poster override
    const activeMovie: MovieInfo = {
      ...movie,
      customImageUrl: customMoviePosters[movie.id] || movie.customImageUrl
    };

    setCurrentMovie(activeMovie);
    setCollectedMovieIds((prev) => {
      const next = Array.from(new Set([...prev, movie.id]));
      try {
        localStorage.setItem('phantasm_tickets', JSON.stringify(next));
      } catch {}
      return next;
    });

    setCurrentScene('POSTER_DECISION');
    setDialogueIndex(0);
    pushLog(
      '神秘店員',
      `「掃碼成功……為您解讀出來的放映膠卷是《${movie.title}》。${movie.tagline}」`
    );
  };

  // Handler for selecting an existing movie from collection to watch
  const handleSelectFromCollection = (movie: MovieInfo) => {
    const activeMovie: MovieInfo = {
      ...movie,
      customImageUrl: customMoviePosters[movie.id] || movie.customImageUrl
    };
    setCurrentMovie(activeMovie);
    setCurrentScene('POSTER_DECISION');
    setDialogueIndex(0);
  };

  // Main Scene & Script State Machine
  const getDialogueContent = (): {
    speaker: string;
    text: string;
    choices?: ChoiceOption[];
    canAdvance: boolean;
  } => {
    switch (currentScene) {
      case 'INTRO': {
        const introTexts = [
          {
            speaker: '旁白',
            text: '夜幕低垂，不知不覺走入一條從未見過的老舊巷弄。盡頭矗立著一座散發著微弱霓虹燈的建築——「致幻技電影館」。'
          },
          {
            speaker: '旁白',
            text: '招牌有些斑駁褪色，門框帶著歲月刻蝕的木紋。不知為何，心底湧起一股莫名的好奇心……想要進去探索一下。'
          }
        ];

        if (dialogueIndex < introTexts.length) {
          return {
            ...introTexts[dialogueIndex],
            canAdvance: true
          };
        }

        return {
          speaker: '我',
          text: '站在陳舊厚重的隔音門前，深吸了一口氣。',
          choices: [
            {
              text: '推開門，走進電影館探索',
              action: () => {
                setCurrentScene('COUNTER');
                setDialogueIndex(0);
                pushLog('我', '（推開門，走進電影館探索）');
              }
            },
            {
              text: '雖然心裡有些害怕，但好奇心驅使著我邁開腳步',
              action: () => {
                setCurrentScene('COUNTER');
                setDialogueIndex(0);
                pushLog('我', '（雖然心裡有些害怕，但好奇心驅使著我邁開腳步）');
              }
            }
          ],
          canAdvance: false
        };
      }

      case 'COUNTER': {
        const counterTexts = [
          {
            speaker: '旁白',
            text: '推開門走進去，四周非常昏暗。空氣裡混雜著爆米花甜香與老舊膠卷的氣息。'
          },
          {
            speaker: '旁白',
            text: '來到一個櫃檯前，發現裡面坐著一個店員。但因為四周太暗了，完全看不清對方的臉孔，只能隱約看見纖細的剪影。'
          },
          {
            speaker: '神秘店員',
            text: '「請問……是要來看電影的嗎？」'
          }
        ];

        if (dialogueIndex < counterTexts.length) {
          return {
            ...counterTexts[dialogueIndex],
            canAdvance: true
          };
        }

        return {
          speaker: '我',
          text: '面對昏暗中看不清臉孔的神秘店員，心底一陣奇妙的悸動。',
          choices: [
            {
              text: '在好奇心驅使下，儘管有些害怕但回答：「是的，我想看電影。」',
              action: () => {
                setCurrentScene('QR_PROMPT');
                setDialogueIndex(0);
                pushLog('我', '「是的，我想看電影。」');
              }
            },
            {
              text: '「這裡現在放映什麼樣的電影呢？」',
              action: () => {
                setCurrentScene('QR_PROMPT');
                setDialogueIndex(0);
                pushLog('我', '「這裡現在放映什麼樣的電影呢？」');
              }
            }
          ],
          canAdvance: false
        };
      }

      case 'QR_PROMPT': {
        const qrTexts = [
          {
            speaker: '神秘店員',
            text: '「太好了……我們這裡的選片規則有點特別。」店員在陰影中微微頷首。'
          },
          {
            speaker: '神秘店員',
            text: '「請出示您的 QR Code。任何隨便掃到的 QR 碼都可以……只要是屬於你的頻率。」'
          }
        ];

        if (dialogueIndex < qrTexts.length) {
          return {
            ...qrTexts[dialogueIndex],
            canAdvance: true
          };
        }

        return {
          speaker: '神秘店員',
          text: '「準備好了嗎？請出示你的 QR Code 給我看看吧。」',
          choices: [
            {
              text: '開啟相機，掃描任何 QR 碼',
              action: () => {
                setIsScannerOpen(true);
              }
            },
            {
              text: '查看我的電影票夾（歷史收藏）',
              action: () => {
                setIsCollectionOpen(true);
              }
            }
          ],
          canAdvance: false
        };
      }

      case 'POSTER_DECISION': {
        const posterTexts = [
          {
            speaker: '神秘店員',
            text: `「掃描出來了……與你共振的電影是《${currentMovie.title}》。」`
          },
          {
            speaker: '神秘店員',
            text: `「這是一部${currentMovie.genre}的故事。${currentMovie.tagline}」`
          },
          {
            speaker: '旁白',
            text: `海報上印著：${currentMovie.summary}`
          }
        ];

        if (dialogueIndex < posterTexts.length) {
          return {
            ...posterTexts[dialogueIndex],
            canAdvance: true
          };
        }

        return {
          speaker: '我',
          text: `看著眼前這張神秘迷幻的《${currentMovie.title}》海報，我該如何決定？`,
          choices: [
            {
              text: '【決定觀看】跟隨店員前往放映廳',
              action: () => {
                setCurrentScene('THEATER_WALK');
                setDialogueIndex(0);
                sound.startProjectorHum();
                pushLog('我', `決定觀看《${currentMovie.title}》`);
              }
            },
            {
              text: `【閱讀小說全文】細細品讀《${currentMovie.title}》原著故事（白櫻蒼成 著）`,
              action: () => {
                setReadingMovie(currentMovie);
                setIsStoryModalOpen(true);
              }
            },
            {
              text: '【暫不觀看】先將海報收藏起來，之後再重新選擇',
              action: () => {
                sound.playChime(true);
                setCurrentScene('QR_PROMPT');
                setDialogueIndex(0);
                pushLog('我', `將《${currentMovie.title}》海報收入票夾中`);
              }
            },
            {
              text: '重新掃描另一張 QR Code',
              action: () => {
                setIsScannerOpen(true);
              }
            }
          ],
          canAdvance: false
        };
      }

      case 'THEATER_WALK': {
        const walkTexts = [
          {
            speaker: '神秘店員',
            text: '「請跟我來。走廊稍微有點暗，請小心腳下。」'
          },
          {
            speaker: '旁白',
            text: '店員轉身引領著我穿過幽暗悠長的長廊。空氣裡的老式放映機馬達聲漸漸清晰。'
          },
          {
            speaker: '旁白',
            text: '推開四號放映廳沈重的紅色絨布簾，冷冽的投影光束正筆直打在巨大的銀幕上。'
          }
        ];

        if (dialogueIndex < walkTexts.length) {
          return {
            ...walkTexts[dialogueIndex],
            canAdvance: true
          };
        }

        return {
          speaker: '我',
          text: '在第四排的正中央坐下，準備觀看這場特別的放映。',
          choices: [
            {
              text: '凝視銀幕，開始觀賞電影',
              action: () => {
                setCurrentScene('THEATER_WATCHING');
                setDialogueIndex(0);
              }
            }
          ],
          canAdvance: false
        };
      }

      case 'THEATER_WATCHING': {
        const thoughts = currentMovie.dialogueScripts.watchingThoughts;
        if (dialogueIndex < thoughts.length) {
          return {
            speaker: '電影放映中',
            text: thoughts[dialogueIndex],
            canAdvance: true
          };
        }

        return {
          speaker: '旁白',
          text: '正當我完全沉浸在扣人心弦的電影情節中時，身旁忽然傳來一陣極輕的聲響……',
          choices: [
            {
              text: '轉過頭看去……',
              action: () => {
                setCurrentScene('CLERK_WHISPER');
                setDialogueIndex(0);
              }
            }
          ],
          canAdvance: false
        };
      }

      case 'CLERK_WHISPER': {
        const whispers = currentMovie.dialogueScripts.clerkWhispers;
        if (dialogueIndex < whispers.length) {
          return {
            speaker: dialogueIndex === 0 ? '旁白' : '身旁的店員',
            text: whispers[dialogueIndex],
            canAdvance: true
          };
        }

        return {
          speaker: '我',
          text: '放映廳裡光線昏暗，店員靠得那麼近，溫熱的呼吸與私密的低語令人心跳如鼓。',
          choices: [
            {
              text: '「你平常……都會這樣陪客人看電影嗎？」',
              action: () => {
                pushLog('我', '「你平常……都會這樣陪客人看電影嗎？」');
                advanceToReveal();
              }
            },
            {
              text: '屏住呼吸，輕聲回應：「我……很喜歡這部電影，也很高興你在身邊。」',
              action: () => {
                pushLog('我', '「我……很喜歡這部電影，也很高興你在身邊。」');
                advanceToReveal();
              }
            }
          ],
          canAdvance: false
        };
      }

      case 'CLERK_REVEAL': {
        const revealTexts = [
          {
            speaker: '旁白',
            text: '銀幕上的故事漸漸落幕。空曠的放映廳內，柔和暖黃的燈光緩緩亮起。'
          },
          {
            speaker: '旁白',
            text: '這一次，在明亮溫暖的光暈中，我終於清晰地看清了眼前店員的面貌——'
          },
          {
            speaker: '旁白',
            text: '（呼吸一滯）……那是多麼令人驚豔的外表！性別不明，卻擁有著近乎完美的雌雄同體可愛容顏。柔軟微蓬的深色髮絲、清澈而深邃的明眸，還有微微彎起的動人嘴角……'
          },
          {
            speaker: '旁白',
            text: '「為什麼……為什麼永遠都是這個可愛的面孔呢……？」一種說不清道不明的宿命心動狠狠擊中了胸口。'
          }
        ];

        if (dialogueIndex < revealTexts.length) {
          return {
            ...revealTexts[dialogueIndex],
            canAdvance: true
          };
        }

        return {
          speaker: '我',
          text: '視線久久無法從這張可愛純粹的臉龐上移開，胸口傳來強烈的悸動。',
          choices: [
            {
              text: '按捺不住狂跳的心臟，靜靜凝望著對方……',
              action: () => {
                sound.startHeartbeat();
                setCurrentScene('HEART_FLUTTER');
                setDialogueIndex(0);
              }
            }
          ],
          canAdvance: false
        };
      }

      case 'HEART_FLUTTER': {
        const flutterTexts = [
          {
            speaker: '旁白',
            text: '噗通、噗通……心跳聲在耳膜裡不斷放大。或許……我不該就這樣離開，我應該再約這個店員一起多看幾部電影才對。'
          },
          {
            speaker: '店員',
            text: '似乎察覺到了我熾熱而有些發怔的眼神，店員微微側頭，臉頰泛起一抹誘人的柔粉。'
          },
          {
            speaker: '店員',
            text: '「今天的電影，你看得開心嗎？……如果有機會的話，一定要常來找我多看一點電影喔。」'
          },
          {
            speaker: '旁白',
            text: '親暱溫軟的語氣宛如某種只屬於我們兩人的秘密約定。今晚的致幻技電影館，在心底留下了久久不散的餘溫。'
          }
        ];

        if (dialogueIndex < flutterTexts.length) {
          return {
            ...flutterTexts[dialogueIndex],
            canAdvance: true
          };
        }

        return {
          speaker: '我',
          text: '帶著依依不捨的悸動與滿懷的心思，走出了這場如夢似幻的放映之旅。',
          choices: [
            {
              text: '「好，我一定會再回來的。」（迎接落幕謝幕）',
              action: () => {
                sound.stopHeartbeat();
                sound.stopProjectorHum();
                sound.playChime(true);
                setCurrentScene('ENDING_CREDITS');
              }
            }
          ],
          canAdvance: false
        };
      }

      case 'ENDING_CREDITS':
      default:
        return {
          speaker: '落幕',
          text: '',
          canAdvance: false
        };
    }
  };

  const advanceToReveal = () => {
    sound.stopProjectorHum();
    setCurrentScene('CLERK_REVEAL');
    setDialogueIndex(0);
  };

  const handleNextDialogue = () => {
    const content = getDialogueContent();
    pushLog(content.speaker, content.text);
    setDialogueIndex((prev) => prev + 1);
  };

  const handleRestart = () => {
    sound.stopHeartbeat();
    sound.stopProjectorHum();
    setCurrentScene('INTRO');
    setDialogueIndex(0);
    setDialogueLogs([]);
  };

  const dialogue = getDialogueContent();

  return (
    <div className="min-h-screen w-full bg-[#050608] flex items-center justify-center p-0 sm:p-4 text-slate-100 font-sans">
      {/* Mobile-Sized Application Container (Ergonomic Thumb-Zone Layout) */}
      <main className="w-full max-w-md h-[100dvh] sm:h-[844px] max-h-none sm:max-h-[92vh] flex flex-col bg-[#0a0c13] sm:rounded-3xl overflow-hidden shadow-2xl border-0 sm:border border-amber-950/40 relative">
        {/* Top Bar Contract (Zone 1: Brand title, Zone 2: Links/Stubs, Zone 3: Actions) */}
        <header className="h-12 px-4 flex items-center justify-between border-b border-amber-950/40 bg-black/60 backdrop-blur-md shrink-0 z-30">
          {/* Zone 1: Brand Title */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-vn-cinzel font-bold text-amber-200 tracking-wider">
              致幻技電影館
            </span>
          </div>

          {/* Zone 2 & 3: Ticket collection stub trigger & Customizer */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsCollectionOpen(true)}
              className="min-h-[44px] px-2.5 flex items-center gap-1.5 text-xs font-vn-serif text-amber-300/90 hover:text-amber-200 transition-colors"
              title="電影票夾"
            >
              <Ticket className="w-4 h-4 text-amber-400" />
              <span>票夾 ({collectedMovieIds.length})</span>
            </button>

            <button
              onClick={() => setIsScannerOpen(true)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-300 hover:text-amber-300 transition-colors"
              title="掃描 QR 碼"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
            </button>

            <button
              onClick={() => setIsCustomizerOpen(true)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-amber-300 transition-colors"
              title="自訂素材"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Area: Visual Novel Scene + Dialogue Box OR Ending Credits */}
        {currentScene === 'ENDING_CREDITS' ? (
          <EndingCredits
            movie={currentMovie}
            onRestart={handleRestart}
            onOpenCollection={() => setIsCollectionOpen(true)}
            onOpenCustomizer={() => setIsCustomizerOpen(true)}
          />
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Upper Visual Scene Artwork */}
            <VisualScene
              scene={currentScene}
              movie={currentMovie}
              customClerkImage={customClerkImage}
              isBlushing={currentScene === 'HEART_FLUTTER'}
              onOpenStory={() => {
                setReadingMovie(currentMovie);
                setIsStoryModalOpen(true);
              }}
            />

            {/* Lower Visual Novel Dialogue Box */}
            <DialogueBox
              speaker={dialogue.speaker}
              text={dialogue.text}
              choices={dialogue.choices}
              onNext={handleNextDialogue}
              canAdvance={dialogue.canAdvance}
              onOpenLog={() => setIsLogOpen(true)}
              isMuted={isMuted}
              onToggleMute={toggleMute}
            />
          </div>
        )}

        {/* Modals */}
        <QRScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onScanMatched={handleQRMatched}
        />

        <PosterCollectionModal
          isOpen={isCollectionOpen}
          onClose={() => setIsCollectionOpen(false)}
          collectedMovieIds={collectedMovieIds}
          currentMovieId={currentMovie.id}
          onSelectMovieToWatch={handleSelectFromCollection}
          onReadStory={(m) => {
            setReadingMovie(m);
            setIsStoryModalOpen(true);
          }}
        />

        <CustomContentModal
          isOpen={isCustomizerOpen}
          onClose={() => setIsCustomizerOpen(false)}
          customClerkImage={customClerkImage}
          onSaveClerkImage={saveClerkImage}
          onSaveMoviePoster={saveMoviePoster}
        />

        <DialogueLogModal
          isOpen={isLogOpen}
          onClose={() => setIsLogOpen(false)}
          logs={dialogueLogs}
        />

        <StoryReaderModal
          isOpen={isStoryModalOpen}
          onClose={() => setIsStoryModalOpen(false)}
          movie={readingMovie}
        />
      </main>
    </div>
  );
}
