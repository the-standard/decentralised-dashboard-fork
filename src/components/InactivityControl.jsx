import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";

const InactivityContext = createContext(null);

export function InactivityProvider(
  { 
    children, 
    sleepAfter = 5 * 60 * 1000, // 5min
    gracePeriod = 2 * 60 * 1000, // 2min
    activityEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
    ]
  }
) {
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [isAwake, setIsAwake] = useState(true);
  
  const sleepTimeout = useRef(null);
  const graceTimeout = useRef(null);

  const clearTimers = useCallback(() => {
    if (sleepTimeout.current) {
      clearTimeout(sleepTimeout.current);
      sleepTimeout.current = null;
    }
    if (graceTimeout.current) {
      clearTimeout(graceTimeout.current);
      graceTimeout.current = null;
    }
  }, []);

  const startSleepTimer = useCallback(() => {
    clearTimers();
    sleepTimeout.current = setTimeout(() => {
      setIsAwake(false);
    }, sleepAfter);
  }, [clearTimers, sleepAfter]);

  // Use useCallback to memoize the handleUserActivity function
  const handleUserActivity = useCallback(() => {
    if (!isAwake) {
      setIsAwake(true);
    }
    startSleepTimer();
  }, [isAwake, startSleepTimer]);

  // Initialize sleep timer
  useEffect(() => {
    startSleepTimer();
    return clearTimers;
  }, [startSleepTimer, clearTimers]);

  // Handle visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = document.visibilityState === 'visible';
      setIsPageVisible(visible);

      clearTimers();

      if (visible) {
        setIsAwake(true);
        startSleepTimer();
      } else {
        graceTimeout.current = setTimeout(() => {
          setIsAwake(false);
        }, gracePeriod);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimers();
    };
  }, [clearTimers, startSleepTimer, gracePeriod]);

  // Monitor user activity - now with proper dependencies
  useEffect(() => {
    // Only add listeners if the page is visible
    if (!isPageVisible) return;

    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [isPageVisible, handleUserActivity, activityEvents]);

  const wake = useCallback(() => {
    setIsAwake(true);
    startSleepTimer();
  }, [startSleepTimer]);

  const value = {
    isActive: isPageVisible && isAwake,
    wake
  };

  return (
    <InactivityContext.Provider value={value}>
      {children}
    </InactivityContext.Provider>
  );
}

export function useInactivityControl() {
  const context = useContext(InactivityContext);
  if (!context) {
    throw new Error('useInactivityControl must be used within an InactivityProvider');
  }
  return context;
}