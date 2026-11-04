import { useMemo } from 'react'
import { usePlayer } from '../context/PlayerContext'

/** Lightweight color wash — solid CSS only (no blurred cover images). */
export function AmbientAura() {
  const { currentTrack, isPlaying } = usePlayer()

  const colors = useMemo(() => {
    const seed = currentTrack?.id || 'x'
    let h = 0
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
    const a = h % 360
    const b = (h * 7) % 360
    return {
      c1: `hsl(${a} 55% 32%)`,
      c2: `hsl(${b} 50% 28%)`,
    }
  }, [currentTrack?.id])

  if (!currentTrack) return null

  return (
    <div
      className={`ambient-aura ${isPlaying ? 'is-playing' : ''}`}
      aria-hidden
      style={{ ['--c1' as string]: colors.c1, ['--c2' as string]: colors.c2 }}
    >
      <span className="ambient-blob b1" />
      <span className="ambient-blob b2" />
    </div>
  )
}
