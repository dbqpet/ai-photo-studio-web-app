import type { TFunction } from "i18next";

import type { BackgroundColorOption, PhotoSizePreset } from "@/constants/photoSizes";
import type { ProcessingModeOption } from "@/lib/types";

/**
 * The preset/background/mode option arrays in constants/photoSizes.ts and
 * lib/types.ts carry English label/description text so the app has a
 * sensible value even before i18n loads. These helpers look up the live
 * translation for a given option's `id` and fall back to that English text
 * if a key is ever missing (e.g. a new preset added without translations).
 */

export function presetLabel(t: TFunction, preset: PhotoSizePreset): string {
  return t(`presets.${preset.id}.label`, { defaultValue: preset.label });
}

export function presetDescription(t: TFunction, preset: PhotoSizePreset): string {
  if (preset.isCustom || preset.id === "custom") {
    return t("presets.custom.descriptionFormatted", {
      width: preset.widthMm,
      height: preset.heightMm,
      defaultValue: preset.description,
    });
  }
  return t(`presets.${preset.id}.description`, { defaultValue: preset.description });
}

export function dimensionLabel(t: TFunction, preset: PhotoSizePreset): string {
  if (preset.isCustom || preset.id === "custom") {
    return t("common.customDimensionLabel", {
      width: preset.widthMm,
      height: preset.heightMm,
    });
  }
  return t("common.dimensionLabel", {
    width: preset.widthMm,
    height: preset.heightMm,
  });
}

export function backgroundLabel(t: TFunction, bg: BackgroundColorOption): string {
  return t(`backgrounds.${bg.id}.label`, { defaultValue: bg.label });
}

export function backgroundSubLabel(t: TFunction, bg: BackgroundColorOption): string {
  return t(`backgrounds.${bg.id}.subLabel`, { defaultValue: bg.subLabel });
}

export function modeLabel(t: TFunction, mode: ProcessingModeOption): string {
  return t(`modes.${mode.id}.label`, { defaultValue: mode.label });
}

export function modeDescription(t: TFunction, mode: ProcessingModeOption): string {
  return t(`modes.${mode.id}.description`, { defaultValue: mode.description });
}
