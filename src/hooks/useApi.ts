import { useState, useEffect } from 'react';
import api, { handleApiResponse } from '../utils/api';
import { ApiWrapper } from '../types';

interface UseApiOptions {
  immediate?: boolean;
}

export const useApi = <T>(
  apiCall: () => Promise<{ data: ApiWrapper<T> }>,
  options: UseApiOptions = { immediate: true }
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      const result = handleApiResponse(response);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, []);

  return { data, loading, error, execute, refetch: execute };
};