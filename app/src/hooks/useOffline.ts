import { useState, useEffect } from 'react';

/**
 * Basic offline hook. 
 * Placeholder logic - can be expanded with @react-native-community/netinfo
 */
export const useOffline = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Implement real net-info listener here in Phase 2
    setIsOffline(false);
  }, []);

  return isOffline;
};
