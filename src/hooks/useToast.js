// src/hooks/useToast.js
import { useCallback, useEffect, useRef, useState } from "react";

export function useToast(ms = 2400) {
  const [toast, setToast] = useState("");
  const timer = useRef(null);

  const say = useCallback(
    (msg) => {
      setToast(msg);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setToast(""), ms);
    },
    [ms]
  );

  useEffect(() => () => clearTimeout(timer.current), []);

  return [toast, say];
}
