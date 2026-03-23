import { relativeTime } from '@/shared/timeFormat'
import { CHARACTER_NAMES, CHARACTER_GRID, charImageUrl } from '@/shared/characterImage'
import type { PostSummary } from '@/types'

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
      <div className="flex items-center gap-2 mb-3">
        {['all', '자유', '랭매구인'].map((t) => {
          const active = (t === 'all' && !postType) || postType === t
          return (
            <button
              key={t}
              onClick={() => onPostTypeChange(t === 'all' ? '' : t)}
              className={`px-3 py-1 text-[0.78rem] font-bold uppercase tracking-wider border rounded cursor-pointer transition-colors ${
                active ? 'bg-primary text-white border-primary' : 'bg-transparent text-txt-dim border-border-light hover:text-txt'
              }`}
            >
              {t === 'all' ? '전체' : t}
            </button>
          )
        })}
        <button
          onClick={onWrite}
          className="ml-auto px-3 py-1 bg-secondary text-bg-deep text-[0.8rem] font-bold uppercase tracking-wider border-0 rounded cursor-pointer hover:bg-secondary-light"
        >
          글쓰기
        </button>
      </div>

      <div className="mb-4">
        {CHARACTER_GRID.map((row, ri) => (
          <div key={ri} className="flex gap-0.5 mb-0.5">
            {row.map((name) => {
              const active = postType === name
              const url = charImageUrl(name)
              return (
                <button
                  key={name}
                  onClick={() => onPostTypeChange(active ? '' : name)}
                  className={`w-1/23 h-9 p-0 border rounded cursor-pointer transition-all ${
                    url && active ? 'border-primary shadow-[0_0_6px_var(--color-primary-glow)]' : 'border-transparent hover:border-primary-dim'
                  } ${url && 'disabled'}`}
                  title={name}
                >
                  {url && <img src={url} alt={name} className={`h-full object-cover rounded block ${active ? '' : 'opacity-60 hover:opacity-100'}`} />}
                </button>
              )
            })}
          </div>
        ))}
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
              className="w-full text-left bg-bg-row border border-border rounded px-3 py-2 cursor-pointer transition-colors hover:bg-[rgba(0,200,212,0.07)] hover:border-primary-dim flex items-center gap-2"
            >
              <span className="w-14 shrink-0 flex items-center justify-center">
                {charImageUrl(post.post_type) ? (
                  <img src={charImageUrl(post.post_type)!} alt={post.post_type} className="h-5 w-5 object-cover rounded" title={post.post_type} />
                ) : (
                  <span className="text-[0.7rem] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-primary-dim text-primary rounded truncate max-w-full text-center">
                    {post.post_type}
                  </span>
                )}
              </span>
              <span className="flex-1 min-w-0 text-[0.9rem] text-white font-bold truncate">
                {post.title}
              </span>
              <span className="text-[0.78rem] font-bold text-primary shrink-0">{post.author}</span>
              <span className="flex gap-2 text-[0.75rem] text-txt-dim shrink-0">
                <span>&#9650; {post.thumbs_up}</span>
                <span>&#9660; {post.thumbs_down}</span>
                <span>&#128172; {post.comment_count}</span>
              </span>
              <span className="text-[0.75rem] text-txt-dim shrink-0">{relativeTime(post.created_at)}</span>
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
