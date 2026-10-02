import { useState, useEffect, useCallback } from "react";

/**
 * A short-lived status message ("Book added successfully.") that
 * clears itself. The timer is cleaned up if the component unmounts.
 */
export default function useFlash(duration = 3000) {
  const [flash, setFlash] = useState(null); // { text, type }

  useEffect(() => {
    if (!flash) return undefined;
    const timer = setTimeout(() => setFlash(null), duration);
    return () => clearTimeout(timer);
  }, [flash, duration]);

  const show = useCallback((text, type = "success") => setFlash({ text, type }), []);
  return [flash, show];
}
