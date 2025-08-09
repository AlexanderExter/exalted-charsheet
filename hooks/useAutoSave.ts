import { useState, useEffect, useRef } from "react"

interface UseAutoSaveReturn {
  isSaving: boolean
  lastSaved: Date | null
}

export const useAutoSave = <T,>(
  data: T,
  key: string,
  delay = 600000 // 10 minutes default
): UseAutoSaveReturn => {
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setIsSaving(true)
      localStorage.setItem(key, JSON.stringify(data))
      setIsSaving(false)
      setLastSaved(new Date())
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, key, delay])

  return { isSaving, lastSaved }
}
