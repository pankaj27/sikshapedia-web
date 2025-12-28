import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Custom hook for auto-saving form data to localStorage
 * @param {string} key - Unique key for localStorage (e.g., 'college_draft', 'course_draft')
 * @param {object} formData - The form data to save
 * @param {function} setFormData - Function to update form data
 * @param {number} interval - Auto-save interval in milliseconds (default: 30000 = 30 seconds)
 * @param {boolean} enabled - Whether auto-save is enabled (disable when editing existing entry)
 */
const useAutoSaveDraft = (key, formData, setFormData, interval = 30000, enabled = true) => {
  const [lastSaved, setLastSaved] = useState(null);
  const [hasDraft, setHasDraft] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const timerRef = useRef(null);
  const isInitialMount = useRef(true);

  // Save draft to localStorage
  const saveDraft = useCallback(() => {
    if (!enabled) return;
    
    try {
      const draftData = {
        formData,
        savedAt: new Date().toISOString(),
        version: 1
      };
      localStorage.setItem(key, JSON.stringify(draftData));
      setLastSaved(new Date());
      console.log(`[AutoSave] Draft saved for ${key}`);
    } catch (error) {
      console.error('[AutoSave] Error saving draft:', error);
    }
  }, [key, formData, enabled]);

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

  // Check if draft exists on mount
  const checkForDraft = useCallback(() => {
    try {
      const savedDraft = localStorage.getItem(key);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.formData && parsed.savedAt) {
          setHasDraft(true);
          return parsed;
        }
      }
    } catch (error) {
      console.error('[AutoSave] Error checking draft:', error);
    }
    return null;
  }, [key]);

  // Restore draft data
  const restoreDraft = useCallback(() => {
    const draft = checkForDraft();
    if (draft && draft.formData) {
      setFormData(draft.formData);
      setDraftRestored(true);
      setLastSaved(new Date(draft.savedAt));
      console.log(`[AutoSave] Draft restored for ${key}`);
      return true;
    }
    return false;
  }, [key, setFormData, checkForDraft]);

  // Get draft info without restoring
  const getDraftInfo = useCallback(() => {
    const draft = checkForDraft();
    if (draft) {
      return {
        savedAt: new Date(draft.savedAt),
        timeAgo: getTimeAgo(new Date(draft.savedAt))
      };
    }
    return null;
  }, [checkForDraft]);

  // Auto-save effect
  useEffect(() => {
    if (!enabled) return;

    // Skip auto-save on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

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

  // Check for existing draft on mount
  useEffect(() => {
    if (enabled) {
      const draft = checkForDraft();
      setHasDraft(!!draft);
    }
  }, [enabled, checkForDraft]);

  return {
    saveDraft,
    clearDraft,
    restoreDraft,
    getDraftInfo,
    lastSaved,
    hasDraft,
    draftRestored
  };
};

// Helper function to format time ago
const getTimeAgo = (date) => {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // seconds

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};

export default useAutoSaveDraft;
