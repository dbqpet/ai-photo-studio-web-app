"use client";

import {
  BACKGROUND_COLORS,
  PHOTO_SIZE_PRESETS,
} from "@/constants/photoSizes";
import { PROCESSING_MODES, type ProcessingMode } from "@/lib/types";

interface SpecSelectorProps {
  presetId: string;
  backgroundId: string;
  mode: ProcessingMode;
  onPresetChange: (id: string) => void;
  onBackgroundChange: (id: string) => void;
  onModeChange: (mode: ProcessingMode) => void;
}

/** Document size, background colour and AI style selection. */
export default function SpecSelector({
  presetId,
  backgroundId,
  mode,
  onPresetChange,
  onBackgroundChange,
  onModeChange,
}: SpecSelectorProps) {
  return (
    <div className="flex flex-col gap-6">
      <section>
        <h3 className="mb-2.5 text-sm font-semibold text-slate-700">
          Document Type
        </h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {PHOTO_SIZE_PRESETS.map((preset) => {
            const active = preset.id === presetId;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onPresetChange(preset.id)}
                aria-pressed={active}
                className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition ${
                  active
                    ? "border-sky-500 bg-sky-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <span className="text-2xl" aria-hidden>
                  {preset.icon}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900">
                    {preset.label}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {preset.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="mb-2.5 text-sm font-semibold text-slate-700">
          Background Color
        </h3>
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
          🔒 All styles preserve your facial identity 100% — only lighting,
          tone and background are adjusted.
        </p>
      </section>
    </div>
  );
}
