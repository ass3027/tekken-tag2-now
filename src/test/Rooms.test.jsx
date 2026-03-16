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
    const data = { total: 0, rooms: [] }
    render(<Rooms loading={false} data={data} error={null} />)

    expect(screen.getByText('Total rooms: 0')).toBeInTheDocument()
    expect(screen.getByText('No active rooms.')).toBeInTheDocument()
  })

  it('uses rooms.length as total when data.total is absent', () => {
    const data = { rooms: [{ room_id: 'r1', owner_online_name: 'Alice', rank_info: { name: 'Gold' }, max_slots: 4 }] }
    render(<Rooms loading={false} data={data} error={null} />)

    expect(screen.getByText('Total rooms: 1')).toBeInTheDocument()
  })

  it('renders table headers and room rows when rooms exist', () => {
    const data = {
      total: 2,
      rooms: [
        { room_id: 'room-001', owner_online_name: 'Alice', rank_info: { name: 'Gold' }, max_slots: 4 },
        { room_id: 'room-002', owner_online_name: 'Bob', rank_info: { name: 'Silver' }, max_slots: 8 },
      ],
    }
    render(<Rooms loading={false} data={data} error={null} />)

    expect(screen.getByText('Total rooms: 2')).toBeInTheDocument()

    expect(screen.getByText('Room ID')).toBeInTheDocument()
    expect(screen.getByText('Owner')).toBeInTheDocument()
    expect(screen.getByText('Rank')).toBeInTheDocument()

    expect(screen.getByText('room-001')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Gold')).toBeInTheDocument()

    expect(screen.getByText('room-002')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Silver')).toBeInTheDocument()
  })

  it('falls back to empty array when data.rooms is undefined', () => {
    const data = { total: 0 }
    render(<Rooms loading={false} data={data} error={null} />)

    expect(screen.getByText('No active rooms.')).toBeInTheDocument()
  })
})
