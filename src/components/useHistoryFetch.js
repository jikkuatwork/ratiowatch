import { useState, useEffect } from "react";

const MAX_RETRIES = 5;
const INITIAL_DELAY = 1000;

const ytdAPI = (from, to) =>
  `https://api.ratiowatch.org/ytd?_from=${from}&_to=${to}`;

export function useHistoryFetch(from, to) {
  const [ratios, setRatios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const fetchWithRetry = async (url, attempt = 1) => {
    try {
      const response = await fetch(url);
      if (response.status === 429 || response.status >= 500) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        const delay = INITIAL_DELAY * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchWithRetry(url, attempt + 1);
      }
      throw err;
    }
  };

  const fetchRate = async () => {
    setIsLoading(true);
    setFailed(false);
    const url = ytdAPI(from, to);

    try {
      const json = await fetchWithRetry(url);
      if (json) {
        setRatios(json["payload"]["ratios"]);
      }
    } catch (err) {
      console.error(err);
      setFailed(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRate();
  }, [from, to]);

  return { ratios, isLoading, failed };
}
