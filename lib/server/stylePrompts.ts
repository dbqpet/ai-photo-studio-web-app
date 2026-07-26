/**
 * Shared style prompts for ID photo generation (Gemini Nano Banana Pro).
 */

import { BACKGROUND_COLORS } from "@/constants/photoSizes";
import type { BackgroundMode, ProcessingMode } from "@/lib/types";

const CLASSIC_STUDIO_BACKGROUND =
  "Clean, neutral light-grey or subtle off-white professional photo studio backdrop.";

const KOREAN_STUDIO_BACKGROUND =
  "Clean, soft-focus neutral light-grey or subtle off-white professional Korean photo studio backdrop.";

const CORPORATE_STUDIO_BACKGROUND =
  "soft studio lighting with a subtle gradient light grey background";

const HAIR_PRESERVATION =
  "Strictly preserve the original hairstyle and hair length (e.g., do NOT change short hair to long hair, or long hair to short hair). You may neaten, tidy, and polish the existing hair to look professional, but the core hairstyle, volume, and length MUST remain identical to the input photo.";

function colorLabelForHex(hex: string): string {
  const match = BACKGROUND_COLORS.find(
    (c) => c.hex.toLowerCase() === hex.toLowerCase(),
  );
  return match ? `${match.label} (${match.hex})` : hex;
}

function solidBackgroundInstruction(backgroundColor: string): string {
  const color = colorLabelForHex(backgroundColor);
  return `Clean, plain, solid studio background with color ${color}. Pure flat solid color background, no gradient, no textures, no shadows behind the person.`;
}

function classicBackgroundInstruction(
  backgroundMode: BackgroundMode,
  backgroundColor: string,
): string {
  if (backgroundMode === "solid") {
    return solidBackgroundInstruction(backgroundColor);
  }
  return CLASSIC_STUDIO_BACKGROUND;
}

function koreanBackgroundInstruction(
  backgroundMode: BackgroundMode,
  backgroundColor: string,
): string {
  if (backgroundMode === "solid") {
    return solidBackgroundInstruction(backgroundColor);
  }
  return KOREAN_STUDIO_BACKGROUND;
}

function corporateLightingAndBackground(
  backgroundMode: BackgroundMode,
  backgroundColor: string,
): string {
  if (backgroundMode === "solid") {
    return `soft studio lighting, ${solidBackgroundInstruction(backgroundColor)}`;
  }
  return CORPORATE_STUDIO_BACKGROUND;
}

function buildClassicPrompt(
  backgroundMode: BackgroundMode,
  backgroundColor: string,
): string {
  const background = classicBackgroundInstruction(
    backgroundMode,
    backgroundColor,
  );
  return `CRITICAL INSTRUCTION: You are performing a biometric ID/passport photo edit. Use the provided image as the exact facial reference. You MUST maintain 100% of the exact facial structure, eye shape, nose, expression, identity, and key features without changing or hallucinating them. Do NOT alter the face. ${HAIR_PRESERVATION}

Task Details:
1. Subject & Framing: Generate a professional ID photo. Upper body centered, head occupies approximately 70% of frame height. Neutral expression, eyes open, looking directly at camera.
2. Styling & Attire: Wear neat, clean, professional smart-casual attire (such as a crisp collared shirt, modern blouse, or neat plain top/suit matching the subject's style, but DO NOT force a heavy formal suit if not needed).
3. Background: ${background}
4. Lighting & Quality: Bright, even studio lighting with no harsh shadows on the face or background, crystal clear 4K quality, sharp focus, 300 DPI photorealistic rendering.
5. Hair: ${HAIR_PRESERVATION}`;
}

function buildKoreanPrompt(
  backgroundMode: BackgroundMode,
  backgroundColor: string,
): string {
  const background = koreanBackgroundInstruction(
    backgroundMode,
    backgroundColor,
  );
  return `CRITICAL INSTRUCTION: You are performing a high-precision Korean studio ID photo edit. Use the provided image as the exact facial reference. You MUST maintain 100% of the exact facial structure, eye shape, nose, ratio of the face, shape of the head, jawlines, expression, identity, and ethnicity without altering them. Do NOT change the person's core identity. ${HAIR_PRESERVATION}

Task Details:
1. Subject & Framing: Transform the attached photo into a stunning passport/ID photo. The person must be facing forward with a neutral expression. Smooth out minor facial imperfections naturally but retain realistic skin texture.
2. Styling & Attire: Dress the person in a neat white collared shirt as formal attire, with minimal makeup and no accessories.
3. Background: ${background}
4. Lighting & Aesthetic: Korean photography style: professional bright studio light, evenly distributed soft lighting, crystal clear 4K quality, sharp focus, providing a highly polished and professional look.
5. Hair: ${HAIR_PRESERVATION}`;
}

function buildCorporatePrompt(
  backgroundMode: BackgroundMode,
  backgroundColor: string,
): string {
  const lightingAndBackground = corporateLightingAndBackground(
    backgroundMode,
    backgroundColor,
  );
  return `CRITICAL INSTRUCTION: Use the provided image as the exact facial reference. Match the subject's real gender presentation (woman/man/person). You MUST maintain 100% of the exact facial structure, eye shape, nose, expression, identity, age, and key features without changing or hallucinating them. Do NOT alter the face. ${HAIR_PRESERVATION}

Professional corporate headshot of this person in their mid-30s, wearing a charcoal tailored blazer over a white shirt, ${lightingAndBackground}, neutral confident expression, slight smile, eyes sharp and direct at camera, shot on an 85mm lens, shallow depth of field, magazine-quality sharpness.`;
}

export function buildStylePrompt(
  mode: ProcessingMode,
  backgroundMode: BackgroundMode,
  backgroundColor: string,
): string {
  if (mode === "classic") {
    return buildClassicPrompt(backgroundMode, backgroundColor);
  }
  if (mode === "korean") {
    return buildKoreanPrompt(backgroundMode, backgroundColor);
  }
  return buildCorporatePrompt(backgroundMode, backgroundColor);
}
