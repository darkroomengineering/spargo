'use client'

import { Select } from '@base-ui/react/select'
import { useRef } from 'react'
import { RgbColorPicker } from 'react-colorful'
import {
  configSchema,
  DEFAULT_CONFIG,
  DITHER_MODES,
  type RGB,
  useStore,
} from '@/lib/store'
import { ColorField } from './color-field'
import { SliderField } from './slider-field'

const MODE_ITEMS = DITHER_MODES.map((mode) => ({ label: mode, value: mode }))

function toPicker(color: RGB) {
  return {
    r: Math.round(color.r * 255),
    g: Math.round(color.g * 255),
    b: Math.round(color.b * 255),
  }
}

export function Controls() {
  const gammaCorrection = useStore((state) => state.gammaCorrection)
  const granularity = useStore((state) => state.granularity)
  const opacity = useStore((state) => state.opacity)
  const color = useStore((state) => state.color)
  const mode = useStore((state) => state.mode)
  const file = useStore((state) => state.file)
  const recording = useStore((state) => state.recording)

  const setConfig = useStore((state) => state.setConfig)
  const loadConfig = useStore((state) => state.loadConfig)
  const resetConfig = useStore((state) => state.resetConfig)
  const setFile = useStore((state) => state.setFile)

  const importInputRef = useRef<HTMLInputElement>(null)

  function onDrop(event: React.DragEvent) {
    event.preventDefault()
    const dropped = event.dataTransfer.files?.[0]
    if (dropped) setFile(dropped)
  }

  function exportConfig() {
    const { color: c } = useStore.getState()
    const config = { gammaCorrection, granularity, color: c, opacity, mode }
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: 'application/json',
    })
    const link = document.createElement('a')
    link.download = 'spargo-config.json'
    link.href = URL.createObjectURL(blob)
    link.click()
  }

  function importConfig(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0]
    if (!selected) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = configSchema.parse(JSON.parse(String(reader.result)))
        loadConfig(parsed)
      } catch (error) {
        console.error('Invalid config file', error)
      }
    }
    reader.readAsText(selected)
    event.target.value = ''
  }

  function runAction(name: 'exportImage' | 'startRecording' | 'stopRecording') {
    useStore.getState().actions[name]?.()
  }

  return (
    <aside
      className="fixed top-4 right-4 z-10 flex w-[clamp(240px,22vw,300px)] flex-col gap-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 backdrop-blur-md"
      aria-label="Dithering controls"
    >
      <header className="flex items-baseline justify-between">
        <h1 className="font-bold text-sm uppercase tracking-[0.2em]">spargo</h1>
        <span className="text-[10px] text-white/40">GPU dithering</span>
      </header>

      <label
        className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-[var(--color-border)] border-dashed px-3 py-5 text-center transition-colors hover:border-white/40"
        onDrop={onDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        <span className="text-[11px] text-white/70">
          {file ? file.name : 'Drop or click to upload'}
        </span>
        <span className="text-[10px] text-white/40">image · video · .glb</span>
        <input
          type="file"
          accept="image/*,video/*,.glb,.gltf"
          className="hidden"
          onChange={(event) => {
            const selected = event.target.files?.[0]
            if (selected) setFile(selected)
          }}
        />
      </label>

      <div className="flex flex-col gap-4">
        <SliderField
          label="gamma"
          value={gammaCorrection}
          min={0}
          max={2}
          step={0.01}
          onValueChange={(value) => setConfig({ gammaCorrection: value })}
        />
        <SliderField
          label="granularity"
          value={granularity}
          min={1}
          max={10}
          step={1}
          onValueChange={(value) => setConfig({ granularity: value })}
        />
        <SliderField
          label="opacity"
          value={opacity}
          min={0}
          max={1}
          step={0.01}
          onValueChange={(value) => setConfig({ opacity: value })}
        />

        <ColorField color={color}>
          <RgbColorPicker
            color={toPicker(color)}
            onChange={(next) =>
              setConfig({
                color: { r: next.r / 255, g: next.g / 255, b: next.b / 255 },
              })
            }
          />
        </ColorField>

        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] text-white/55 uppercase tracking-wider">
            mode
          </span>
          <Select.Root
            items={MODE_ITEMS}
            value={mode}
            onValueChange={(value) => {
              if (value) setConfig({ mode: value })
            }}
          >
            <Select.Trigger className="flex items-center justify-between rounded-md border border-[var(--color-border)] px-2.5 py-1.5 text-[11px] hover:border-white/40">
              <Select.Value />
              <Select.Icon className="text-white/50">▾</Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Positioner sideOffset={4} className="z-20">
                <Select.Popup className="max-h-64 overflow-auto rounded-md border border-[var(--color-border)] bg-[#0c0c0c] p-1 text-[11px] shadow-xl">
                  {MODE_ITEMS.map((item) => (
                    <Select.Item
                      key={item.value}
                      value={item.value}
                      className="flex cursor-pointer items-center justify-between rounded px-2 py-1 data-[highlighted]:bg-white/10"
                    >
                      <Select.ItemText>{item.label}</Select.ItemText>
                      <Select.ItemIndicator>✓</Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Popup>
              </Select.Positioner>
            </Select.Portal>
          </Select.Root>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <button
          type="button"
          className="rounded-md border border-[var(--color-border)] px-2 py-1.5 hover:bg-white/10"
          onClick={() => runAction('exportImage')}
        >
          Export PNG
        </button>
        <button
          type="button"
          className="rounded-md border border-[var(--color-border)] px-2 py-1.5 hover:bg-white/10 data-[recording=true]:border-red-400 data-[recording=true]:text-red-300"
          data-recording={recording}
          onClick={() =>
            runAction(recording ? 'stopRecording' : 'startRecording')
          }
        >
          {recording ? 'Stop rec' : 'Record'}
        </button>
        <button
          type="button"
          className="rounded-md border border-[var(--color-border)] px-2 py-1.5 hover:bg-white/10"
          onClick={() => importInputRef.current?.click()}
        >
          Import cfg
        </button>
        <button
          type="button"
          className="rounded-md border border-[var(--color-border)] px-2 py-1.5 hover:bg-white/10"
          onClick={exportConfig}
        >
          Export cfg
        </button>
        <button
          type="button"
          className="col-span-2 rounded-md border border-[var(--color-border)] px-2 py-1.5 text-white/60 hover:bg-white/10"
          onClick={() => {
            resetConfig()
            loadConfig(DEFAULT_CONFIG)
          }}
        >
          Reset
        </button>
      </div>

      <input
        ref={importInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={importConfig}
      />
    </aside>
  )
}
