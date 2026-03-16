import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PlayerMatchTable from '../components/PlayerMatchTable'

describe('PlayerMatchTable', () => {
  it('renders room separator with owner name and user count', () => {
    const rooms = [
      {
        room_id: 1,
        owner_online_name: 'Alice',
        rank_info: null,
        users: [
          { online_name: 'Alice', user_id: 'Alice' },
          { online_name: 'Bob', user_id: 'Bob' },
        ],
      },
    ]
    render(<PlayerMatchTable rooms={rooms} />)

    expect(screen.getByText('#')).toBeInTheDocument()
    expect(screen.getByText('User')).toBeInTheDocument()
    expect(screen.getByText('Alice (2)')).toBeInTheDocument()
  })

  it('renders each user as a separate row', () => {
    const rooms = [
      {
        room_id: 1,
        owner_online_name: 'Host',
        rank_info: null,
        users: [
          { online_name: 'Player1', user_id: 'p1' },
          { online_name: 'Player2', user_id: 'p2' },
          { online_name: 'Player3', user_id: 'p3' },
        ],
      },
    ]
    render(<PlayerMatchTable rooms={rooms} />)

    expect(screen.getByText('Player1')).toBeInTheDocument()
    expect(screen.getByText('Player2')).toBeInTheDocument()
    expect(screen.getByText('Player3')).toBeInTheDocument()
  })

  it('renders multiple rooms with their users', () => {
    const rooms = [
      {
        room_id: 1,
        owner_online_name: 'Room1Owner',
        rank_info: null,
        users: [{ online_name: 'UserA', user_id: 'a' }],
      },
      {
        room_id: 2,
        owner_online_name: 'Room2Owner',
        rank_info: null,
        users: [
          { online_name: 'UserB', user_id: 'b' },
          { online_name: 'UserC', user_id: 'c' },
        ],
      },
    ]
    render(<PlayerMatchTable rooms={rooms} />)

    expect(screen.getByText('Room1Owner (1)')).toBeInTheDocument()
    expect(screen.getByText('Room2Owner (2)')).toBeInTheDocument()
    expect(screen.getByText('UserA')).toBeInTheDocument()
    expect(screen.getByText('UserB')).toBeInTheDocument()
    expect(screen.getByText('UserC')).toBeInTheDocument()
  })

  it('handles rooms with no users gracefully', () => {
    const rooms = [
      {
        room_id: 1,
        owner_online_name: 'EmptyRoom',
        rank_info: null,
      },
    ]
    render(<PlayerMatchTable rooms={rooms} />)

    expect(screen.getByText('EmptyRoom (0)')).toBeInTheDocument()
  })
})
