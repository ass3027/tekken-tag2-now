import { useState } from 'react'
import { APP_VERSION } from '@/version'

const LS_KEY = 'ttt2-patch-dismissed'

const NOTES: { version: string; items: string[] }[] = [
  {
    version: '1.0.6',
    items: [
      '커뮤니티 게시판 추가 (글쓰기, 댓글, 추천/비추천, 현재는 단순 텍스트만 가능)',
    ],
  },
  {
    version: '1.0.5',
    items: [
      '랭크 이미지 추가',
    ],
  },
  {
    version: '1.0.4',
    items: [
      '상단바에 유저 설정 가능, 설정 시 해당 유저 계급 표시',
    ],
  }
]

export default function PatchNotes() {
  const [visible, setVisible] = useState(() => {
    return localStorage.getItem(LS_KEY) !== APP_VERSION
  })

  if (!visible) return null

  function close() {
    setVisible(false)
  }

  function dismiss() {
    localStorage.setItem(LS_KEY, APP_VERSION)
    setVisible(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={close}>
      <div
        className="relative bg-bg-panel border border-border-light rounded-lg max-w-md w-[90%] p-6 shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute top-3 right-3 bg-transparent border-none text-txt-dim hover:text-txt text-4xl cursor-pointer leading-none p-2"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="font-display text-lg font-bold text-secondary m-0 mb-4 tracking-wide uppercase">
          Patch Notes
        </h2>

        {NOTES.map(note => (
          <div key={note.version} className="mb-4">
            <h3 className="text-primary font-bold text-sm tracking-wider uppercase m-0 mb-2">
              v{note.version}
            </h3>
            <ul className="list-disc pl-5 m-0 space-y-1">
              {note.items.map((item, i) => (
                <li key={i} className="text-txt text-sm">{item}</li>
              ))}
            </ul>
          </div>
        ))}

        <button
          onClick={dismiss}
          className="mt-2 w-full py-2 bg-transparent border border-primary-dim text-primary font-sans text-sm font-bold tracking-wider uppercase cursor-pointer transition-all duration-150 hover:bg-primary-glow hover:border-primary hover:text-white rounded"
        >
          다시 보지 않기
        </button>
      </div>
    </div>
  )
}
