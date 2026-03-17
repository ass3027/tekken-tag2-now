import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Leaderboard from '../components/Leaderboard'

describe('Leaderboard', () => {
  it('shows loading message when loading=true', () => {
    render(<Leaderboard loading={true} data={null} error={null} />)
    expect(screen.getByText('Loading leaderboard...')).toBeInTheDocument()
  })

  it('shows error message when error is provided', () => {
    render(<Leaderboard loading={false} data={null} error="Network failure" />)
    expect(screen.getByText('Error: Network failure')).toBeInTheDocument()
  })

  it('renders nothing when data is null and not loading', () => {
    const { container } = render(<Leaderboard loading={false} data={null} error={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders total_records and table headers when data is provided', () => {
    const data = {
      total_records: 42,
      entries: [],
    }
    render(<Leaderboard loading={false} data={data} error={null} />)

    expect(screen.getByText('Total records: 42')).toBeInTheDocument()
    expect(screen.getByText('#')).toBeInTheDocument()
    expect(screen.getByText('Player')).toBeInTheDocument()
expect(screen.getByText('Main')).toBeInTheDocument()
    expect(screen.getByText('Sub')).toBeInTheDocument()
  })

  it('renders each entry row with rank, name, chars', () => {
    const data = {
      total_records: 1,
      entries: [
        {
          np_id: 'player1',
          rank: 1,
          online_name: 'KazuyaFan',
          score: 9999,
          player_info: {
            main_char_info: { name: 'Kazuya', rank_info: { name: 'Destroyer' } },
            sub_char_info: { name: 'Devil', rank_info: { name: 'Vanquisher' } },
          },
        },
      ],
    }
    render(<Leaderboard loading={false} data={data} error={null} />)

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('KazuyaFan')).toBeInTheDocument()
    expect(screen.getByAltText('Kazuya')).toBeInTheDocument()
    expect(screen.getByText('Destroyer')).toBeInTheDocument()
    expect(screen.getByText('Vanquisher')).toBeInTheDocument()
  })

  it('shows em-dash when player_info is missing', () => {
    const data = {
      total_records: 1,
      entries: [
        {
          np_id: 'player2',
          rank: 2,
          online_name: 'NoInfo',
          score: 100,
          player_info: null,
        },
      ],
    }
    render(<Leaderboard loading={false} data={data} error={null} />)

    // Both main and sub should show the em-dash fallback
    const dashes = screen.getAllByText('—')
    expect(dashes).toHaveLength(2)
  })

  it('shows em-dash when char info is missing from player_info', () => {
    const data = {
      total_records: 1,
      entries: [
        {
          np_id: 'player3',
          rank: 3,
          online_name: 'NoChars',
          score: 50,
          player_info: {
            main_char_info: null,
            sub_char_info: null,
          },
        },
      ],
    }
    render(<Leaderboard loading={false} data={data} error={null} />)

    const dashes = screen.getAllByText('—')
    expect(dashes).toHaveLength(2)
  })

  it('shows loading bar when refreshing=true', () => {
    const data = { total_records: 0, entries: [] }
    const { container } = render(<Leaderboard loading={false} refreshing={true} data={data} error={null} />)
    const bar = container.querySelector('.loading-bar')
    expect(bar).toBeInTheDocument()
    expect(bar).not.toHaveClass('loading-bar-hidden')
  })

  it('hides loading bar when refreshing=false', () => {
    const data = { total_records: 0, entries: [] }
    const { container } = render(<Leaderboard loading={false} refreshing={false} data={data} error={null} />)
    expect(container.querySelector('.loading-bar')).toHaveClass('loading-bar-hidden')
  })
})
