import { useCallback, useRef, useState } from 'react'

export function useCopyToast() {
  const [message, setMessage] = useState<string | null>(null)
  const timer = useRef<number | null>(null)

  const copy = useCallback(async (text: string, successLabel: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setMessage(successLabel)
      if (timer.current) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setMessage(null), 2000)
    } catch {
      setMessage('Copy failed')
      if (timer.current) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setMessage(null), 2000)
    }
  }, [])

  return { message, copy }
}
