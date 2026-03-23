import { useState } from 'react'
import { relativeTime } from '@/shared/timeFormat'
import type { CommentOut } from '@/types'

interface CommentTreeProps {
  comments: CommentOut[]
  onReply: (parentId: number, body: string) => Promise<void>
  depth?: number
}

interface CommentNodeProps {
  comment: CommentOut
  onReply: (parentId: number, body: string) => Promise<void>
  depth: number
}

function CommentNode({ comment, onReply, depth }: CommentNodeProps) {
  const [replying, setReplying] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return
    setSubmitting(true)
    try {
      await onReply(comment.id, replyText.trim())
      setReplyText('')
      setReplying(false)
    } finally {
      setSubmitting(false)
    }
  }

  const visualDepth = Math.min(depth, 3)

  return (
    <div style={{ marginLeft: visualDepth > 0 ? 20 : 0 }} className="border-l border-border-light pl-3 py-2">
      <div className="flex items-center gap-2 text-[0.8rem] text-txt-dim mb-1">
        <span className="font-bold text-primary">{comment.author}</span>
        <span>{relativeTime(comment.created_at)}</span>
      </div>
      <p className="m-0 text-[0.9rem] text-txt whitespace-pre-wrap break-words">{comment.body}</p>
      <button
        onClick={() => setReplying(!replying)}
        className="mt-1 bg-transparent border-0 text-txt-dim text-[0.75rem] font-bold uppercase tracking-wider cursor-pointer hover:text-primary"
      >
        {replying ? 'Cancel' : 'Reply'}
      </button>

      {replying && (
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Reply..."
            className="flex-1 bg-bg-row border border-border-light rounded px-2 py-1 text-[0.85rem] text-txt font-sans outline-none focus:border-primary"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmitReply()}
          />
          <button
            onClick={handleSubmitReply}
            disabled={submitting || !replyText.trim()}
            className="px-3 py-1 bg-primary text-white text-[0.8rem] font-bold border-0 rounded cursor-pointer disabled:opacity-50"
          >
            {submitting ? '...' : 'Send'}
          </button>
        </div>
      )}

      {comment.replies?.length > 0 && (
        <CommentTree comments={comment.replies} onReply={onReply} depth={depth + 1} />
      )}
    </div>
  )
}

export default function CommentTree({ comments, onReply, depth = 0 }: CommentTreeProps) {
  return (
    <div>
      {comments.map((c) => (
        <CommentNode key={c.id} comment={c} onReply={onReply} depth={depth} />
      ))}
    </div>
  )
}
