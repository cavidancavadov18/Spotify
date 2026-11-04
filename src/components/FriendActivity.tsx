import { friendActivity } from '../data/activity'
import { usePlayer } from '../context/PlayerContext'
import { CloseIcon } from './Icons'

function timeAgo(mins: number) {
  if (mins < 60) return `${mins} min ago`
  const h = Math.floor(mins / 60)
  return `${h} hr${h > 1 ? 's' : ''} ago`
}

export function FriendActivity() {
  const { friendsOpen, setFriendsOpen, setSearchQuery, setView } = usePlayer()
  if (!friendsOpen) return null

  return (
    <aside className="friends-panel panel-enter" aria-label="Friend Activity">
      <div className="friends-header">
        <h2>Friend Activity</h2>
        <button type="button" className="icon-btn" onClick={() => setFriendsOpen(false)}>
          <CloseIcon size={18} />
        </button>
      </div>
      <div className="friends-list">
        {friendActivity.map((f) => (
          <button
            key={f.id}
            type="button"
            className="friend-row"
            onClick={() => {
              setSearchQuery(f.artist)
              setView({ type: 'search' })
            }}
          >
            <img src={f.avatar} alt="" className="friend-avatar" />
            <div className="friend-meta">
              <div className="friend-name">{f.name}</div>
              <div className="friend-track">
                {f.track} · {f.artist}
              </div>
              <div className="friend-context">{f.context}</div>
            </div>
            <span className="friend-time">{timeAgo(f.minutesAgo)}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}
