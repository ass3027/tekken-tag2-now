import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import RankMatchTable from '../components/RankMatchTable'

describe('RankMatchTable', () => {
  it('renders grouped by tier with User 1 / User 2 columns', () => {
    const rooms = [
      {
        room_id: 3381,
        owner_online_name: 'Longuring',
        rank_info: { name: '1st 나무단', tier: '나무단' },
        users: [
          { online_name: 'Longuring', user_id: 'Longuring' },
          { online_name: 'DuelMan', user_id: 'DuelMan' },
        ],
      },
    ]
    render(<RankMatchTable rooms={rooms} />)

    expect(screen.getByText('나무단')).toBeInTheDocument()
    expect(screen.getByText('Rank')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('User 1')).toBeInTheDocument()
    expect(screen.getByText('User 2')).toBeInTheDocument()

    expect(screen.getByText('1st 나무단')).toBeInTheDocument()
    expect(screen.getByText('게임 중')).toBeInTheDocument()
    expect(screen.getByText('Longuring')).toBeInTheDocument()
    expect(screen.getByText('DuelMan')).toBeInTheDocument()
  })

  it('shows — when room has only one user', () => {
    const rooms = [
      {
        room_id: 3382,
        owner_online_name: 'SoloPlayer',
        rank_info: { name: '2nd 나무단', tier: '나무단' },
        users: [{ online_name: 'SoloPlayer', user_id: 'SoloPlayer' }],
      },
    ]
    render(<RankMatchTable rooms={rooms} />)

    expect(screen.getByText('찾는 중')).toBeInTheDocument()
    expect(screen.getByText('SoloPlayer')).toBeInTheDocument()
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('sorts rooms by rank_info.id and groups by tier', () => {
    const rooms = [
      {
        room_id: 1,
        rank_info: { id: 20, name: '2nd 돌단', tier: '돌단' },
        users: [{ online_name: 'C' }, { online_name: 'D' }],
      },
      {
        room_id: 2,
        rank_info: { id: 5, name: '1st 나무단', tier: '나무단' },
        users: [{ online_name: 'A' }, { online_name: 'B' }],
      },
      {
        room_id: 3,
        rank_info: { id: 10, name: '2nd 나무단', tier: '나무단' },
        users: [{ online_name: 'E' }, { online_name: 'F' }],
      },
    ]
    render(<RankMatchTable rooms={rooms} />)

    const separators = document.querySelectorAll('.tier-separator')
    expect(separators).toHaveLength(2)
    expect(separators[0]).toHaveTextContent('돌단')
    expect(separators[1]).toHaveTextContent('나무단')

    const tables = document.querySelectorAll('table')
    expect(tables).toHaveLength(1)
    expect(tables[0].querySelectorAll('tbody tr.tbl-row')).toHaveLength(3)
  })
})
