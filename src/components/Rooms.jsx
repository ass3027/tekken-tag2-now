import { panelStatus } from '../panelStatus'
import LoadingBar from './LoadingBar'
import RankMatchTable from './RankMatchTable'
import PlayerMatchTable from './PlayerMatchTable'

export default function Rooms({ data, loading, refreshing, error, onRefresh, groupKey }) {
  const s = panelStatus(loading, error, 'Loading rooms...')
  if (s) return s
  if (!data) return null

  const rooms = data.rooms ?? []

  return (
    <div className="panel relative">
      <LoadingBar visible={refreshing} />
      <div className="panel-meta flex items-center justify-between">
        <span>{rooms.length} room{rooms.length !== 1 ? 's' : ''}</span>
        {onRefresh && (
          <button className="refresh-btn" aria-label="Refresh" onClick={onRefresh}>
            ↻ Refresh
          </button>
        )}
      </div>
      {rooms.length === 0 ? (
        <p className="state-msg">No active rooms.</p>
      ) : groupKey === 'rank_match' ? (
        <RankMatchTable rooms={rooms} />
      ) : (
        <PlayerMatchTable rooms={rooms} />
      )}
    </div>
  )
}
