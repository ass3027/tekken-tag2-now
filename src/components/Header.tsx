import { useState, useRef, useEffect } from 'react'
import { charImageUrl } from '@/shared/characterImage'
import type { LeaderboardEntry } from '@/types'
import { TIER_STYLES } from '@/shared/tierColors'

const LS_KEY = 'ttt2-username'

interface HeaderProps {
  totalUsers?: number
  leaderboardEntries?: LeaderboardEntry[]
}

export default function Header({ totalUsers, leaderboardEntries }: HeaderProps) {
  const [username, setUsername] = useState(() => localStorage.getItem(LS_KEY) ?? '')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  function startEditing() {
    setDraft(username)
    setEditing(true)
  }

  function commitEdit() {
    const trimmed = draft.trim()
    setUsername(trimmed)
    if (trimmed) {
      localStorage.setItem(LS_KEY, trimmed)
    } else {
      localStorage.removeItem(LS_KEY)
    }
    setEditing(false)
  }

  const entry = username
    ? leaderboardEntries?.find(e => e.online_name === username)
    : undefined

  const mainChar = entry?.player_info?.main_char_info
  const subChar = entry?.player_info?.sub_char_info

  return (
    <header className="app-header relative border-b-2 border-accent pt-2 pb-2 px-3 mb-1 flex justify-between items-center">
      <div className="flex items-center sm:items-baseline gap-3">
        <h1 className="font-display text-[clamp(1.05rem,4vw,1.8rem)] font-black m-0 tracking-wide uppercase">
          Tag<span className="header-accent">2</span>Now
        </h1>
        <div className="inline-flex items-center flex-col sm:flex-row sm:gap-2 text-[0.95rem] font-bold">
          <div className="inline-flex items-center gap-1.5 tracking-[0.2em] uppercase text-red-500">
            <span className="w-1.75 h-1.75 rounded-full bg-red-500 animate-[blink_1.6s_ease-in-out_infinite]" />
            Live
          </div>
          {totalUsers != null && totalUsers > 0 && (
            <span className="tracking-wide text-red-500">
              {totalUsers} online
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        {editing ? (
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') commitEdit() }}
            onBlur={commitEdit}
            placeholder="Enter username"
            className="bg-surface border border-border-light rounded px-2 py-0.5 mt-1 text-text-primary text-base w-36 outline-none focus:border-accent"
          />
        ) : username ? (
          <div className="flex flex-col sm:flex-row sm:gap-2 items-center">
            <div className="flex gap-2 sm:text-lg">
              <span className="text-accent font-bold">#{entry?.rank || "Unranked"}</span>
              <button
                  onClick={startEditing}
                  className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer bg-transparent border-none p-0 flex items-center gap-1"
              >
                <span className="truncate max-w-24 sm:max-w-none font-semibold">{username}</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                  <path d="M13.49 3.1a2 2 0 0 0-2.83 0L3.17 10.6a1 1 0 0 0-.26.45l-.77 2.9a.5.5 0 0 0 .6.6l2.9-.77a1 1 0 0 0 .45-.26l7.5-7.5a2 2 0 0 0 0-2.83l-.1-.1Z" />
                </svg>
              </button>
            </div>
            {entry && (
                <div className="flex sm:flex-col gap-1 leading-none">
                  {[mainChar, subChar].map(char => char &&
                    <div key={char.name} className="flex items-center">
                      {char.rank_info && (
                        <span className="hidden sm:inline w-2/3 text-lg font-bold" style={TIER_STYLES[char.rank_info.tier]}>
                          {char.rank_info.name}
                        </span>
                      )}
                      <img src={charImageUrl(char.name)!} alt={char.name} className="w-7 h-7 rounded" />
                      <div className="flex flex-col items-start font-semibold">
                        <span>W{char.wins}</span>
                        <span>L{char.losses}</span>
                      </div>
                    </div>
                  )}
                </div>
            )}
          </div>
        ) : (
          <button
            onClick={startEditing}
            className="text-text-secondary text-xl font-semibold hover:text-text-primary transition-colors cursor-pointer bg-transparent border-2 rounded-sm mt-1 px-1"
          >
            Set username
          </button>
        )}
      </div>
    </header>
  )
}
