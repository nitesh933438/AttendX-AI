import { useState, useEffect, useCallback } from 'react';
import { ActiveSession } from '../types';
import { apiClient } from '../services/apiClient';
import { API_ENDPOINTS } from '../lib/constants';

export function useAttendance() {
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveSession = useCallback(async () => {
    try {
      const data = await apiClient.get(API_ENDPOINTS.SESSIONS_ACTIVE);
      if (data.active && data.session) {
        setActiveSession(data.session);
      } else {
        setActiveSession(null);
      }
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to check active attendance session');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveSession();
    const interval = setInterval(fetchActiveSession, 3000);
    return () => clearInterval(interval);
  }, [fetchActiveSession]);

  return { activeSession, loading, error, refetch: fetchActiveSession };
}
