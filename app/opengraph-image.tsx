import { ImageResponse } from 'next/og'

export const alt = 'Spargo — GPU Image Dithering'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const RED = '#e30613'
const MARK_SIZES = [380, 312, 244, 176, 108, 48]

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '90px',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Layered red dither mark */}
      <div
        style={{
          position: 'relative',
          width: 380,
          height: 380,
          display: 'flex',
        }}
      >
        {MARK_SIZES.map((s, i) => (
          <div
            key={s}
            style={{
              position: 'absolute',
              top: (380 - s) / 2,
              left: (380 - s) / 2,
              width: s,
              height: s,
              background: RED,
              opacity: 0.16 + i * 0.16,
            }}
          />
        ))}
      </div>

      {/* Wordmark */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 14,
        }}
      >
        <div
          style={{
            fontSize: 168,
            fontWeight: 700,
            color: RED,
            letterSpacing: -4,
            lineHeight: 1,
          }}
        >
          SPARGO
        </div>
        <div style={{ fontSize: 30, color: RED, letterSpacing: 10 }}>
          GPU DITHERING
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: 44,
          left: 90,
          fontSize: 22,
          color: RED,
          letterSpacing: 6,
        }}
      >
        DARKROOM.ENGINEERING
      </div>
    </div>,
    size
  )
}
