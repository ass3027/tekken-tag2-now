import type { CharRankInfo, RoomRankInfo } from '@/types'

interface RankImageProps {
  rankInfo: CharRankInfo | RoomRankInfo | null | undefined
  className?: string
}

export default function RankImage({ rankInfo, className }: RankImageProps) {
  if (!rankInfo?.name) return null
  return (
    <img
      src={`/ranks/${rankInfo.name}.webp`}
      alt={rankInfo.name}
      title={rankInfo.name}
      className={className}
    />
  )
}
