import { Fragment } from 'react'
import { TIER_STYLES } from '@/shared/tierColors'
import type { Room } from '@/types'
import RankImage from './RankImage'

const IconGamepad = (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="11" x2="10" y2="11"/><line x1="8" y1="9" x2="8" y2="13"/><line x1="15" y1="12" x2="15.01" y2="12"/><line x1="18" y1="10" x2="18.01" y2="10"/>
    <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/>
  </svg>
)

const IconSearch = (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

interface RankMatchTableProps {
  rooms: Room[]
}

export default function RankMatchTable({ rooms }: RankMatchTableProps) {
  const sorted = [...rooms].sort((a, b) => (a.rank_info?.id ?? 0) - (b.rank_info?.id ?? 0)).reverse()
  const tierGroups: [string, Room[]][] = []
  const seen = new Map<string, Room[]>()
  for (const r of sorted) {
    const tier = r.rank_info?.tier ?? '—'
    if (!seen.has(tier)) { seen.set(tier, []); tierGroups.push([tier, seen.get(tier)!]) }
    seen.get(tier)!.push(r)
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="border-collapse w-full min-w-85">
        <thead>
          <tr>
            <th className="tbl-th w-4/20 ">Rank</th>
            <th className="tbl-th w-2/20 text-center">Status</th>
            <th className="tbl-th w-6/20">User 1</th>
            <th className="tbl-th w-6/20">User 2</th>
          </tr>
        </thead>
        <tbody>
          {tierGroups.map(([tier, tierRooms]) => (
            <Fragment key={tier}>
              <tr className="tier-separator">
                <td colSpan={4} className="tier-heading py-2 px-1" style={TIER_STYLES[tier]}>{tier}</td>
              </tr>
              {tierRooms.map((r) => {
                const inGame = r.users?.length === 2
                return (
                <tr key={r.room_id} className="tbl-row">
                  <td className="tbl-td flex justify-center">
                    <RankImage rankInfo={r.rank_info} className="h-9 w-auto" />
                  </td>
                  <td className="tbl-td">
                    <span className={`flex items-center justify-center ${inGame ? 'text-green-400' : 'text-yellow-400'}`} title={inGame ? '게임 중' : '찾는 중'} aria-label={inGame ? '게임 중' : '찾는 중'}>
                      {inGame ? IconGamepad : IconSearch}
                    </span>
                  </td>
                  <td className="player-name">{r.users?.[0]?.online_name}</td>
                  <td className="player-name">{r.users?.[1]?.online_name ?? '—'}</td>
                </tr>
              )})}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
