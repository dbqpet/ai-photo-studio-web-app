import { useCallback, useEffect, useRef, useState } from 'react'
import {
  applyAdjustments,
  DEFAULT_ADJUSTMENTS,
  toCssFilter,
  type Adjustments,
} from './lib/adjustments'
import './App.css'

interface SliderConfig {
  key: keyof Adjustments
  label: string
  min: number
  max: number
}

const SLIDERS: SliderConfig[] = [
  { key: 'brightness', label: 'Brightness', min: -100, max: 100 },
  { key: 'contrast', label: 'Contrast', min: -100, max: 100 },
  { key: 'saturation', label: 'Saturation', min: -100, max: 100 },
  { key: 'grayscale', label: 'Grayscale', min: 0, max: 100 },
  { key: 'sepia', label: 'Sepia', min: 0, max: 100 },
  { key: 'invert', label: 'Invert', min: 0, max: 100 },
]

interface Preset {
  name: string
  adjustments: Adjustments
}

const PRESETS: Preset[] = [
  { name: 'Original', adjustments: DEFAULT_ADJUSTMENTS },
  {
    name: 'Vivid',
    adjustments: { ...DEFAULT_ADJUSTMENTS, saturation: 40, contrast: 20 },
  },
  {
    name: 'Noir',
    adjustments: { ...DEFAULT_ADJUSTMENTS, grayscale: 100, contrast: 25 },
  },
  {
    name: 'Vintage',
    adjustments: { ...DEFAULT_ADJUSTMENTS, sepia: 60, brightness: 8 },
  },
  {
    name: 'Cool',
    adjustments: { ...DEFAULT_ADJUSTMENTS, saturation: -20, brightness: 6 },
  },
]

function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>('edited-photo')
  const [adjustments, setAdjustments] = useState<Adjustments>(DEFAULT_ADJUSTMENTS)
  const imageRef = useRef<HTMLImageElement | null>(null)

  const onFile = useCallback((file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImageSrc(reader.result as string)
    reader.readAsDataURL(file)
    setFileName(file.name.replace(/\.[^.]+$/, '') || 'edited-photo')
    setAdjustments(DEFAULT_ADJUSTMENTS)
  }, [])

  const updateAdjustment = (key: keyof Adjustments, value: number) =>
    setAdjustments((prev) => ({ ...prev, [key]: value }))

  const reset = () => setAdjustments(DEFAULT_ADJUSTMENTS)

  const download = useCallback(() => {
    const img = imageRef.current
    if (!img) return
    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(img, 0, 0)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    applyAdjustments(imageData.data, adjustments)
    ctx.putImageData(imageData, 0, 0)
    const link = document.createElement('a')
    link.download = `${fileName}-studio.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [adjustments, fileName])

  useEffect(() => {
    return () => {
      if (imageSrc?.startsWith('blob:')) URL.revokeObjectURL(imageSrc)
    }
  }, [imageSrc])

  return (
    <div className="app">
      <header className="app__header">
        <span className="app__logo" aria-hidden="true">
          &#9679;
        </span>
        <div>
          <h1>AI Photo Studio</h1>
          <p>Upload a photo, tune it with live filters, and export your edit.</p>
        </div>
      </header>

      <main className="studio">
        <section className="studio__canvas">
          {imageSrc ? (
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Editable preview"
              crossOrigin="anonymous"
              style={{ filter: toCssFilter(adjustments) }}
            />
          ) : (
            <label className="dropzone">
              <input
                type="file"
                accept="image/*"
                aria-label="Upload image"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
              <span className="dropzone__icon" aria-hidden="true">
                &#8682;
              </span>
              <strong>Upload a photo to begin</strong>
              <span className="dropzone__hint">PNG, JPG or WEBP</span>
            </label>
          )}
        </section>

        <aside className="studio__panel">
          <div className="panel__group">
            <h2>Presets</h2>
            <div className="preset-row">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  className="preset"
                  disabled={!imageSrc}
                  onClick={() => setAdjustments(preset.adjustments)}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="panel__group">
            <h2>Adjustments</h2>
            {SLIDERS.map((slider) => (
              <div className="slider" key={slider.key}>
                <label htmlFor={slider.key}>
                  {slider.label}
                  <span className="slider__value">{adjustments[slider.key]}</span>
                </label>
                <input
                  id={slider.key}
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  disabled={!imageSrc}
                  value={adjustments[slider.key]}
                  onChange={(e) =>
                    updateAdjustment(slider.key, Number(e.target.value))
                  }
                />
              </div>
            ))}
          </div>

          <div className="panel__actions">
            <button className="btn btn--ghost" onClick={reset} disabled={!imageSrc}>
              Reset
            </button>
            <button className="btn btn--primary" onClick={download} disabled={!imageSrc}>
              Download PNG
            </button>
          </div>

          {imageSrc && (
            <label className="replace-link">
              Replace photo
              <input
                type="file"
                accept="image/*"
                aria-label="Replace image"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
            </label>
          )}
        </aside>
      </main>
    </div>
  )
}

export default App
