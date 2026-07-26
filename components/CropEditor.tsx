"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { getCroppedDataUrl } from "@/lib/cropImage";

/** Default ID portrait aspect ratio (3:4). */
export const ID_CROP_ASPECT = 3 / 4;

interface CropEditorProps {
  imageSrc: string;
  /** Target crop aspect (width / height), from the selected photo dimension. */
  aspectRatio?: number;
  onConfirm: (croppedDataUrl: string) => void;
  onCancel: () => void;
}

/** Interactive zoom / pan cropper before the photo is sent for AI processing. */
export default function CropEditor({
  imageSrc,
  aspectRatio = ID_CROP_ASPECT,
  onConfirm,
  onCancel,
}: CropEditorProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onCropComplete = useCallback((_area: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const confirm = useCallback(async () => {
    if (!croppedAreaPixels) return;
    setBusy(true);
    setError(null);
    try {
      const dataUrl = await getCroppedDataUrl(imageSrc, croppedAreaPixels);
      onConfirm(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Crop failed.");
      setBusy(false);
    }
  }, [croppedAreaPixels, imageSrc, onConfirm]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-base font-bold text-slate-900">
          Adjust your photo
        </h3>
        <p className="text-sm text-slate-500">
          Zoom and drag so your face is centred in the ID portrait frame.
        </p>
      </div>

      <div
        className="relative w-full overflow-hidden rounded-2xl bg-slate-900"
        style={{ aspectRatio: String(aspectRatio) }}
      >
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          showGrid
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          objectFit="contain"
        />
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-slate-600">
          Zoom · {zoom.toFixed(1)}×
        </span>
        <input
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full accent-sky-600"
          aria-label="Zoom"
        />
      </label>

      {error && (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={confirm}
          disabled={busy || !croppedAreaPixels}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-sky-500 disabled:opacity-60"
        >
          {busy ? "Preparing…" : "✓ Use this crop"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="rounded-2xl border border-slate-300 bg-transparent px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
