import { useCallback, useRef } from "react";
export function useDebounce(fn, ms = 300) {
  const timer = useRef(null);

  return useCallback(
    (...args) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => fn(...args), ms);
    },
    [fn, ms]
  );
}
