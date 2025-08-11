import { useState, useEffect, useRef } from "react";
import { waitForCharacterStoreSave } from "@/hooks/useCharacterStore";

interface UseAutoSaveReturn {
  isSaving: boolean;
  lastSaved: Date | null;
}

export const useAutoSave = <T>(
  data: T,
  delay = 600000 // 10 minutes default
): UseAutoSaveReturn => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const innerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (innerTimeoutRef.current) {
      clearTimeout(innerTimeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;

      setIsSaving(true);
      innerTimeoutRef.current = setTimeout(async () => {
        if (!isMountedRef.current) return;
        await waitForCharacterStoreSave();
        if (!isMountedRef.current) return;
        setIsSaving(false);
        setLastSaved(new Date());
      }, 500);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (innerTimeoutRef.current) {
        clearTimeout(innerTimeoutRef.current);
      }
    };
  }, [data, delay]);

  return { isSaving, lastSaved };
};
