import { useState, useEffect, useCallback, useMemo } from 'react'
import Leaderboard from './components/Leaderboard'
import Rooms from './components/Rooms'
import { fetchLeaderboard, fetchRoomsAll } from './api'

const REFRESH_INTERVAL = 60_000 // 60 seconds

const GROUP_LABELS = {
  player_match: '플매',
  rank_match: '랭크매치',
}

const GROUP_ORDER = ['rank_match', 'player_match']

function formatGroupName(key) {
  return GROUP_LABELS[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function load(fetcher, setState) {
  setState((s) => ({ ...s, loading: true, error: null }))
  fetcher()
    .then((data) => setState({ data, loading: false, error: null }))
    .catch((e) => setState((s) => ({ ...s, loading: false, error: e.message })))
}

export default function App() {
  const [tab, setTab] = useState(null)
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

  const groups = rooms.data?.groups ?? {}
  const groupKeys = useMemo(() => {
    const known = GROUP_ORDER.filter((k) => k in groups)
    const rest = Object.keys(groups).filter((k) => !GROUP_ORDER.includes(k))
    return [...known, ...rest]
  }, [groups])

  const tabs = useMemo(
    () => [...groupKeys.map((k) => ({ key: k, label: `${formatGroupName(k)} (${groups[k].length})` })),
           { key: 'leaderboard', label: 'Leaderboard' }],
    [groupKeys, groups],
  )

  // Default to first room group tab, or leaderboard if no groups
  const activeTab = tab && tabs.some((t) => t.key === tab) ? tab : tabs[0]?.key ?? 'leaderboard'
  const isRoomTab = activeTab !== 'leaderboard'

  const activeRoomsData = isRoomTab
    ? { rooms: groups[activeTab] ?? [] }
    : null

  return (
    <div className="mx-auto max-w-[960px] px-4 pb-12">
      <header className="app-header relative border-b-2 border-primary pt-7 pb-5 mb-1 flex items-baseline gap-3">
        <h1 className="font-display text-[clamp(1.05rem,4vw,1.8rem)] font-[900] m-0 tracking-wide uppercase">
          Tag2Now
        </h1>
        <div className="inline-flex items-center gap-1.5 text-[0.72rem] font-bold tracking-[0.2em] uppercase text-primary">
          <span className="w-[7px] h-[7px] rounded-full bg-primary animate-[blink_1.6s_ease-in-out_infinite]" />
          Live
        </div>
      </header>

      <nav className="flex items-end flex-nowrap gap-0.5 mt-5 border-b border-border-light pb-0 overflow-x-auto overflow-y-hidden whitespace-nowrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`tab-btn${activeTab === t.key ? ' active' : ''}`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {isRoomTab && (
        <Rooms
          data={activeRoomsData}
          loading={rooms.loading}
          error={rooms.error}
          onRefresh={loadRooms}
          groupKey={activeTab}
        />
      )}
      {!isRoomTab && (rooms.loading || rooms.error) && groupKeys.length === 0 && (
        <Rooms data={null} loading={rooms.loading} error={rooms.error} onRefresh={loadRooms} />
      )}
      {activeTab === 'leaderboard' && <Leaderboard {...lb} onRefresh={loadLeaderboard} />}
    </div>
  )
}
