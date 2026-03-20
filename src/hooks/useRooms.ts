import usePolledData from './usePolledData'
import type {RoomsData, PolledState, Room} from '@/types'
import {GET} from "@/shared/api";

const ROOMS_REFRESH_INTERVAL = 10_000

export const fetchRoomsAll =  async () => {
  const data: Record<string, any> = await GET('rooms/all');

  const groups = Object.fromEntries(
      Object.entries(data)
          .filter(([, v]) => Array.isArray(v))
          // shuffle 1p 2p
          .sort(() => Math.random() - 0.5)
  ) as Record<string, Room[]>;

  const { total, totalUsers } = Object.values(groups).reduce(
      (acc, arr) => ({
        total: acc.total + arr.length,
        totalUsers: acc.totalUsers + arr.reduce((s, r) => s + (r.users?.length ?? 0), 0),
      }), { total: 0, totalUsers: 0 }
  )
  return { groups, total, totalUsers }
}

export default function useRooms(): PolledState<RoomsData> {
  return usePolledData(fetchRoomsAll, ROOMS_REFRESH_INTERVAL)
}
