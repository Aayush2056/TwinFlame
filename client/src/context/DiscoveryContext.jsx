import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { fetchMatches, resetDemoDeck } from '../services/discoveryApi.js';

const DiscoveryContext = createContext(null);

export function DiscoveryProvider({ children }) {
  const [matchCount, setMatchCount] = useState(0);
  const [resetVersion, setResetVersion] = useState(0);
  const [isResetting, setIsResetting] = useState(false);

  const syncMatchCount = useCallback(async () => {
    try {
      const data = await fetchMatches();
      setMatchCount(data.total);
    } catch {
      // Initial sync errors are surfaced on route pages
    }
  }, []);

  useEffect(() => {
    void syncMatchCount();
  }, [syncMatchCount]);

  const handleResetDemo = useCallback(async () => {
    setIsResetting(true);
    try {
      await resetDemoDeck();
      setMatchCount(0);
      setResetVersion((v) => v + 1);
    } finally {
      setIsResetting(false);
    }
  }, []);

  return (
    <DiscoveryContext.Provider
      value={{
        matchCount,
        setMatchCount,
        resetVersion,
        isResetting,
        syncMatchCount,
        handleResetDemo,
      }}
    >
      {children}
    </DiscoveryContext.Provider>
  );
}

export function useDiscoveryContext() {
  const ctx = useContext(DiscoveryContext);
  if (!ctx) {
    throw new Error('useDiscoveryContext must be used inside DiscoveryProvider');
  }
  return ctx;
}
