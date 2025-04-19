// src/hooks/useUserId.ts
import { useState, useEffect } from "react";

/**
 * Generates or retrieves a persistent anonymous ID in localStorage.
 * Returns `null` until it’s initialized, then a string UUID.
 */
export function useUserId() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Try to load an existing ID
    let id = localStorage.getItem("rc_user_id");
    if (!id) {
      // If none, make a new one
      id = crypto.randomUUID();
      localStorage.setItem("rc_user_id", id);
    }
    setUserId(id);
  }, []);

  return userId;
}
