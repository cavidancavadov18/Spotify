type IconProps = { size?: number; className?: string }

export function SpotifyLogo({ size = 24, className }: IconProps) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  )
}

export function HomeIcon({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" aria-hidden>
      <path d="M13.5 1.515a3 3 0 0 0-3 0L3 5.845a2 2 0 0 0-1 1.732V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6h4v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7.577a2 2 0 0 0-1-1.732l-7.5-4.33z" />
    </svg>
  )
}

export function HomeOutlineIcon({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" aria-hidden>
      <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z" />
    </svg>
  )
}

export function SearchIcon({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" aria-hidden>
      <path d="M10.533 1.279c-5.52 0-10 4.48-10 10s4.48 10 10 10c2.396 0 4.597-.84 6.32-2.24l4.86 4.86a1 1 0 0 0 1.414-1.415l-4.86-4.86A9.96 9.96 0 0 0 20.533 11.28c0-5.52-4.48-10-10-10zm0 2c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8z" />
    </svg>
  )
}

export function LibraryIcon({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" aria-hidden>
      <path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.464a1 1 0 0 0-.5-.866l-6-3.464zM9 2a1 1 0 0 0-1 1v18a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1z" />
    </svg>
  )
}

export function PlusIcon({ size = 16, className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} className={className} fill="currentColor" aria-hidden>
      <path d="M8 1.5a.75.75 0 0 1 .75.75V7.5h5.25a.75.75 0 0 1 0 1.5H8.75v5.25a.75.75 0 0 1-1.5 0V9H2a.75.75 0 0 1 0-1.5h5.25V2.25A.75.75 0 0 1 8 1.5z" />
    </svg>
  )
}

export function ChevronLeftIcon({ size = 16, className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} className={className} fill="currentColor" aria-hidden>
      <path d="M11.03.47a.75.75 0 0 1 0 1.06L4.56 8l6.47 6.47a.75.75 0 1 1-1.06 1.06L2.94 8.53a.75.75 0 0 1 0-1.06L9.97.47a.75.75 0 0 1 1.06 0z" />
    </svg>
  )
}

export function ChevronRightIcon({ size = 16, className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} className={className} fill="currentColor" aria-hidden>
      <path d="M4.97.47a.75.75 0 0 0 0 1.06L11.44 8l-6.47 6.47a.75.75 0 1 0 1.06 1.06l7.03-7.03a.75.75 0 0 0 0-1.06L6.03.47a.75.75 0 0 0-1.06 0z" />
    </svg>
  )
}

export function PlayIcon({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" aria-hidden>
      <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z" />
    </svg>
  )
}

export function PauseIcon({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" aria-hidden>
      <path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7H5.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-2.6z" />
    </svg>
  )
}

export function PrevIcon({ size = 16, className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} className={className} fill="currentColor" aria-hidden>
      <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.746a.7.7 0 0 1 1.05.606v12.38a.7.7 0 0 1-1.05.606L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z" />
    </svg>
  )
}

export function NextIcon({ size = 16, className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} className={className} fill="currentColor" aria-hidden>
      <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.104A.7.7 0 0 0 1 1.71v12.38a.7.7 0 0 0 1.05.606L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z" />
    </svg>
  )
}

export function ShuffleIcon({ size = 16, className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} className={className} fill="currentColor" aria-hidden>
      <path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356a2.25 2.25 0 0 1 1.724-.804h1.947l-1.017 1.018a.75.75 0 0 0 1.06 1.06L15.98 3.75 13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 0 0 .39 3.5z" />
      <path d="m7.5 10.723.98-1.167.957 1.14a2.25 2.25 0 0 0 1.724.804h1.947l-1.017-1.018a.75.75 0 1 1 1.06-1.06l2.829 2.828-2.829 2.828a.75.75 0 1 1-1.06-1.06L13.109 13H11.16a3.75 3.75 0 0 1-2.873-1.34l-.787-.938z" />
    </svg>
  )
}

export function RepeatIcon({ size = 16, className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} className={className} fill="currentColor" aria-hidden>
      <path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5A3.75 3.75 0 0 1 12.25 13.5H5.78l-.22.22a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l.22.22h6.47A2.25 2.25 0 0 0 14.5 9.75v-5A2.25 2.25 0 0 0 12.25 2.5h-8.5A2.25 2.25 0 0 0 1.5 4.75V6A.75.75 0 0 1 0 6V4.75z" />
      <path d="M7.12 14.28a.75.75 0 0 1-.22-.53v-1.5H3.75A3.75 3.75 0 0 1 0 8.5V7a.75.75 0 0 1 1.5 0v1.5a2.25 2.25 0 0 0 2.25 2.25h3.15v-1.5a.75.75 0 0 1 1.28-.53l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0z" />
    </svg>
  )
}

