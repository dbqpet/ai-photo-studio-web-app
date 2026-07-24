/**
 * Background-removal providers for the AI processing engine.
 *
 * Each provider receives the source photo and returns a PNG *cutout* of the
 * subject with a transparent background. Face identity is preserved by
 * design: providers only segment the subject — no generative model ever
 * redraws facial pixels. Styling is applied afterwards as deterministic
 * photometric adjustments (see stylePipeline.ts).
 *
 * Provider selection (first configured key wins):
 *   1. FAL_KEY               → fal.ai BiRefNet segmentation
 *   2. REPLICATE_API_TOKEN   → Replicate background remover
 *   3. REMOVE_BG_API_KEY     → remove.bg
 *   4. none                  → built-in mock (flood-fill matting) for local dev
 */

import sharp from "sharp";
import type { AiProvider } from "@/lib/types";

export interface CutoutResult {
  /** PNG buffer with transparent background. */
  png: Buffer;
  provider: AiProvider;
}

export async function removeBackground(input: Buffer): Promise<CutoutResult> {
  if (process.env.FAL_KEY) {
    return { png: await falRemoveBackground(input), provider: "fal" };
  }
  if (process.env.REPLICATE_API_TOKEN) {
    return { png: await replicateRemoveBackground(input), provider: "replicate" };
  }
  if (process.env.REMOVE_BG_API_KEY) {
    return { png: await removeBgRemoveBackground(input), provider: "removebg" };
  }
  return { png: await mockRemoveBackground(input), provider: "mock" };
}

function toDataUrl(buffer: Buffer): string {
  return `data:image/png;base64,${buffer.toString("base64")}`;
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
