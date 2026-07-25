/**
 * AI providers for the processing engine.
 *
 * Provider selection (first configured key wins):
 *   1. FAL_KEY               → fal.ai: Flux Kontext identity-preserving style
 *                              pass (korean/corporate) + BiRefNet segmentation
 *   2. REPLICATE_API_TOKEN   → Replicate background remover
 *   3. REMOVE_BG_API_KEY     → remove.bg
 *   4. none                  → built-in mock (flood-fill matting) for local dev
 *
 * Face identity preservation: segmentation never touches pixels, and the
 * Kontext style pass is instruction-based editing explicitly constrained to
 * keep the face, features, expression and pose unchanged. When no generative
 * pass runs, styles fall back to deterministic photometric adjustments
 * (see stylePipeline.ts).
 */

import sharp from "sharp";
import type { AiProvider } from "@/lib/types";

import type { ProcessingMode } from "@/lib/types";

export interface CutoutResult {
  /** PNG buffer with transparent background. */
  png: Buffer;
  provider: AiProvider;
  /** True when a generative style pass (Flux Kontext) was already applied. */
  styleApplied: boolean;
  /** Set when a configured provider failed and the mock engine took over. */
  fallbackReason?: string;
}

/**
 * Full provider pipeline for one photo:
 *
 *   1. (fal only, korean/corporate) Flux Kontext identity-preserving style
 *      pass — instruction-based editing that keeps the face unchanged.
 *   2. Subject segmentation (BiRefNet / Replicate / remove.bg / mock).
 *
 * If a configured provider fails at runtime (network, quota, exhausted
 * balance…), the built-in mock engine takes over so the app keeps working,
 * and the reason is reported to the UI.
 */
export async function processCutout(
  input: Buffer,
  mode: ProcessingMode,
): Promise<CutoutResult> {
  if (process.env.FAL_KEY) {
    try {
      let working = input;
      let styleApplied = false;
      if (mode !== "classic") {
        working = await falStylePortrait(input, mode);
        styleApplied = true;
      }
      const png = await falRemoveBackground(working);
      return { png, provider: "fal", styleApplied };
    } catch (err) {
      console.error("[aiProviders] fal.ai pipeline failed, using mock:", err);
      return {
        png: await mockRemoveBackground(input),
        provider: "mock",
        styleApplied: false,
        fallbackReason: `fal.ai unavailable (${err instanceof Error ? err.message : "unknown error"}) — processed with the built-in engine instead.`,
      };
    }
  }
  if (process.env.REPLICATE_API_TOKEN) {
    try {
      const png = await replicateRemoveBackground(input);
      return { png, provider: "replicate", styleApplied: false };
    } catch (err) {
      console.error("[aiProviders] Replicate failed, using mock:", err);
      return {
        png: await mockRemoveBackground(input),
        provider: "mock",
        styleApplied: false,
        fallbackReason: "Replicate unavailable — processed with the built-in engine instead.",
      };
    }
  }
  if (process.env.REMOVE_BG_API_KEY) {
    try {
      const png = await removeBgRemoveBackground(input);
      return { png, provider: "removebg", styleApplied: false };
    } catch (err) {
      console.error("[aiProviders] remove.bg failed, using mock:", err);
      return {
        png: await mockRemoveBackground(input),
        provider: "mock",
        styleApplied: false,
        fallbackReason: "remove.bg unavailable — processed with the built-in engine instead.",
      };
    }
  }
  return {
    png: await mockRemoveBackground(input),
    provider: "mock",
    styleApplied: false,
  };
}

/**
 * Identity-preserving generative styling via FLUX.1 Kontext [pro].
 *
 * Kontext performs instruction-based edits while keeping the subject's
 * facial identity intact; the prompts additionally pin the face, features,
 * expression and pose so only lighting/tone/attire change.
 */
const KONTEXT_PROMPTS: Record<Exclude<ProcessingMode, "classic">, string> = {
  korean:
    "Relight this portrait with soft high-key Korean photo studio lighting, apply gentle natural skin smoothing and a refined bright studio tone. Keep the person's face, facial features, identity, expression, hairstyle and pose exactly the same. Do not change facial structure or proportions.",
  corporate:
    "Turn this portrait into a formal corporate headshot: crisp sharp focus, cool professional colour tone, and dress the person in formal dark business attire with a collared shirt. Keep the person's face, facial features, identity, expression, hairstyle and pose exactly the same. Do not change facial structure or proportions.",
};