export function RepeatOneIcon({ size = 16, className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} className={className} fill="currentColor" aria-hidden>
      <path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h.75a.75.75 0 0 1 0 1.5h-.75A2.25 2.25 0 0 0 1.5 4.75V6A.75.75 0 0 1 0 6V4.75zm9.25-3a.75.75 0 0 1 .75-.75h2.25A3.75 3.75 0 0 1 16 4.75v5A3.75 3.75 0 0 1 12.25 13.5H5.78l-.22.22a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l.22.22h6.47A2.25 2.25 0 0 0 14.5 9.75v-5A2.25 2.25 0 0 0 12.25 2.5H10a.75.75 0 0 1-.75-.75z" />
      <path d="M7.12 14.28a.75.75 0 0 1-.22-.53v-1.5H3.75A3.75 3.75 0 0 1 0 8.5V7a.75.75 0 0 1 1.5 0v1.5a2.25 2.25 0 0 0 2.25 2.25h3.15v-1.5a.75.75 0 0 1 1.28-.53l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0zM9 3.25a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0V5.56l-.4.3a.75.75 0 1 1-.9-1.2l1.5-1.125A.75.75 0 0 1 9 3.25z" />
    </svg>
  )
}

export function VolumeIcon({ size = 16, className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} className={className} fill="currentColor" aria-hidden>
      <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.748 3.748 0 0 1-1.065-.827A3.75 3.75 0 0 1 0 8.25v-.5a3.75 3.75 0 0 1 3.991-3.74.75.75 0 0 1 .041 1.5 2.25 2.25 0 0 0-2.282 2.24v.5a2.25 2.25 0 0 0 .64 1.53 2.247 2.247 0 0 0 .64.496l6.926 4.001V1.5L5.034 4.79a.75.75 0 1 1-.768-1.29L9.366.26a.75.75 0 0 1 .375-.11zm3.623 2.204a.75.75 0 0 1 1.047.157A6.975 6.975 0 0 1 16 8a6.974 6.974 0 0 1-1.59 4.79.75.75 0 1 1-1.204-.894A5.475 5.475 0 0 0 14.5 8a5.475 5.475 0 0 0-1.335-3.536.75.75 0 0 1 .2-1.05z" />
      <path d="M11.832 4.722a.75.75 0 0 1 1.046.168A3.978 3.978 0 0 1 13.5 8a3.978 3.978 0 0 1-.622 2.11.75.75 0 1 1-1.214-.882A2.478 2.478 0 0 0 12 8c0-.55-.143-1.067-.396-1.516a.75.75 0 0 1 .228-1.012z" />
    </svg>
  )
}

export function VolumeMuteIcon({ size = 16, className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} className={className} fill="currentColor" aria-hidden>
      <path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06z" />
      <path d="M10.116.782A.75.75 0 0 1 10.5 1.5v13a.75.75 0 0 1-1.125.65l-6.925-4a3.748 3.748 0 0 1-1.065-.827A3.75 3.75 0 0 1 0 8.25v-.5a3.75 3.75 0 0 1 3.991-3.74.75.75 0 0 1 .041 1.5 2.25 2.25 0 0 0-2.282 2.24v.5a2.25 2.25 0 0 0 .64 1.53 2.247 2.247 0 0 0 .64.496l6.926 4.001V1.5L5.034 4.79a.75.75 0 1 1-.768-1.29L9.366.26a.75.75 0 0 1 .75.522z" />
    </svg>
  )
}

export function HeartIcon({ size = 16, className }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
      aria-hidden
      style={{ display: 'block', flexShrink: 0 }}
    >
      <path d="M8 13.92 2.86 8.52C1.72 7.32 1.2 6.2 1.2 5.16 1.2 3.36 2.48 2.08 4.24 2.08c1.04 0 2 .52 2.64 1.36L8 5.04l1.12-1.6A3.28 3.28 0 0 1 11.76 2.08c1.76 0 3.04 1.28 3.04 3.08 0 1.04-.52 2.16-1.66 3.36L8 13.92z" />
    </svg>
  )
}

