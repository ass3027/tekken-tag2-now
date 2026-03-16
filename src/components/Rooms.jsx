import { panelStatus } from '../panelStatus'

export default function Rooms({ data, loading, error }) {
  const s = panelStatus(loading, error, 'Loading rooms...')
  if (s) return s
  if (!data) return null

  const rooms = data.rooms ?? []

  return (
    <div className="panel">
      <p className="panel-meta">Total rooms: {data.total ?? rooms.length}</p>
      {rooms.length === 0 ? (
        <p className="state-msg">No active rooms.</p>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="border-collapse w-full min-w-[340px]">
            <thead>
              <tr>
                <th className="tbl-th">Room ID</th>
                <th className="tbl-th">Owner</th>
                <th className="tbl-th">Rank</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r.room_id} className="tbl-row">
                  <td className="tbl-td">{r.room_id}</td>
                  <td className="player-name">{r.owner_online_name}</td>
                  <td className="tbl-td">{r.rank_info?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
