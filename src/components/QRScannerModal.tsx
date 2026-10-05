import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { Camera, RefreshCw, Upload, X, AlertCircle } from 'lucide-react';
import { matchMovieFromQR } from '../data/movies';
import { MovieInfo } from '../types/game';
import { sound } from '../utils/audio';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanMatched: (movie: MovieInfo, rawContent: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onScanMatched
}) => {
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    stopCamera();
    setErrorMessage(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage('您的瀏覽器不支援相機掃描，您也可以上傳含有 QR 碼的照片。');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 720 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true'); // Required for iOS
        await videoRef.current.play();
        setCameraActive(true);
        scanLoop();
      }
    } catch (err: unknown) {
      console.warn('Camera access issue:', err);
      setCameraActive(false);
      setErrorMessage('無法取得相機權限（可能未授權或無相機）。您可以上傳含 QR 碼的照片進行辨識。');
    }
  };

  const stopCamera = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const scanLoop = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code && code.data && code.data.trim().length > 0) {
        handleSuccessfulQR(code.data);
        return;
      }
    }

    animationFrameId.current = requestAnimationFrame(scanLoop);
  };

  const handleSuccessfulQR = (data: string) => {
    stopCamera();
    sound.playChime(true);
    const matched = matchMovieFromQR(data);
    onScanMatched(matched, data);
  };

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          handleSuccessfulQR(code.data);
        } else {
          // If no standard QR detected in the image, use filename or random hash
          handleSuccessfulQR(file.name + Date.now());
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-sm rounded-2xl bg-[#0f111a] border border-amber-500/30 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-vn-serif font-bold text-white tracking-wider">
              出示任何 QR 碼
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewfinder */}
        <div className="relative w-full aspect-square bg-black overflow-hidden flex items-center justify-center">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            playsInline
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Scanner Reticle Overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-12">
            <div className="relative w-full h-full border-2 border-amber-400/70 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.25)]">
              {/* Corner accent brackets */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-amber-300" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-amber-300" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-amber-300" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-amber-300" />

              {/* Animated laser scan line */}
              <div className="absolute left-0 right-0 h-0.5 bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-bounce opacity-80" />
            </div>
          </div>

          {/* Camera Error or Loading Message */}
          {!cameraActive && (
            <div className="absolute inset-0 bg-[#0c0e15]/95 flex flex-col items-center justify-center p-6 text-center z-10">
              <AlertCircle className="w-8 h-8 text-amber-500 mb-2 opacity-80" />
              <p className="text-xs font-vn-serif text-slate-300 leading-relaxed mb-4">
                {errorMessage || '相機連線中……'}
              </p>
              <button
                onClick={startCamera}
                className="min-h-[44px] px-4 py-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-vn-serif flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                重新啟用相機
              </button>
            </div>
          )}

          {/* Flip camera button */}
          {cameraActive && (
            <button
              onClick={toggleCameraFacing}
              className="absolute bottom-3 right-3 min-w-[44px] min-h-[44px] rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/80"
              title="切換前後鏡頭"
            >
              <RefreshCw className="w-4 h-4 text-amber-400" />
            </button>
          )}
        </div>

        {/* Instructions & File Upload Option */}
        <div className="p-4 flex flex-col gap-3 bg-[#0d0f17]">
          <p className="text-[11px] text-slate-400 font-vn-serif text-center">
            對準周遭任意 QR 碼（商品、發票、網址皆可），將隨機引出對應電影。
          </p>

          {/* File Upload Option */}
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 min-h-[44px] px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-vn-serif text-slate-200 flex items-center justify-center gap-2 transition-colors"
            >
              <Upload className="w-4 h-4 text-amber-400" />
              上傳照片掃碼
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
