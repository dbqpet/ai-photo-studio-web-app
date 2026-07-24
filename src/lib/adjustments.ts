export interface Adjustments {
  /** -100..100, 0 = no change */
  brightness: number
  /** -100..100, 0 = no change */
  contrast: number
  /** -100..100, 0 = no change */
  saturation: number
  /** 0..100, 0 = no change */
  grayscale: number
  /** 0..100, 0 = no change */
  sepia: number
  /** 0..100, 0 = no change */
  invert: number
}

export const DEFAULT_ADJUSTMENTS: Adjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  grayscale: 0,
  sepia: 0,
  invert: 0,
}

const clamp = (value: number): number =>
  value < 0 ? 0 : value > 255 ? 255 : value

/**
 * Applies image adjustments to an RGBA pixel buffer in place.
 *
 * The buffer is a flat array of [r, g, b, a, r, g, b, a, ...] as produced by
 * `CanvasRenderingContext2D#getImageData`. Kept free of DOM APIs so it can be
 * unit tested in a plain JS environment.
 */
export function applyAdjustments(
  data: Uint8ClampedArray,
  adjustments: Adjustments,
): Uint8ClampedArray {
  const brightness = adjustments.brightness * 2.55
  const contrastFactor =
    (259 * (adjustments.contrast + 255)) / (255 * (259 - adjustments.contrast))
  const satAmount = adjustments.saturation / 100
  const grayAmount = adjustments.grayscale / 100
  const sepiaAmount = adjustments.sepia / 100
  const invertAmount = adjustments.invert / 100

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i]
    let g = data[i + 1]
    let b = data[i + 2]

    r += brightness
    g += brightness
    b += brightness

    r = contrastFactor * (r - 128) + 128
    g = contrastFactor * (g - 128) + 128
    b = contrastFactor * (b - 128) + 128

    if (satAmount !== 0) {
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
      const factor = 1 + satAmount
      r = luma + (r - luma) * factor
      g = luma + (g - luma) * factor
      b = luma + (b - luma) * factor
    }

    if (grayAmount > 0) {
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
      r = r + (luma - r) * grayAmount
      g = g + (luma - g) * grayAmount
      b = b + (luma - b) * grayAmount
    }

    if (sepiaAmount > 0) {
      const sr = 0.393 * r + 0.769 * g + 0.189 * b
      const sg = 0.349 * r + 0.686 * g + 0.168 * b
      const sb = 0.272 * r + 0.534 * g + 0.131 * b
      r = r + (sr - r) * sepiaAmount
      g = g + (sg - g) * sepiaAmount
      b = b + (sb - b) * sepiaAmount
    }

    if (invertAmount > 0) {
      r = r + (255 - r - r) * invertAmount
      g = g + (255 - g - g) * invertAmount
      b = b + (255 - b - b) * invertAmount
    }

    data[i] = clamp(r)
    data[i + 1] = clamp(g)
    data[i + 2] = clamp(b)
  }

  return data
}

/** Builds a CSS filter string mirroring the pixel-level adjustments for live preview. */
export function toCssFilter(adjustments: Adjustments): string {
  const parts = [
    `brightness(${1 + adjustments.brightness / 100})`,
    `contrast(${1 + adjustments.contrast / 100})`,
    `saturate(${1 + adjustments.saturation / 100})`,
    `grayscale(${adjustments.grayscale / 100})`,
    `sepia(${adjustments.sepia / 100})`,
    `invert(${adjustments.invert / 100})`,
  ]
  return parts.join(' ')
}
