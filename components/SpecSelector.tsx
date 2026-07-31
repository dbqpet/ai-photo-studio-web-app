"use client";

import { useTranslation } from "react-i18next";
import {
  BACKGROUND_COLORS,
  CUSTOM_MM_MAX,
  CUSTOM_MM_MIN,
  PHOTO_SIZE_PRESETS,
} from "@/constants/photoSizes";
import {
  backgroundLabel,
  backgroundSubLabel,
  modeDescription,
  modeLabel,
  presetDescription,
  presetLabel,
} from "@/lib/i18n/presetLabels";
import { PROCESSING_MODES, type ProcessingMode } from "@/lib/types";

interface SpecSelectorProps {
  presetId: string;
  customWidthMm: number;
  customHeightMm: number;
  backgroundId: string;
  mode: ProcessingMode;
  onPresetChange: (id: string) => void;
  onCustomWidthChange: (mm: number) => void;
  onCustomHeightChange: (mm: number) => void;
  onBackgroundChange: (id: string) => void;
  onModeChange: (mode: ProcessingMode) => void;
  /** When true, hide dimension controls (already chosen on step 1). */
  hideDimensions?: boolean;
}

/** Document size, official background colour and AI style selection. */
export default function SpecSelector({
  presetId,
  customWidthMm,
  customHeightMm,
  backgroundId,
  mode,
  onPresetChange,
  onCustomWidthChange,
  onCustomHeightChange,
  onBackgroundChange,
  onModeChange,
  hideDimensions = false,
}: SpecSelectorProps) {
  const { t } = useTranslation();
  const selectedPreset = PHOTO_SIZE_PRESETS.find((p) => p.id === presetId);

  return (
    <div className="flex flex-col gap-6">
      {!hideDimensions && (
        <section>
          <h3 className="mb-2.5 text-sm font-semibold text-slate-700">
            {t("common.photoDimensions")}
          </h3>
          <label className="mb-3 block">
            <span className="sr-only">{t("common.dimensionPresetSrOnly")}</span>
            <select
              value={presetId}
              onChange={(e) => onPresetChange(e.target.value)}
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-sky-500"
            >
              {PHOTO_SIZE_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.icon} {presetLabel(t, preset)}
                </option>
              ))}
            </select>
          </label>
          {presetId === "custom" ? (
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-slate-600">
                  {t("common.widthMm")}
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
                  {t("common.heightMm")}
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
                {t("common.customDimensionRange", {
                  min: CUSTOM_MM_MIN,
                  max: CUSTOM_MM_MAX,
                })}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              {selectedPreset ? presetDescription(t, selectedPreset) : null}
            </p>
          )}
        </section>
      )}

      <section>
        <h3 className="mb-2.5 text-sm font-semibold text-slate-700">
          {t("specs.backgroundColor")}
        </h3>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {BACKGROUND_COLORS.map((color) => {
            const active = color.id === backgroundId;
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => onBackgroundChange(color.id)}
                aria-pressed={active}
                title={backgroundLabel(t, color)}
                className={`flex flex-col items-center justify-center gap-1 rounded-xl border-2 p-3 text-center transition sm:p-4 ${
                  active
                    ? "border-blue-600 bg-blue-50/30"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <span className="relative">
                  <span
                    className={`block h-8 w-8 rounded-full border shadow-sm sm:h-10 sm:w-10 ${color.swatchClassName}`}
                  />
                  {active && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] leading-none text-white shadow">
                      ✓
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-sm font-semibold text-slate-900">
                  {backgroundLabel(t, color)}
                </span>
                <span className="block text-[11px] text-slate-500">
                  {backgroundSubLabel(t, color)}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="mb-2.5 text-sm font-semibold text-slate-700">
          {t("specs.aiStyle")}
        </h3>
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
                    {modeLabel(t, option)}
                  </span>
                  <span className="block text-xs leading-5 text-slate-500">
                    {modeDescription(t, option)}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
