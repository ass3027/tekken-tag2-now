import { useState } from 'react'
import { relativeTime } from '@/shared/timeFormat'
import { thumbPost, createComment, deletePost } from '@/shared/communityApi'
import CommentTree from './CommentTree'
import type { PostDetail as PostDetailType } from '@/types'

interface PostDetailProps {
  post: PostDetailType
  username: string | null
  onBack: () => void
  onRefresh: () => void
  ensureIdentity: () => Promise<string>
  onDeleted: () => void
}

export default function PostDetail({ post, username, onBack, onRefresh, ensureIdentity, onDeleted }: PostDetailProps) {
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [thumbing, setThumbing] = useState(false)

  const handleThumb = async (direction: 'up' | 'down') => {
    if (thumbing) return
    setThumbing(true)
    try {
      await ensureIdentity()
      await thumbPost(post.id, direction)
      onRefresh()
    } catch (_) {}
    setThumbing(false)
  }

  const handleComment = async () => {
    if (!commentText.trim()) return
    setSubmitting(true)
    try {
      await ensureIdentity()
      await createComment(post.id, commentText.trim())
      setCommentText('')
      onRefresh()
    } catch (_) {}
    setSubmitting(false)
  }

  const handleReply = async (parentId: number, body: string) => {
    await ensureIdentity()
    await createComment(post.id, body, parentId)
    onRefresh()
  }

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return
    try {
      await ensureIdentity()
      await deletePost(post.id)
      onDeleted()
    } catch (_) {}
  }

  return (
    <div className="p-4">
      <button
        onClick={onBack}
        className="mb-4 bg-transparent border-0 text-primary text-[0.85rem] font-bold uppercase tracking-wider cursor-pointer hover:text-white"
      >
        &larr; Back
      </button>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[0.75rem] font-bold uppercase tracking-wider px-2 py-0.5 bg-primary-dim text-primary rounded">
            {post.post_type}
          </span>
          <span className="text-[0.8rem] text-txt-dim">{relativeTime(post.created_at)}</span>
          {username && post.author === username && (
            <button
              onClick={handleDelete}
              className="ml-auto bg-transparent border border-error text-error text-[0.75rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded cursor-pointer hover:bg-error hover:text-white"
            >
              Delete
            </button>
          )}
        </div>
        <p className="text-[0.8rem] font-bold text-primary mb-2">{post.author}</p>
        <p className="m-0 text-[0.95rem] text-txt whitespace-pre-wrap break-words">{post.body}</p>
      </div>

      <div className="flex gap-3 mb-4 pb-4 border-b border-border-light">
        <button
          onClick={() => handleThumb('up')}
          disabled={thumbing}
          className="flex items-center gap-1 bg-transparent border border-border-light text-txt-dim px-3 py-1 rounded cursor-pointer text-[0.85rem] font-bold hover:border-primary hover:text-primary disabled:opacity-50"
        >
          <span>&#9650;</span> {post.thumbs_up}
        </button>
        <button
          onClick={() => handleThumb('down')}
          disabled={thumbing}
          className="flex items-center gap-1 bg-transparent border border-border-light text-txt-dim px-3 py-1 rounded cursor-pointer text-[0.85rem] font-bold hover:border-error hover:text-error disabled:opacity-50"
        >
          <span>&#9660;</span> {post.thumbs_down}
        </button>
      </div>

      <h4 className="m-0 mb-3 text-[0.85rem] font-bold uppercase tracking-wider text-txt-dim">
        Comments ({post.comments.length})
      </h4>

      {post.comments.length > 0 && (
        <CommentTree comments={post.comments} onReply={handleReply} />
      )}

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 bg-bg-row border border-border-light rounded px-3 py-2 text-[0.85rem] text-txt font-sans outline-none focus:border-primary"
          onKeyDown={(e) => e.key === 'Enter' && handleComment()}
        />
        <button
          onClick={handleComment}
          disabled={submitting || !commentText.trim()}
          className="px-4 py-2 bg-primary text-white text-[0.85rem] font-bold border-0 rounded cursor-pointer disabled:opacity-50"
        >
          {submitting ? '...' : 'Send'}
        </button>
      </div>
    </div>
  )
}
