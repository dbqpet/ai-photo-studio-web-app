"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void;
}

/**
 * WebRTC camera view with an oval dashed "Face Alignment Guide" overlay to
 * help the user frame their head before capturing.
 */
export default function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1920 }, height: { ideal: 1440 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setReady(true);
      } catch {
        if (!cancelled) {
          setError(
            "Camera unavailable. Please allow camera access, or use Upload Photo instead.",
          );
        }
      }
    }

    start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const capture = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Mirror back so the saved photo matches reality (preview is mirrored).
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    onCapture(canvas.toDataURL("image/jpeg", 0.95));
  }, [onCapture]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full overflow-hidden rounded-2xl bg-slate-900 aspect-[3/4]">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-slate-300">
            {error}
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              playsInline
              muted
              className="h-full w-full object-cover -scale-x-100"
            />
            {/* Face Alignment Guide */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 300 400"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden
            >
              <defs>
                <mask id="face-guide-mask">
                  <rect width="300" height="400" fill="white" />
                  <ellipse cx="150" cy="185" rx="88" ry="118" fill="black" />
                </mask>
              </defs>
              <rect
                width="300"
                height="400"
                fill="rgba(15, 23, 42, 0.45)"
                mask="url(#face-guide-mask)"
              />
              <ellipse
                cx="150"
                cy="185"
                rx="88"
                ry="118"
                fill="none"
                stroke="#7dd3fc"
                strokeWidth="2.5"
                strokeDasharray="10 8"
                strokeLinecap="round"
              />
            </svg>
            <p className="absolute bottom-3 inset-x-0 text-center text-xs font-medium text-sky-200 drop-shadow">
              Align your face inside the oval guide
            </p>
          </>
        )}
      </div>
      <button
        type="button"
        onClick={capture}
        disabled={!ready}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full border-4 border-slate-300 bg-white shadow-lg transition active:scale-95 disabled:opacity-40"
        aria-label="Take photo"
      >
        <span className="h-10 w-10 rounded-full bg-rose-500" />
      </button>
    </div>
  );
}
