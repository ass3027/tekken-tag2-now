import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Rooms from '../components/Rooms'

describe('Rooms', () => {
  it('shows loading message when loading=true', () => {
    render(<Rooms loading={true} data={null} error={null} />)
    expect(screen.getByText('Loading rooms...')).toBeInTheDocument()
  })

  it('shows error message when error is provided', () => {
    render(<Rooms loading={false} data={null} error="Connection refused" />)
    expect(screen.getByText('Error: Connection refused')).toBeInTheDocument()
  })

  it('renders nothing when data is null and not loading', () => {
    const { container } = render(<Rooms loading={false} data={null} error={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('shows "No active rooms." when rooms array is empty', () => {
    const data = { rooms: [] }
    render(<Rooms loading={false} data={data} error={null} />)
    expect(screen.getByText('No active rooms.')).toBeInTheDocument()
  })

  it('renders PlayerMatchTable when groupKey is not rank_match', () => {
    const data = {
      rooms: [
        {
          room_id: 1,
          owner_online_name: 'Alice',
          rank_info: null,
          users: [{ online_name: 'Alice', user_id: 'Alice' }],
        },
      ],
    }
    render(<Rooms loading={false} data={data} error={null} />)
    expect(screen.getByText('#')).toBeInTheDocument()
    expect(screen.getByText('User')).toBeInTheDocument()
    expect(screen.getByText('Alice (1)')).toBeInTheDocument()
  })

  it('renders RankMatchTable when groupKey is rank_match', () => {
    const data = {
      rooms: [
        {
          room_id: 1,
          rank_info: { name: '1st 나무단', tier: '나무단' },
          users: [{ online_name: 'A' }, { online_name: 'B' }],
        },
      ],
    }
    render(<Rooms loading={false} data={data} error={null} groupKey="rank_match" />)
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('게임 중')).toBeInTheDocument()
  })

  it('falls back to empty array when data.rooms is undefined', () => {
    const data = {}
    render(<Rooms loading={false} data={data} error={null} />)
    expect(screen.getByText('No active rooms.')).toBeInTheDocument()
  })

  it('shows loading bar when refreshing=true', () => {
    const data = { rooms: [] }
    const { container } = render(<Rooms loading={false} refreshing={true} data={data} error={null} />)
    const bar = container.querySelector('.loading-bar')
    expect(bar).toBeInTheDocument()
    expect(bar).not.toHaveClass('loading-bar-hidden')
  })

  it('hides loading bar when refreshing=false', () => {
    const data = { rooms: [] }
    const { container } = render(<Rooms loading={false} refreshing={false} data={data} error={null} />)
    expect(container.querySelector('.loading-bar')).toHaveClass('loading-bar-hidden')
  })
})
