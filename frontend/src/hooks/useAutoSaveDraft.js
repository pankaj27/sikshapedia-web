import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Custom hook for auto-saving form data to localStorage
 */
const useAutoSaveDraft = (key, formData, setFormData, interval = 10000, enabled = true) => {
  const [lastSaved, setLastSaved] = useState(null);
  const [hasDraft, setHasDraft] = useState(false);
  const timerRef = useRef(null);
  const isInitialMount = useRef(true);
  const formDataRef = useRef(formData);
  const isRestoringRef = useRef(false);

  // Keep formDataRef updated
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Save draft to localStorage
  const saveDraft = useCallback(() => {
    if (!enabled || isRestoringRef.current) return;
    
    try {
      const draftData = {
        formData: formDataRef.current,
        savedAt: new Date().toISOString(),
        version: 1
      };
      localStorage.setItem(key, JSON.stringify(draftData));
      setLastSaved(new Date());
      console.log(`[AutoSave] Draft saved for ${key}`);
    } catch (error) {
      console.error('[AutoSave] Error saving draft:', error);
    }
  }, [key, enabled]);

  // Clear draft from localStorage
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setHasDraft(false);
      setLastSaved(null);
      console.log(`[AutoSave] Draft cleared for ${key}`);
    } catch (error) {
      console.error('[AutoSave] Error clearing draft:', error);
    }
  }, [key]);

  // Get draft info
  const getDraftInfo = useCallback(() => {
    try {
      const savedDraft = localStorage.getItem(key);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.savedAt) {
          return { savedAt: new Date(parsed.savedAt) };
        }
      }
    } catch (error) {
      console.error('[AutoSave] Error getting draft info:', error);
    }
    return null;
  }, [key]);

  // Restore draft data
  const restoreDraft = useCallback(() => {
    try {
      const savedDraft = localStorage.getItem(key);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.formData) {
          isRestoringRef.current = true;
          setFormData(parsed.formData);
          setLastSaved(new Date(parsed.savedAt));
          // Reset restoring flag after a short delay
          setTimeout(() => {
            isRestoringRef.current = false;
          }, 1000);
          console.log(`[AutoSave] Draft restored for ${key}`);
          return true;
        }
      }
    } catch (error) {
      console.error('[AutoSave] Error restoring draft:', error);
    }
    return false;
  }, [key, setFormData]);

  // Check for existing draft on mount (only once)
  useEffect(() => {
    if (enabled) {
      try {
        const savedDraft = localStorage.getItem(key);
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          if (parsed.formData && parsed.savedAt) {
            setHasDraft(true);
          }
        }
      } catch (error) {
        console.error('[AutoSave] Error checking draft:', error);
      }
    }
  }, [enabled, key]);

  // Auto-save effect with timer
  useEffect(() => {
    if (!enabled) return;

    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Skip if currently restoring
    if (isRestoringRef.current) return;

    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new timer
    timerRef.current = setTimeout(() => {
      saveDraft();
    }, interval);

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [formData, interval, enabled, saveDraft]);

  // Save draft on page unload/close
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = () => {
      if (isRestoringRef.current) return;
      try {
        const draftData = {
          formData: formDataRef.current,
          savedAt: new Date().toISOString(),
          version: 1
        };
        localStorage.setItem(key, JSON.stringify(draftData));
      } catch (error) {
        console.error('[AutoSave] Error saving draft on unload:', error);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled, key]);

  return {
    saveDraft,
    clearDraft,
    restoreDraft,
    getDraftInfo,
    lastSaved,
    hasDraft
  };
};

export default useAutoSaveDraft;
