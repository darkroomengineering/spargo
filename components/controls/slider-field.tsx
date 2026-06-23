'use client'

import { Slider } from '@base-ui/react/slider'

interface SliderFieldProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onValueChange: (value: number) => void
}

export function SliderField({
  label,
  value,
  min,
  max,
  step,
  onValueChange,
}: SliderFieldProps) {
  return (
    <Slider.Root
      value={value}
      min={min}
      max={max}
      step={step}
      onValueChange={(next) =>
        onValueChange(Array.isArray(next) ? (next[0] ?? min) : next)
      }
    >
      <div className="flex items-baseline justify-between">
        <Slider.Label className="text-[10px] text-white/55 uppercase tracking-wider">
          {label}
        </Slider.Label>
        <Slider.Value className="text-[11px] text-white/80 tabular-nums" />
      </div>
      <Slider.Control className="flex h-4 w-full touch-none items-center">
        <Slider.Track className="h-px w-full bg-white/20">
          <Slider.Indicator className="h-px bg-white" />
          <Slider.Thumb className="size-2.5 rounded-full bg-white outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-white/60" />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  )
}
