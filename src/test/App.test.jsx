import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import App from '../App'

// Mock the api module
vi.mock('../api', () => ({
  fetchLeaderboard: vi.fn(),
  fetchRoomsAll: vi.fn(),
}))

// Import the mocks after vi.mock so we get the mocked versions
import { fetchLeaderboard, fetchRoomsAll } from '../api'

const LEADERBOARD_DATA = {
  total_records: 1,
  entries: [
    {
      np_id: 'p1',
      rank: 1,
      online_name: 'TestPlayer',
      score: 5000,
      player_info: {
        main_char_info: { name: 'Jin', rank_info: { name: 'Destroyer' } },
        sub_char_info: { name: 'Heihachi', rank_info: { name: 'Vanquisher' } },
      },
    },
  ],
}

const ROOMS_DATA = {
  total: 1,
  groups: {
    rank_match: [
      {
        room_id: 'r1',
        owner_online_name: 'RoomOwner',
        rank_info: { name: 'Platinum', tier: 'Platinum' },
        max_slots: 6,
        users: [
          { online_name: 'RoomOwner', user_id: 'RoomOwner' },
          { online_name: 'Challenger', user_id: 'Challenger' },
        ],
      },
    ],
  },
}

async function renderApp() {
  await act(async () => {
    render(<App />)
  })
}

beforeEach(() => {
  fetchLeaderboard.mockResolvedValue(LEADERBOARD_DATA)
  fetchRoomsAll.mockResolvedValue(ROOMS_DATA)
})

afterEach(() => {
  vi.clearAllMocks()
  vi.useRealTimers()
})

describe('App', () => {
  it('calls fetchLeaderboard and fetchRoomsAll on mount', async () => {
    await renderApp()

    expect(fetchLeaderboard).toHaveBeenCalledOnce()
    expect(fetchRoomsAll).toHaveBeenCalledOnce()
  })

  it('default tab is first room group and shows rooms content', async () => {
    await renderApp()

    expect(screen.getByText('랭크매치 (1)')).toBeInTheDocument()
    expect(screen.getByText('RoomOwner')).toBeInTheDocument()
    expect(screen.queryByText('TestPlayer')).not.toBeInTheDocument()
  })

  it('clicking Leaderboard tab switches to leaderboard view', async () => {
    await renderApp()

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Leaderboard' }))
    })

    expect(screen.getByText('TestPlayer')).toBeInTheDocument()
    expect(screen.queryByText('RoomOwner')).not.toBeInTheDocument()
  })

  it('clicking Refresh on room tab calls fetchRoomsAll again', async () => {
    await renderApp()

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Refresh' }))
    })

    // Called once on mount and once on Refresh click
    expect(fetchRoomsAll).toHaveBeenCalledTimes(2)
    expect(fetchLeaderboard).toHaveBeenCalledTimes(1)
  })

  it('clicking Refresh on Leaderboard tab calls fetchLeaderboard again', async () => {
    await renderApp()

    // Switch to Leaderboard tab first
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Leaderboard' }))
    })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Refresh' }))
    })

    expect(fetchLeaderboard).toHaveBeenCalledTimes(2)
    expect(fetchRoomsAll).toHaveBeenCalledTimes(1)
  })

  it('auto-refresh: rooms refresh every 10s, leaderboard every 60s', async () => {
    vi.useFakeTimers()

    await renderApp()

    expect(fetchLeaderboard).toHaveBeenCalledTimes(1)
    expect(fetchRoomsAll).toHaveBeenCalledTimes(1)

    // After 10s: rooms refreshes, leaderboard does not
    await act(async () => {
      vi.advanceTimersByTime(10_000)
    })

    expect(fetchRoomsAll).toHaveBeenCalledTimes(2)
    expect(fetchLeaderboard).toHaveBeenCalledTimes(1)

    // After 60s total: rooms has refreshed 6 times + 1 mount, leaderboard 1 + 1 mount
    await act(async () => {
      vi.advanceTimersByTime(50_000)
    })

    expect(fetchRoomsAll).toHaveBeenCalledTimes(7)
    expect(fetchLeaderboard).toHaveBeenCalledTimes(2)
  })

  it('cleans up interval on unmount', async () => {
    vi.useFakeTimers()
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval')

    let unmount
    await act(async () => {
      const result = render(<App />)
      unmount = result.unmount
    })

    unmount()

    expect(clearIntervalSpy).toHaveBeenCalledTimes(2)
    clearIntervalSpy.mockRestore()
  })

  it('renders app title', async () => {
    await renderApp()

    expect(screen.getByRole('heading', { name: 'Tag 2 Now' })).toBeInTheDocument()
    expect(screen.getByText('Live')).toBeInTheDocument()
  })

  it('shows loading state initially when fetch is slow', async () => {
    // Make fetch never resolve during this test
    fetchLeaderboard.mockReturnValue(new Promise(() => {}))
    fetchRoomsAll.mockReturnValue(new Promise(() => {}))

    render(<App />)

    expect(screen.getByText('Loading rooms...')).toBeInTheDocument()
  })

  it('auto-refresh keeps content visible and shows loading bar instead of loading message', async () => {
    vi.useFakeTimers()

    await renderApp()

    // Data is visible after initial load
    expect(screen.getByText('RoomOwner')).toBeInTheDocument()
    expect(screen.queryByText('Loading rooms...')).not.toBeInTheDocument()

    // Make the next fetch hang so we can observe the refreshing state
    fetchRoomsAll.mockReturnValue(new Promise(() => {}))

    // Trigger auto-refresh
    await act(async () => {
      vi.advanceTimersByTime(10_000)
    })

    // Content should still be visible (not replaced by loading message)
    expect(screen.getByText('RoomOwner')).toBeInTheDocument()
    expect(screen.queryByText('Loading rooms...')).not.toBeInTheDocument()

    // Loading bar should be visible
    const panel = screen.getByText('RoomOwner').closest('.panel')
    const bar = panel.querySelector('.loading-bar')
    expect(bar).toBeInTheDocument()
    expect(bar).not.toHaveClass('loading-bar-hidden')
  })

  it('shows error when fetchLeaderboard rejects', async () => {
    fetchLeaderboard.mockRejectedValue(new Error('Leaderboard fetch failed: 500'))

    await act(async () => {
      render(<App />)
    })

    // Switch to Leaderboard tab to see the error
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Leaderboard' }))
    })

    await waitFor(() => {
      expect(screen.getByText('Error: Leaderboard fetch failed: 500')).toBeInTheDocument()
    })
  })
})
