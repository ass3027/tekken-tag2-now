import { charImageUrl } from '../characterImage'
import { panelStatus } from '../panelStatus'

function CharCell({ name }) {
  if (!name) return <td className="char-name">—</td>
  const url = charImageUrl(name)
  return (
    <td className="char-name">
      <span className="char-cell">
        {url && <img src={url} alt={name} className="char-portrait" />}
        {name}
      </span>
    </td>
  )
}

export default function Leaderboard({ data, loading, error }) {
  const s = panelStatus(loading, error, 'Loading leaderboard...')
  if (s) return s
  if (!data) return null

  return (
    <div className="panel">
      <p className="panel-meta">Total records: {data.total_records}</p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th>Score</th>
              <th>Main</th>
              <th>Sub</th>
            </tr>
          </thead>
          <tbody>
            {data.entries.map((e) => (
              <tr key={e.np_id}>
                <td className={`rank-cell${e.rank <= 3 ? ` rank-${e.rank}` : ''}`}>{e.rank}</td>
                <td className="player-name">{e.online_name}</td>
                <td className="score-cell">{e.score}</td>
                <CharCell name={e.player_info?.main_char_info?.name} />
                <CharCell name={e.player_info?.sub_char_info?.name} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
