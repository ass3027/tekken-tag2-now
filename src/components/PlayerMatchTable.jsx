import { Fragment } from 'react'

export default function PlayerMatchTable({ rooms }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="border-collapse w-full min-w-[340px]">
        <thead>
          <tr>
            <th className="tbl-th">#</th>
            <th className="tbl-th">User</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((r) => (
            <Fragment key={r.room_id}>
              <tr className="tier-separator">
                <td colSpan={2} className="tier-heading py-2">
                  {r.owner_online_name} ({r.users?.length ?? 0})
                </td>
              </tr>
              {(r.users ?? []).map((u, i) => (
                <tr key={u.user_id ?? i} className="tbl-row">
                  <td className="tbl-td">{i + 1}</td>
                  <td className="player-name">{u.online_name}</td>
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
