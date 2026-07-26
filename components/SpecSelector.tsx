"use client";

import {
  BACKGROUND_COLORS,
  CUSTOM_MM_MAX,
  CUSTOM_MM_MIN,
  PHOTO_SIZE_PRESETS,
} from "@/constants/photoSizes";
import {
  PROCESSING_MODES,
  type BackgroundMode,
  type ProcessingMode,
} from "@/lib/types";

interface SpecSelectorProps {
  presetId: string;
  customWidthMm: number;
  customHeightMm: number;
  backgroundId: string;
  backgroundMode: BackgroundMode;
  mode: ProcessingMode;
  onPresetChange: (id: string) => void;
  onCustomWidthChange: (mm: number) => void;
  onCustomHeightChange: (mm: number) => void;
  onBackgroundChange: (id: string) => void;
  onBackgroundModeChange: (mode: BackgroundMode) => void;
  onModeChange: (mode: ProcessingMode) => void;
  /** When true, hide dimension controls (already chosen on step 1). */
  hideDimensions?: boolean;
}

/** Document size, background mode/colour and AI style selection. */
export default function SpecSelector({
  presetId,
  customWidthMm,
  customHeightMm,
  backgroundId,
  backgroundMode,
  mode,
  onPresetChange,
  onCustomWidthChange,
  onCustomHeightChange,
  onBackgroundChange,
  onBackgroundModeChange,
  onModeChange,
  hideDimensions = false,
}: SpecSelectorProps) {
  return (
    <div className="flex flex-col gap-6">
      {!hideDimensions && (
        <section>
          <h3 className="mb-2.5 text-sm font-semibold text-slate-700">
            Photo Dimensions
          </h3>
          <label className="mb-3 block">
            <span className="sr-only">Photo dimension preset</span>
            <select
              value={presetId}
              onChange={(e) => onPresetChange(e.target.value)}
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-sky-500"
            >
              {PHOTO_SIZE_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.icon} {preset.label}
                </option>
              ))}
            </select>
          </label>
          {presetId === "custom" ? (
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-slate-600">
                  Width (mm)
                </span>
                <input
                  type="number"
                  min={CUSTOM_MM_MIN}
                  max={CUSTOM_MM_MAX}
                  step={0.5}
                  value={customWidthMm}
                  onChange={(e) => onCustomWidthChange(Number(e.target.value))}
                  className="rounded-xl border-2 border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-sky-500"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-slate-600">
                  Height (mm)
                </span>
                <input
                  type="number"
                  min={CUSTOM_MM_MIN}
                  max={CUSTOM_MM_MAX}
                  step={0.5}
                  value={customHeightMm}
                  onChange={(e) => onCustomHeightChange(Number(e.target.value))}
                  className="rounded-xl border-2 border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-sky-500"
                />
              </label>
              <p className="col-span-2 text-xs text-slate-500">
                Allowed range: {CUSTOM_MM_MIN}–{CUSTOM_MM_MAX} mm at 300 DPI.
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              {PHOTO_SIZE_PRESETS.find((p) => p.id === presetId)?.description}
            </p>
          )}
        </section>
      )}

      <section>
        <h3 className="mb-2.5 text-sm font-semibold text-slate-700">
          Background
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onBackgroundModeChange("solid")}
            aria-pressed={backgroundMode === "solid"}
            className={`rounded-xl border-2 px-4 py-3 text-left transition ${
              backgroundMode === "solid"
                ? "border-sky-500 bg-sky-50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <span className="block text-sm font-semibold text-slate-900">
              ⬚ Solid Color Background
            </span>
            <span className="mt-0.5 block text-xs text-slate-500">
              Isolate the subject on your exact solid colour (white, blue,
              grey…).
            </span>
          </button>
          <button
            type="button"
            onClick={() => onBackgroundModeChange("studio")}
            aria-pressed={backgroundMode === "studio"}
            className={`rounded-xl border-2 px-4 py-3 text-left transition ${
              backgroundMode === "studio"
                ? "border-sky-500 bg-sky-50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <span className="block text-sm font-semibold text-slate-900">
              🎨 AI Studio Background
            </span>
            <span className="mt-0.5 block text-xs text-slate-500">
              Full professional studio with depth, texture and lighting — ideal
              for LinkedIn, resumes and branding.
            </span>
          </button>
        </div>

        {backgroundMode === "solid" && (
          <div className="mt-3">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Solid colour
            </h4>
            <div className="flex gap-3">
              {BACKGROUND_COLORS.map((color) => {
                const active = color.id === backgroundId;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => onBackgroundChange(color.id)}
                    aria-pressed={active}
                    title={color.label}
                    className={`flex flex-col items-center gap-1.5 rounded-xl p-1.5 transition ${
                      active ? "ring-2 ring-sky-500" : "hover:bg-slate-100"
                    }`}
                  >
                    <span
                      className="h-10 w-10 rounded-full border border-slate-300 shadow-inner"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-[11px] font-medium text-slate-600">
                      {color.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-2.5 text-sm font-semibold text-slate-700">AI Style</h3>
        <div className="grid gap-2">
          {PROCESSING_MODES.map((option) => {
            const active = option.id === mode;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onModeChange(option.id)}
                aria-pressed={active}
                className={`flex items-start gap-3 rounded-xl border-2 px-4 py-3 text-left transition ${
                  active
                    ? "border-sky-500 bg-sky-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <span className="text-2xl" aria-hidden>
                  {option.icon}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900">
                    {option.label}
                  </span>
                  <span className="block text-xs leading-5 text-slate-500">
                    {option.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-2.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
          🔒 Powered by Gemini Nano Banana Pro — facial identity is locked 100%;
          only lighting, clothing and background are edited.
        </p>
      </section>
    </div>
  );
}
