import { charImageUrl } from '../characterImage'
import { panelStatus } from '../panelStatus'

function CharCell({ name, rank }) {
  if (!name) return <td className="char-td">—</td>
  const url = charImageUrl(name)
  return (
    <td className="char-td">
      <span className="inline-flex flex-col items-center gap-1">
        {rank && <span className="char-rank">{rank}</span>}
        {url && <img src={url} alt={name} className="w-8 h-8 object-contain shrink-0" />}
      </span>
    </td>
  )
}

const RANK_COLORS = { 1: 'text-secondary-light', 2: 'text-silver', 3: 'text-bronze' }

export default function Leaderboard({ data, loading, error }) {
  const s = panelStatus(loading, error, 'Loading leaderboard...')
  if (s) return s
  if (!data) return null

  return (
    <div className="panel">
      <p className="panel-meta">Total records: {data.total_records}</p>
      <div className="w-full overflow-x-auto">
        <table className="border-collapse w-full min-w-[340px]">
          <thead>
            <tr>
              <th className="tbl-th w-[44px]">#</th>
              <th className="tbl-th">Player</th>
              <th className="tbl-th">Main</th>
              <th className="tbl-th">Sub</th>
            </tr>
          </thead>
          <tbody>
            {data.entries.map((e) => (
              <tr key={e.np_id} className="tbl-row">
                <td className={`tbl-td font-display text-[0.78rem] font-bold w-[44px] ${RANK_COLORS[e.rank] ?? ''}`}>
                  {e.rank}
                </td>
                <td className="player-name">{e.online_name}</td>
                <CharCell name={e.player_info?.main_char_info?.name} rank={e.player_info?.main_char_info?.rank_info?.name} />
                <CharCell name={e.player_info?.sub_char_info?.name} rank={e.player_info?.sub_char_info?.rank_info?.name} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
