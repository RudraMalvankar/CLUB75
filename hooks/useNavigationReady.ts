import { useCallback, useEffect, useRef, useState } from "react";

export function useNavigationReady() {
  const [isReady, setIsReady] = useState(false);
  const mountedRef = useRef(true);

  const markReady = useCallback(() => {
    if (mountedRef.current) {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    isReady,
    markReady,
  };
}
