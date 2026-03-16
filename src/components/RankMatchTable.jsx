import { Fragment } from 'react'

export default function RankMatchTable({ rooms }) {
  const sorted = [...rooms].sort((a, b) => (a.rank_info?.id ?? 0) - (b.rank_info?.id ?? 0)).reverse()
  const tierGroups = []
  const seen = new Map()
  for (const r of sorted) {
    const tier = r.rank_info?.tier ?? '—'
    if (!seen.has(tier)) { seen.set(tier, []); tierGroups.push([tier, seen.get(tier)]) }
    seen.get(tier).push(r)
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="border-collapse w-full min-w-[340px]">
        <thead>
          <tr>
            <th className="tbl-th">Rank</th>
            <th className="tbl-th w-3/20">Status</th>
            <th className="tbl-th">User 1</th>
            <th className="tbl-th">User 2</th>
          </tr>
        </thead>
        <tbody>
          {tierGroups.map(([tier, tierRooms]) => (
            <Fragment key={tier}>
              <tr className="tier-separator">
                <td colSpan={4} className="tier-heading py-2">{tier}</td>
              </tr>
              {tierRooms.map((r) => (
                <tr key={r.room_id} className="tbl-row">
                  <td className="tbl-td">{r.rank_info?.name}</td>
                  <td className={`tbl-td ${r.users?.length === 2 ? 'text-primary' : 'text-secondary'}`}>{r.users?.length === 2 ? '게임 중' : '찾는 중'}</td>
                  <td className="player-name">{r.users?.[0]?.online_name}</td>
                  <td className="player-name">{r.users?.[1]?.online_name ?? '—'}</td>
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
