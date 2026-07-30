"use client";

import { useCallback, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import CameraCapture from "./CameraCapture";
import CropEditor from "./CropEditor";
import {
  MAX_UPLOAD_BYTES,
  fileToDataUrl,
  validateSourceImage,
} from "@/lib/imageUtils";

interface PhotoInputProps {
  onPhotoSelected: (dataUrl: string, warning?: string) => void;
  /** Crop frame aspect ratio from the selected photo dimension. */
  aspectRatio?: number;
}

type InputTab = "upload" | "camera";

/** Input module: upload/camera → interactive crop → confirm. */
export default function PhotoInput({
  onPhotoSelected,
  aspectRatio = 3 / 4,
}: PhotoInputProps) {
  const [tab, setTab] = useState<InputTab>("upload");
  const [error, setError] = useState<string | null>(null);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [pendingWarning, setPendingWarning] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const beginCrop = useCallback(async (dataUrl: string) => {
    setError(null);
    try {
      const validation = await validateSourceImage(dataUrl);
      setPendingWarning(validation.warning);
      setRawImage(dataUrl);
    } catch {
      setError("That file does not look like a valid image. Please try another.");
    }
  }, []);

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      setError(null);
      if (!file.type.startsWith("image/")) {
        setError("Please choose an image file (JPEG, PNG or WebP).");
        return;
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        setError("Image is larger than 10 MB. Please choose a smaller file.");
        return;
      }
      const dataUrl = await fileToDataUrl(file);
      await beginCrop(dataUrl);
    },
    [beginCrop],
  );

  const tabClass = (active: boolean) =>
    `flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
      active
        ? "bg-white text-slate-900 shadow"
        : "text-slate-500 hover:text-slate-700"
    }`;

  if (rawImage) {
    return (
      <CropEditor
        imageSrc={rawImage}
        aspectRatio={aspectRatio}
        onCancel={() => {
          setRawImage(null);
          setPendingWarning(undefined);
        }}
        onConfirm={(cropped) => {
          setRawImage(null);
          onPhotoSelected(cropped, pendingWarning);
          setPendingWarning(undefined);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex rounded-2xl bg-slate-100 p-1.5" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "upload"}
          className={tabClass(tab === "upload")}
          onClick={() => setTab("upload")}
        >
          ⬆️ Upload Photo
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "camera"}
          className={tabClass(tab === "camera")}
          onClick={() => setTab("camera")}
        >
          📷 Take Photo
        </button>
      </div>

      {tab === "upload" ? (
        <button
          type="button"
          onClick={() => {
            // Fire-and-forget: never await/block the click on the analytics call.
            track("click_upload");
            fileInputRef.current?.click();
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            track("click_upload");
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 transition hover:border-sky-400 hover:bg-sky-50"
          style={{ aspectRatio: String(aspectRatio) }}
        >
          <span className="text-4xl" aria-hidden>
            🖼️
          </span>
          <span className="text-sm font-medium">
            Tap to choose a photo
            <span className="hidden sm:inline"> or drag &amp; drop</span>
          </span>
          <span className="text-xs text-slate-400">
            JPEG / PNG / WebP · Recommended ≥ 600×600px
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            data-testid="photo-file-input"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </button>
      ) : (
        <CameraCapture onCapture={beginCrop} />
      )}

      {error && (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      )}
    </div>
  );
}
