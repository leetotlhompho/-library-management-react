import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/** Call `redirect("/path")` to navigate after a short delay (timer is cleaned up on unmount). */
export default function useRedirectAfter(delay = 700) {
  const navigate = useNavigate();
  const [target, setTarget] = useState(null);

  useEffect(() => {
    if (!target) return undefined;
    const timer = setTimeout(() => navigate(target, { replace: true }), delay);
    return () => clearTimeout(timer);
  }, [target, delay, navigate]);

  return setTarget;
}
