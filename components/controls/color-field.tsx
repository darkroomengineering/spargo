'use client'

import { Popover } from '@base-ui/react/popover'
import type { ReactNode } from 'react'
import type { RGB } from '@/lib/store'

export function ColorField({
  color,
  children,
}: {
  color: RGB
  children: ReactNode
}) {
  const css = `rgb(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)})`

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] text-white/55 uppercase tracking-wider">
        color
      </span>
      <Popover.Root>
        <Popover.Trigger className="flex items-center gap-2 rounded-md border border-[var(--color-border)] px-2 py-1.5 text-[11px] hover:border-white/40">
          <span
            className="size-4 rounded-sm border border-white/20"
            style={{ backgroundColor: css }}
          />
          <span className="text-white/70">{css}</span>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner sideOffset={6} className="z-20">
            <Popover.Popup className="rounded-md border border-[var(--color-border)] bg-[#0c0c0c] p-2 shadow-xl">
              {children}
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )
}
