import { relativeTime } from '@/shared/timeFormat'
import type { PostSummary } from '@/types'

const POST_TYPE_FILTERS = ['all', 'free', 'info', 'question', 'media'] as const

interface PostListProps {
  posts: PostSummary[]
  total: number
  page: number
  pageSize: number
  loading: boolean
  error: string | null
  postType: string
  onPostTypeChange: (type: string) => void
  onPageChange: (page: number) => void
  onSelectPost: (id: number) => void
  onWrite: () => void
}

export default function PostList({
  posts, total, page, pageSize, loading, error,
  postType, onPostTypeChange, onPageChange, onSelectPost, onWrite,
}: PostListProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className="p-4">
      <div className="flex items-center flex-wrap gap-2 mb-4">
        <div className="flex gap-1">
          {POST_TYPE_FILTERS.map((t) => (
            <button
              key={t}
              onClick={() => onPostTypeChange(t === 'all' ? '' : t)}
              className={`px-3 py-1 text-[0.78rem] font-bold uppercase tracking-wider border rounded cursor-pointer transition-colors ${
                (t === 'all' && !postType) || postType === t
                  ? 'bg-primary text-white border-primary'
                  : 'bg-transparent text-txt-dim border-border-light hover:text-txt'
              }`}
            >
              {t === 'all' ? '전체' : t}
            </button>
          ))}
        </div>
        <button
          onClick={onWrite}
          className="ml-auto px-3 py-1 bg-secondary text-bg-deep text-[0.8rem] font-bold uppercase tracking-wider border-0 rounded cursor-pointer hover:bg-secondary-light"
        >
          글쓰기
        </button>
      </div>

      {loading && <p className="state-msg">Loading...</p>}
      {error && <p className="state-msg error">{error}</p>}

      {!loading && !error && posts.length === 0 && (
        <p className="state-msg">No posts yet</p>
      )}

      {!loading && posts.length > 0 && (
        <div className="flex flex-col gap-1">
          {posts.map((post) => (
            <button
              key={post.id}
              onClick={() => onSelectPost(post.id)}
              className="w-full text-left bg-bg-row border border-border rounded p-3 cursor-pointer transition-colors hover:bg-[rgba(0,200,212,0.07)] hover:border-primary-dim"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[0.7rem] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-primary-dim text-primary rounded">
                  {post.post_type}
                </span>
                <span className="text-[0.78rem] font-bold text-primary">{post.author}</span>
                <span className="text-[0.75rem] text-txt-dim">{relativeTime(post.created_at)}</span>
              </div>
              <p className="m-0 text-[0.9rem] text-txt overflow-hidden text-ellipsis whitespace-nowrap">
                {post.body}
              </p>
              <div className="flex gap-3 mt-1.5 text-[0.75rem] text-txt-dim">
                <span>&#9650; {post.thumbs_up}</span>
                <span>&#9660; {post.thumbs_down}</span>
                <span>&#128172; {post.comment_count}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-4">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1 bg-transparent border border-border-light text-txt-dim text-[0.8rem] font-bold rounded cursor-pointer disabled:opacity-30 hover:text-txt"
          >
            Prev
          </button>
          <span className="text-[0.8rem] text-txt-dim">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1 bg-transparent border border-border-light text-txt-dim text-[0.8rem] font-bold rounded cursor-pointer disabled:opacity-30 hover:text-txt"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
