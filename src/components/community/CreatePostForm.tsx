import { useState } from 'react'
import { CHARACTER_GRID, charImageUrl } from '@/shared/characterImage'

interface CreatePostFormProps {
  onSubmit: (title: string, body: string, postType: string) => Promise<void>
  onCancel: () => void
}

export default function CreatePostForm({ onSubmit, onCancel }: CreatePostFormProps) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [postType, setPostType] = useState('자유')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim() || body.length > 1000) return
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit(title.trim(), body.trim(), postType)
    } catch (e: any) {
      setError(e.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="p-4">
      <h3 className="m-0 mb-3 text-secondary font-bold text-[1rem] uppercase tracking-wider">New Post</h3>

      <div className="mb-3 flex gap-2">
        {['자유', '랭매구인'].map((t) => (
          <button
            key={t}
            onClick={() => setPostType(t)}
            className={`px-3 py-1 text-[0.8rem] font-bold uppercase tracking-wider border rounded cursor-pointer transition-colors ${
              postType === t ? 'bg-primary text-white border-primary' : 'bg-transparent text-txt-dim border-border-light hover:text-txt'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mb-3">
        {CHARACTER_GRID.map((row, ri) => (
          <div key={ri} className="flex gap-0.5 mb-0.5">
            {row.map((name) => {
              const active = postType === name
              const url = charImageUrl(name)
              return (
                  <button
                      key={name}
                      onClick={() => setPostType(active ? '자유' : name)}
                      className={`w-1/23 h-9 p-0 border rounded cursor-pointer transition-all ${
                          active ? 'border-primary shadow-[0_0_6px_var(--color-primary-glow)]' : 'border-transparent hover:border-primary-dim'
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

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full bg-bg-row border border-border-light rounded px-3 py-2 mb-3 text-[0.9rem] text-txt font-sans outline-none focus:border-primary"
      />

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your post... (max 1000 characters)"
        rows={6}
        className="w-full bg-bg-row border border-border-light rounded p-3 text-[0.9rem] text-txt font-sans resize-vertical outline-none focus:border-primary"
      />
      <div className="text-right text-[0.75rem] text-txt-dim mt-1">{body.length}/1000</div>

      {error && <p className="text-error text-[0.85rem] mt-1 mb-0">{error}</p>}

      <div className="flex justify-end gap-2 mt-3">
        <button
          onClick={onCancel}
          className="px-4 py-1.5 bg-transparent border border-border-light text-txt-dim font-bold text-[0.85rem] uppercase tracking-wider rounded cursor-pointer hover:text-txt"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting || !title.trim() || !body.trim() || body.length > 1000}
          className="px-4 py-1.5 bg-primary text-white font-bold text-[0.85rem] uppercase tracking-wider border-0 rounded cursor-pointer disabled:opacity-50"
        >
          {submitting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  )
}
