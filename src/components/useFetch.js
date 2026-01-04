import { useState, useEffect } from "react";

const MAX_RETRIES = 5;
const INITIAL_DELAY = 1000;

export function useFetch(from, to, API) {
  const [rate, setRate] = useState(null);
  const [error, setError] = useState(null);
  const [failed, setFailed] = useState(false);

  const fetchWithRetry = async (url, apiInstance, attempt = 1) => {
    try {
      const response = await fetch(url);
      if (response.status === 429 || response.status >= 500) {
        throw new Error(`HTTP ${response.status}`);
      }
      const json = await response.json();
      const { rate, error } = apiInstance.extract(json);
      if (error) {
        throw new Error(error);
      }
      return rate;
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        const delay = INITIAL_DELAY * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchWithRetry(url, apiInstance, attempt + 1);
      }
      throw err;
    }
  };

  const fetchRate = async () => {
    const apiInstance = new API(from, to);
    const url = apiInstance.url();

    setRate(null);
    setError(null);
    setFailed(false);

    try {
      const rate = await fetchWithRetry(url, apiInstance);
      setRate(rate);
    } catch (err) {
      setError(err.message);
      setFailed(true);
    }
  };

  useEffect(() => {
    fetchRate();
  }, [from, to, API]);

  return { rate, error, failed, fetchRate };
}