async function falStylePortrait(
  input: Buffer,
  mode: Exclude<ProcessingMode, "classic">,
): Promise<Buffer> {
  const res = await fetch("https://fal.run/fal-ai/flux-pro/kontext", {
    method: "POST",
    headers: {
      Authorization: `Key ${process.env.FAL_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: KONTEXT_PROMPTS[mode],
      image_url: toDataUrl(input),
      guidance_scale: 3.5,
      num_images: 1,
      output_format: "png",
      safety_tolerance: "2",
    }),
  });
  if (!res.ok) {
    throw new Error(`Flux Kontext request failed (${res.status}): ${await res.text()}`);
  }
  const json = (await res.json()) as { images?: Array<{ url?: string }> };
  const url = json.images?.[0]?.url;
  if (!url) throw new Error("Flux Kontext returned no image.");
  return fetchBinary(url);
}

function toDataUrl(buffer: Buffer): string {
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8;
  return `data:image/${isJpeg ? "jpeg" : "png"};base64,${buffer.toString("base64")}`;
}

async function fetchBinary(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download processed image (${res.status}).`);
  return Buffer.from(await res.arrayBuffer());
}

/** fal.ai — BiRefNet high-quality subject segmentation. */
async function falRemoveBackground(input: Buffer): Promise<Buffer> {
  const res = await fetch("https://fal.run/fal-ai/birefnet", {
    method: "POST",
    headers: {
      Authorization: `Key ${process.env.FAL_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image_url: toDataUrl(input) }),
  });
  if (!res.ok) {
    throw new Error(`fal.ai request failed (${res.status}): ${await res.text()}`);
  }
  const json = (await res.json()) as { image?: { url?: string } };
  if (!json.image?.url) throw new Error("fal.ai returned no image.");
  return fetchBinary(json.image.url);
}

/** Replicate — 851-labs/background-remover with synchronous wait. */
async function replicateRemoveBackground(input: Buffer): Promise<Buffer> {
  const res = await fetch(
    "https://api.replicate.com/v1/models/851-labs/background-remover/predictions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
        Prefer: "wait=60",
      },
      body: JSON.stringify({ input: { image: toDataUrl(input) } }),
    },
  );
  if (!res.ok) {
    throw new Error(`Replicate request failed (${res.status}): ${await res.text()}`);
  }
  const json = (await res.json()) as { output?: string; error?: string };
  if (json.error) throw new Error(`Replicate error: ${json.error}`);
  if (!json.output) throw new Error("Replicate returned no output.");
  return fetchBinary(json.output);
}

/** remove.bg — dedicated background removal API. */
async function removeBgRemoveBackground(input: Buffer): Promise<Buffer> {
  const form = new FormData();
  form.append("image_file_b64", input.toString("base64"));
  form.append("size", "auto");
  form.append("format", "png");
  const res = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: { "X-Api-Key": process.env.REMOVE_BG_API_KEY as string },
    body: form,
  });
  if (!res.ok) {
    throw new Error(`remove.bg request failed (${res.status}): ${await res.text()}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

/**
 * Mock fallback for local development without API keys.
 *
 * Performs a tolerance-based flood fill from the image border: pixels whose
 * colour stays close to the border/corner background colour become
 * transparent. Works well for photos taken against a reasonably uniform
 * backdrop, which is what ID photo sources look like in practice.
 */
async function mockRemoveBackground(input: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Sample the average colour of small patches in the four corners.
  const patch = Math.max(2, Math.floor(Math.min(width, height) * 0.02));
  const corners: Array<[number, number]> = [
    [0, 0],
    [width - patch, 0],
    [0, height - patch],
    [width - patch, height - patch],
  ];
  const samples = corners.map(([cx, cy]) => {
    let r = 0;
    let g = 0;
    let b = 0;
    let n = 0;
    for (let y = cy; y < cy + patch; y++) {
      for (let x = cx; x < cx + patch; x++) {
        const i = (y * width + x) * channels;
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        n++;
      }
    }
    return [r / n, g / n, b / n] as const;
  });

  const TOLERANCE = 55;
  const toleranceSq = TOLERANCE * TOLERANCE;
  const isBackgroundColor = (i: number): boolean => {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    return samples.some(([sr, sg, sb]) => {
      const dr = r - sr;
      const dg = g - sg;
      const db = b - sb;
      return dr * dr + dg * dg + db * db <= toleranceSq;
    });
  };

  // BFS flood fill from every border pixel that matches the backdrop colour,
  // so subject regions that merely share the backdrop colour are kept.
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;
  const push = (x: number, y: number) => {
    const p = y * width + x;
    if (visited[p]) return;
    if (!isBackgroundColor(p * channels)) return;
    visited[p] = 1;
    queue[tail++] = p;
  };
  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    push(0, y);
    push(width - 1, y);
  }
  while (head < tail) {
    const p = queue[head++];
    const x = p % width;
    const y = (p - x) / width;
    if (x > 0) push(x - 1, y);
    if (x < width - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < height - 1) push(x, y + 1);
  }

  for (let p = 0; p < width * height; p++) {
    if (visited[p]) data[p * channels + 3] = 0;
  }

  return sharp(data, { raw: { width, height, channels: channels as 4 } })
    .png()
    .toBuffer();
}
