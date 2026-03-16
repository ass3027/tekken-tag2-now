import { useState, useEffect, useCallback } from 'react'
import Leaderboard from './components/Leaderboard'
import Rooms from './components/Rooms'
import { fetchLeaderboard, fetchRoomsAll } from './api'

const REFRESH_INTERVAL = 60_000 // 60 seconds

const TABS = ['Matching', 'Leaderboard']

function load(fetcher, setState) {
  setState((s) => ({ ...s, loading: true, error: null }))
  fetcher()
    .then((data) => setState({ data, loading: false, error: null }))
    .catch((e) => setState((s) => ({ ...s, loading: false, error: e.message })))
}

export default function App() {
  const [tab, setTab] = useState('Matching')
  const [lb, setLb] = useState({ data: null, loading: true, error: null })
  const [rooms, setRooms] = useState({ data: null, loading: true, error: null })

  const loadLeaderboard = useCallback(() => load(() => fetchLeaderboard(20), setLb), [])
  const loadRooms = useCallback(() => load(fetchRoomsAll, setRooms), [])

  useEffect(() => {
    loadLeaderboard()
    loadRooms()
    const timer = setInterval(() => {
      loadLeaderboard()
      loadRooms()
    }, REFRESH_INTERVAL)
    return () => clearInterval(timer)
  }, [loadLeaderboard, loadRooms])

  return (
    <div className="mx-auto max-w-[960px] px-4 pb-12">
      <header className="app-header relative border-b-2 border-primary pt-7 pb-5 mb-1">
        <h1 className="font-display text-[clamp(1.05rem,4vw,1.8rem)] font-[900] m-0 mb-1.5 tracking-wide uppercase">
          Tekken Tag Tournament 2
        </h1>
        <div className="inline-flex items-center gap-1.5 text-[0.72rem] font-bold tracking-[0.2em] uppercase text-primary">
          <span className="w-[7px] h-[7px] rounded-full bg-primary animate-[blink_1.6s_ease-in-out_infinite]" />
          Live
        </div>
      </header>

      <nav className="flex items-end flex-wrap gap-0.5 mt-5 border-b border-border-light pb-0">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`tab-btn${tab === t ? ' active' : ''}`}
          >
            {t}
          </button>
        ))}
        <button
          className="refresh-btn"
          aria-label="Refresh"
          onClick={tab === 'Matching' ? loadRooms : loadLeaderboard}
        >
          ↻ Refresh
        </button>
      </nav>

      {tab === 'Matching' && <Rooms {...rooms} />}
      {tab === 'Leaderboard' && <Leaderboard {...lb} />}
    </div>
  )
}