export function HeartOutlineIcon({ size = 16, className }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
      aria-hidden
      style={{ display: 'block', flexShrink: 0 }}
    >
      <path d="M8 13.92 2.86 8.52C1.72 7.32 1.2 6.2 1.2 5.16 1.2 3.36 2.48 2.08 4.24 2.08c1.04 0 2 .52 2.64 1.36L8 5.04l1.12-1.6A3.28 3.28 0 0 1 11.76 2.08c1.76 0 3.04 1.28 3.04 3.08 0 1.04-.52 2.16-1.66 3.36L8 13.92zm0-1.84 4.4-4.64c.84-.88 1.2-1.68 1.2-2.36 0-.96-.72-1.68-1.84-1.68-.72 0-1.4.36-1.84.96L8 6.56 5.08 3.36c-.44-.6-1.12-.96-1.84-.96-1.12 0-1.84.72-1.84 1.68 0 .68.36 1.48 1.2 2.36L8 12.08z" />
    </svg>
  )
}

export function MoreIcon({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" aria-hidden>
      <path d="M4.5 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm15 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-7.5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
    </svg>
  )
}

export function QueueIcon({ size = 16, className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} className={className} fill="currentColor" aria-hidden>
      <path d="M15 15H1v-1.5h14V15zm0-4.5H1V9h14v1.5zm-14-7A2.5 2.5 0 0 1 3.5 1h9a2.5 2.5 0 0 1 0 5h-9A2.5 2.5 0 0 1 1 3.5zm2.5-1a1 1 0 0 0 0 2h9a1 1 0 1 0 0-2h-9z" />
    </svg>
  )
}

export function DeviceIcon({ size = 16, className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} className={className} fill="currentColor" aria-hidden>
      <path d="M2 3.75C2 2.784 2.784 2 3.75 2h8.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5zm1.75-.25a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25h-8.5z" />
      <path d="M6.25 7a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5z" />
    </svg>
  )
}

export function FullscreenIcon({ size = 16, className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} className={className} fill="currentColor" aria-hidden>
      <path d="M6.53 9.47a.75.75 0 0 1 0 1.06l-2.72 2.72h1.018a.75.75 0 0 1 0 1.5H1.25v-3.578a.75.75 0 0 1 1.5 0v1.018l2.72-2.72a.75.75 0 0 1 1.06 0zm2.94-2.94a.75.75 0 0 1 0-1.06l2.72-2.72h-1.018a.75.75 0 1 1 0-1.5h3.578v3.578a.75.75 0 0 1-1.5 0V3.81l-2.72 2.72a.75.75 0 0 1-1.06 0z" />
    </svg>
  )
}

export function MicIcon({ size = 16, className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} className={className} fill="currentColor" aria-hidden>
      <path d="M13.426 2.574a2.849 2.849 0 0 0-4.027.014l-4.9 4.9a.848.848 0 0 0-.214.368l-1.15 4.025a.5.5 0 0 0 .626.626l4.025-1.15a.848.848 0 0 0 .368-.214l4.9-4.9a2.85 2.85 0 0 0-.014-4.027l-.614-.642zm-3.0.986a1.35 1.35 0 0 1 1.91-.007l.62.646a1.35 1.35 0 0 1-.008 1.909l-.9.9-2.523-2.523.9-.925zM7.5 6.5 5.25 8.75l-.75 2.625 2.625-.75L9.375 8.35 7.5 6.5z" />
      <path d="m4.5 13.5.75.75H2.75A1.75 1.75 0 0 1 1 12.5V4.75A1.75 1.75 0 0 1 2.75 3h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25V12.5c0 .138.112.25.25.25H4.5z" />
    </svg>
  )
}

export function ClockIcon({ size = 16, className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} className={className} fill="currentColor" aria-hidden>
      <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z" />
      <path d="M8 3.25a.75.75 0 0 1 .75.75v3.25H11a.75.75 0 0 1 0 1.5H7.75V4A.75.75 0 0 1 8 3.25z" />
    </svg>
  )
}

export function CloseIcon({ size = 16, className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} className={className} fill="currentColor" aria-hidden>
      <path d="M2.47 2.47a.75.75 0 0 1 1.06 0L8 6.94l4.47-4.47a.75.75 0 1 1 1.06 1.06L9.06 8l4.47 4.47a.75.75 0 1 1-1.06 1.06L8 9.06l-4.47 4.47a.75.75 0 0 1-1.06-1.06L6.94 8 2.47 3.53a.75.75 0 0 1 0-1.06z" />
    </svg>
  )
}

export function MenuIcon({ size = 24, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" aria-hidden>
      <path d="M4 7.5A.75.75 0 0 1 4.75 6.75h14.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 7.5zm0 4.75a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H4.75a.75.75 0 0 1-.75-.75zm.75 4a.75.75 0 0 0 0 1.5h14.5a.75.75 0 0 0 0-1.5H4.75z" />
    </svg>
  )
}
