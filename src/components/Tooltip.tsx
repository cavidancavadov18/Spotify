import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

type TipPos = 'top' | 'bottom' | 'left' | 'right'

type TipProps = {
  label: string
  children: ReactNode
  className?: string
  position?: TipPos
} & ButtonHTMLAttributes<HTMLButtonElement>

type TipBox = {
  text: string
  x: number
  y: number
  place: TipPos
}

function placeTip(
  rect: DOMRect,
  preferred: TipPos,
  tipW: number,
  tipH: number,
): { x: number; y: number; place: TipPos } {
  const gap = 10
  const vw = window.innerWidth
  const vh = window.innerHeight
  const pad = 8

  const candidates: TipPos[] = [preferred, 'top', 'bottom', 'left', 'right'].filter(
    (v, i, a) => a.indexOf(v) === i,
  ) as TipPos[]

  for (const place of candidates) {
    let x = 0
    let y = 0
    if (place === 'top') {
      x = rect.left + rect.width / 2 - tipW / 2
      y = rect.top - tipH - gap
    } else if (place === 'bottom') {
      x = rect.left + rect.width / 2 - tipW / 2
      y = rect.bottom + gap
    } else if (place === 'left') {
      x = rect.left - tipW - gap
      y = rect.top + rect.height / 2 - tipH / 2
    } else {
      x = rect.right + gap
      y = rect.top + rect.height / 2 - tipH / 2
    }
    x = Math.min(Math.max(pad, x), vw - tipW - pad)
    y = Math.min(Math.max(pad, y), vh - tipH - pad)

    const fits =
      (place === 'top' && rect.top - tipH - gap >= pad) ||
      (place === 'bottom' && rect.bottom + tipH + gap <= vh - pad) ||
      (place === 'left' && rect.left - tipW - gap >= pad) ||
      (place === 'right' && rect.right + tipW + gap <= vw - pad)

    if (fits || place === candidates[candidates.length - 1]) {
      return { x, y, place }
    }
  }
  return { x: pad, y: pad, place: preferred }
}

function FloatingTip({ box }: { box: TipBox | null }) {
  if (!box || typeof document === 'undefined') return null
  const style: CSSProperties = {
    left: box.x,
    top: box.y,
  }
  return createPortal(
    <div className={`spot-tip spot-tip-${box.place}`} style={style} role="tooltip">
      {box.text}
    </div>,
    document.body,
  )
}

function useFloatingTip(label: string, preferred: TipPos, disabled?: boolean) {
  const ref = useRef<HTMLElement | null>(null)
  const [box, setBox] = useState<TipBox | null>(null)
  const tipId = useId()

  const hide = useCallback(() => setBox(null), [])

  const show = useCallback(() => {
    if (disabled || !label || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    // Estimate tip size; refined after paint if needed
    const tipW = Math.min(280, Math.max(48, label.length * 7 + 24))
    const tipH = 28
    const placed = placeTip(rect, preferred, tipW, tipH)
    setBox({ text: label, ...placed })
  }, [disabled, label, preferred])

  useEffect(() => {
    if (!box) return
    const onScroll = () => hide()
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', hide)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', hide)
    }
  }, [box, hide])

  return {
    tipId,
    box,
    show,
    hide,
    setRef: (node: HTMLElement | null) => {
      ref.current = node
    },
  }
}

/** Spotify-style hover label — portals above player/panels, never clipped. */
export function TipButton({
  label,
  children,
  className = '',
  position = 'bottom',
  type = 'button',
  disabled,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...rest
}: TipProps) {
  const tip = useFloatingTip(label, position, disabled)

  return (
    <>
      <button
        type={type}
        className={`tip-host ${className}`.trim()}
        aria-label={label}
        aria-describedby={tip.box ? tip.tipId : undefined}
        disabled={disabled}
        ref={(node) => tip.setRef(node)}
        onMouseEnter={(e) => {
          tip.show()
          onMouseEnter?.(e)
        }}
        onMouseLeave={(e) => {
          tip.hide()
          onMouseLeave?.(e)
        }}
        onFocus={(e) => {
          tip.show()
          onFocus?.(e)
        }}
        onBlur={(e) => {
          tip.hide()
          onBlur?.(e)
        }}
        {...rest}
      >
        {children}
      </button>
      <FloatingTip box={tip.box ? { ...tip.box, text: label } : null} />
    </>
  )
}

export function TipSpan({
  label,
  children,
  className = '',
  position = 'bottom',
}: {
  label: string
  children: ReactNode
  className?: string
  position?: TipPos
}) {
  const tip = useFloatingTip(label, position)

  return (
    <>
      <span
        className={`tip-host ${className}`.trim()}
        ref={(node) => tip.setRef(node)}
        onMouseEnter={tip.show}
        onMouseLeave={tip.hide}
        onFocus={tip.show}
        onBlur={tip.hide}
      >
        {children}
      </span>
      <FloatingTip box={tip.box} />
    </>
  )
}
