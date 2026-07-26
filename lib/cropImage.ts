/** Helpers for react-easy-crop → cropped data URL. */

export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load image for cropping."));
    img.src = src;
  });
}

/**
 * Crop the source image to the pixel area from react-easy-crop and return
 * a JPEG data URL suitable for upload / API processing.
 */
export async function getCroppedDataUrl(
  imageSrc: string,
  crop: PixelCrop,
  outputWidth = 1200,
): Promise<string> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const aspect = crop.width / crop.height;
  const width = outputWidth;
  const height = Math.round(outputWidth / aspect);
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable.");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    width,
    height,
  );
  return canvas.toDataURL("image/jpeg", 0.95);
}
