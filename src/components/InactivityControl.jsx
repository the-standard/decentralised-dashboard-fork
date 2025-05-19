import { createContext, useContext, useEffect, useState, useRef } from "react";

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

  const clearTimers = () => {
    if (sleepTimeout.current) {
      clearTimeout(sleepTimeout.current);
      sleepTimeout.current = null;
    }
    if (graceTimeout.current) {
      clearTimeout(graceTimeout.current);
      graceTimeout.current = null;
    }
  };

  const startSleepTimer = () => {
    clearTimers();
    sleepTimeout.current = setTimeout(() => {
      setIsAwake(false);
    }, sleepAfter);
  };

  const handleUserActivity = () => {
    if (!isAwake) {
      setIsAwake(true);
    }
    startSleepTimer();
  };

  // Initialize sleep timer
  useEffect(() => {
    startSleepTimer();
    return clearTimers;
  }, [sleepAfter]);

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
  }, [sleepAfter, gracePeriod]);

  // Monitor user activity
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
  }, [isPageVisible]);

  const wake = () => {
    setIsAwake(true);
    startSleepTimer();
  };

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