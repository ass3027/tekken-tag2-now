import { useRef, useCallback } from 'react'
import { setIdentity } from '@/shared/communityApi'

const LS_KEY = 'ttt2-username'

export default function useIdentity() {
  const identitySet = useRef(false)

  const getUsername = useCallback(() => localStorage.getItem(LS_KEY), [])

  const ensureIdentity = useCallback(async () => {
    const name = localStorage.getItem(LS_KEY)
    if (!name) throw new Error('Username not set. Please set your username in the header first.')
    if (!identitySet.current) {
      await setIdentity(name)
      identitySet.current = true
    }
    return name
  }, [])

  return { getUsername, ensureIdentity }
}
