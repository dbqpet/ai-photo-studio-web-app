import JSZip from "jszip";

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** e.g. ID_Photo_300DPI_20260728_153045.zip */
export function buildHdZipFilename(now = new Date()): string {
  const y = now.getFullYear();
  const m = pad2(now.getMonth() + 1);
  const d = pad2(now.getDate());
  const hh = pad2(now.getHours());
  const mm = pad2(now.getMinutes());
  const ss = pad2(now.getSeconds());
  return `ID_Photo_300DPI_${y}${m}${d}_${hh}${mm}${ss}.zip`;
}

function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
  if (!match) throw new Error("Invalid image data URL.");
  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function extensionFromDataUrl(dataUrl: string): "jpg" | "png" {
  return dataUrl.startsWith("data:image/png") ? "png" : "jpg";
}

/**
 * Pack single + 4R sheet into one ZIP and trigger a single browser download
 * (avoids mobile popup blockers from multiple simultaneous downloads).
 */
export async function downloadHdPhotosZip(options: {
  singleDataUrl: string;
  sheetDataUrl: string;
  style?: string;
}): Promise<string> {
  const zip = new JSZip();
  const style = (options.style || "photo").replace(/[^a-z0-9_-]+/gi, "_");
  const singleExt = extensionFromDataUrl(options.singleDataUrl);
  const sheetExt = extensionFromDataUrl(options.sheetDataUrl);

  zip.file(
    `ID_Photo_Single_300DPI_${style}.${singleExt}`,
    dataUrlToUint8Array(options.singleDataUrl),
  );
  zip.file(
    `ID_Photo_4R_Sheet_300DPI_${style}.${sheetExt}`,
    dataUrlToUint8Array(options.sheetDataUrl),
  );

  const blob = await zip.generateAsync({ type: "blob" });
  const filename = buildHdZipFilename();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return filename;
}
