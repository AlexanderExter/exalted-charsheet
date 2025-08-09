import { useState, useEffect, useRef } from "react"

interface UseAutoSaveReturn {
  isSaving: boolean
  lastSaved: Date | null
}

export const useAutoSave = <T,>(
  data: T,
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
      // Persist middleware handles saving; we only update UI indicators
      setIsSaving(true)
      // briefly show the saving state then update the timestamp
      setTimeout(() => {
        setIsSaving(false)
        setLastSaved(new Date())
      }, 500)
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, delay])

  return { isSaving, lastSaved }
}
