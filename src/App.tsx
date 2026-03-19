import { useState, useMemo } from 'react'
import Leaderboard from './components/Leaderboard'
import Rooms from './components/Rooms'
import Header from './components/Header'
import Footer from './components/Footer'
import { GROUP_ORDER, formatGroupName } from './tabConfig'
import useLeaderboard from './hooks/useLeaderboard'
import useRooms from './hooks/useRooms'

export default function App() {
  const [tab, setTab] = useState<string | null>(null)
  const lb = useLeaderboard()
  const rooms = useRooms()

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
    <div className="mx-auto max-w-240 pb-12">
      <Header totalUsers={rooms.data?.totalUsers} leaderboardEntries={lb.data?.entries} />

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

      <div>
        {isRoomTab && (
          <Rooms
            data={activeRoomsData}
            loading={rooms.loading}
            refreshing={rooms.refreshing}
            error={rooms.error}
            onRefresh={rooms.refresh}
            groupKey={activeTab}
          />
        )}
        {!isRoomTab && (rooms.loading || rooms.error) && groupKeys.length === 0 && (
          <Rooms data={null} loading={rooms.loading} error={rooms.error} onRefresh={rooms.refresh} />
        )}
        {activeTab === 'leaderboard' && <Leaderboard data={lb.data} loading={lb.loading} refreshing={lb.refreshing} error={lb.error} onRefresh={lb.refresh} />}
      </div>

      <Footer />
    </div>
  )
}
