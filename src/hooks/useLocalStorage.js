import { useState, useEffect, useCallback } from "react";

function read(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    // Arrays stay arrays: guards against corrupted values.
    if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
    return parsed;
  } catch (error) {
    console.error(`Could not read "${key}" from Local Storage`, error);
    return fallback;
  }
}

/**
 * useState that is persisted to Local Storage.
 *  - lazy initial read        (useState initialiser)
 *  - write on every change    (useEffect)
 *  - stays in sync across tabs (useEffect + storage event, cleaned up on unmount)
 */
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => read(key, initialValue));

  useEffect(() => {
    try {
      if (value === null || value === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Could not save "${key}" to Local Storage`, error);
    }
  }, [key, value]);

  useEffect(() => {
    function handleStorage(event) {
      if (event.key === key) setValue(read(key, initialValue));
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
    // initialValue is only a fallback shape, it should not re-subscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const remove = useCallback(() => setValue(initialValue), [initialValue]);

  return [value, setValue, remove];
}
