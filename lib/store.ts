import { z } from 'zod'
import { create } from 'zustand'
import {
  type DithererName,
  type DitheringMode,
  ORDERED_DITHERERS,
} from '@/webgl/utils/ordered-ditherers'

/** All selectable dithering modes: every ordered matrix plus pure RANDOM. */
export const DITHER_MODES: DitheringMode[] = [
  ...(Object.keys(ORDERED_DITHERERS) as DithererName[]),
  'RANDOM',
]

const colorSchema = z.object({
  r: z.number().min(0).max(1),
  g: z.number().min(0).max(1),
  b: z.number().min(0).max(1),
})

/** Validates an imported config file (ranges + a known mode). */
export const configSchema = z.object({
  gammaCorrection: z.number().min(0).max(2),
  granularity: z.number().int().min(1).max(10),
  color: colorSchema,
  opacity: z.number().min(0).max(1),
  mode: z.custom<DitheringMode>(
    (value) =>
      typeof value === 'string' &&
      DITHER_MODES.includes(value as DitheringMode),
    { message: 'unknown dithering mode' }
  ),
})

export type RGB = z.infer<typeof colorSchema>
export type DitheringConfig = z.infer<typeof configSchema>

export const DEFAULT_CONFIG: DitheringConfig = {
  gammaCorrection: 1,
  granularity: 1,
  color: { r: 0, g: 0, b: 1 },
  opacity: 1,
  mode: 'DOT_DIAGONAL_16x16',
}

/**
 * Imperative export/record actions live inside the R3F canvas (they need the
 * renderer + sizing), but the controls panel lives in the DOM. The canvas
 * registers them here so the DOM can invoke them.
 */
interface CanvasActions {
  exportImage?: () => void
  startRecording?: () => void
  stopRecording?: () => void
}

interface SpargoState extends DitheringConfig {
  file: File | null
  recording: boolean
  actions: CanvasActions
  setConfig: (partial: Partial<DitheringConfig>) => void
  loadConfig: (config: DitheringConfig) => void
  resetConfig: () => void
  setFile: (file: File | null) => void
  setRecording: (recording: boolean) => void
  registerActions: (actions: CanvasActions) => void
}

export const useStore = create<SpargoState>((set) => ({
  ...DEFAULT_CONFIG,
  file: null,
  recording: false,
  actions: {},
  setConfig: (partial) => set(partial),
  loadConfig: (config) => set(config),
  resetConfig: () => set(DEFAULT_CONFIG),
  setFile: (file) => set({ file }),
  setRecording: (recording) => set({ recording }),
  registerActions: (actions) =>
    set((state) => ({ actions: { ...state.actions, ...actions } })),
}))
