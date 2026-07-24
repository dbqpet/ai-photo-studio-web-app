import { describe, expect, it } from 'vitest'
import {
  applyAdjustments,
  DEFAULT_ADJUSTMENTS,
  toCssFilter,
  type Adjustments,
} from './adjustments'

const pixel = (r: number, g: number, b: number, a = 255) =>
  new Uint8ClampedArray([r, g, b, a])

describe('applyAdjustments', () => {
  it('leaves pixels unchanged with default adjustments', () => {
    const data = pixel(100, 150, 200)
    applyAdjustments(data, DEFAULT_ADJUSTMENTS)
    expect(Array.from(data)).toEqual([100, 150, 200, 255])
  })

  it('increases channel values when brightness is positive', () => {
    const data = pixel(100, 100, 100)
    applyAdjustments(data, { ...DEFAULT_ADJUSTMENTS, brightness: 20 })
    expect(data[0]).toBeGreaterThan(100)
  })

  it('clamps values to the 0-255 range', () => {
    const data = pixel(250, 250, 250)
    applyAdjustments(data, { ...DEFAULT_ADJUSTMENTS, brightness: 100 })
    expect(data[0]).toBe(255)
    const dark = pixel(5, 5, 5)
    applyAdjustments(dark, { ...DEFAULT_ADJUSTMENTS, brightness: -100 })
    expect(dark[0]).toBe(0)
  })

  it('converts to gray when grayscale is 100', () => {
    const data = pixel(255, 0, 0)
    applyAdjustments(data, { ...DEFAULT_ADJUSTMENTS, grayscale: 100 })
    expect(data[0]).toBe(data[1])
    expect(data[1]).toBe(data[2])
  })

  it('inverts colors fully when invert is 100', () => {
    const data = pixel(0, 0, 0)
    applyAdjustments(data, { ...DEFAULT_ADJUSTMENTS, invert: 100 })
    expect(Array.from(data.slice(0, 3))).toEqual([255, 255, 255])
  })

  it('never mutates the alpha channel', () => {
    const data = pixel(10, 20, 30, 128)
    applyAdjustments(data, {
      brightness: 50,
      contrast: 50,
      saturation: 50,
      grayscale: 50,
      sepia: 50,
      invert: 50,
    })
    expect(data[3]).toBe(128)
  })
})

describe('toCssFilter', () => {
  it('maps the neutral state to identity filters', () => {
    expect(toCssFilter(DEFAULT_ADJUSTMENTS)).toBe(
      'brightness(1) contrast(1) saturate(1) grayscale(0) sepia(0) invert(0)',
    )
  })

  it('reflects adjustment values in the filter string', () => {
    const adj: Adjustments = {
      ...DEFAULT_ADJUSTMENTS,
      brightness: 50,
      grayscale: 100,
    }
    expect(toCssFilter(adj)).toContain('brightness(1.5)')
    expect(toCssFilter(adj)).toContain('grayscale(1)')
  })
})
