"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { useTranslation } from "react-i18next";
import CropEditor from "./CropEditor";
import {
  MAX_UPLOAD_BYTES,
  fileToDataUrl,
  validateSourceImage,
} from "@/lib/imageUtils";
import { trackGAEvent } from "@/lib/ga";

interface PhotoInputProps {
  onPhotoSelected: (dataUrl: string, warning?: string) => void;
  /** Crop frame aspect ratio from the selected photo dimension. */
  aspectRatio?: number;
}

/** Input module: upload → interactive crop → confirm. */
export default function PhotoInput({
  onPhotoSelected,
  aspectRatio = 3 / 4,
}: PhotoInputProps) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [pendingWarning, setPendingWarning] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const beginCrop = useCallback(
    async (dataUrl: string) => {
      setError(null);
      try {
        const validation = await validateSourceImage(dataUrl);
        setPendingWarning(validation.warning);
        setRawImage(dataUrl);
      } catch {
        setError(t("photoInput.errorInvalidImage"));
      }
    },
    [t],
  );

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      trackGAEvent("upload_photo_started");
      setError(null);
      if (!file.type.startsWith("image/")) {
        setError(t("photoInput.errorWrongFileType"));
        return;
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        setError(t("photoInput.errorFileTooLarge"));
        return;
      }
      const dataUrl = await fileToDataUrl(file);
      await beginCrop(dataUrl);
    },
    [beginCrop, t],
  );

  /** Scroll to the "Create your ID photo" heading once crop UI mounts. */
  useEffect(() => {
    if (!rawImage) return;
    const id = window.setTimeout(() => {
      document
        .getElementById("create-your-id-photo")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(id);
  }, [rawImage]);

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
    <div className="flex flex-col gap-3 md:gap-2.5">
      <button
        type="button"
        onClick={() => {
          // Fire-and-forget: never await/block the click on the analytics call.
          track("click_upload");
          fileInputRef.current?.click();
        }}
        className="w-full rounded-2xl bg-sky-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-sky-600/25 transition hover:bg-sky-700 hover:shadow-lg hover:shadow-sky-600/30 active:scale-[0.98] md:mx-auto md:h-14 md:w-[260px] md:py-0"
      >
        {t("photoInput.uploadPhoto")}
      </button>
      <p className="max-w-sm text-pretty text-xs leading-relaxed text-slate-500 md:mx-auto md:text-center">
        {t("photoInput.privacyTitle")}
        <span className="mt-0.5 block text-slate-400">{t("photoInput.privacyNote")}</span>
      </p>
      <p className="text-xs text-slate-400 md:text-center">{t("photoInput.fileFormats")}</p>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        data-testid="photo-file-input"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {error && (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      )}
    </div>
  );
}
