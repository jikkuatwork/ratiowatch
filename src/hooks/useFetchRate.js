import { useState, useEffect } from "react";

const MAX_RETRIES = 5;
const INITIAL_DELAY = 1000;

export function useFetchRate(from, to) {
  const [rate, setRate] = useState(null);
  const [error, setError] = useState(null);
  const [failed, setFailed] = useState(false);

  const fetchWithRetry = async (url, attempt = 1) => {
    try {
      const response = await fetch(url);
      if (response.status === 429 || response.status >= 500) {
        throw new Error(`HTTP ${response.status}`);
      }
      const json = await response.json();
      if (json.Response === "Error") {
        throw new Error(json.Message);
      }
      return json;
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
    setRate(null);
    setError(null);
    setFailed(false);

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${from}&tsyms=${to}`;

    try {
      const json = await fetchWithRetry(url);
      const price = json.RAW[from][to].PRICE;
      setRate(price);
    } catch (err) {
      setError(err.message);
      setFailed(true);
    }
  };

  useEffect(() => {
    fetchRate();
  }, [from, to]);

  return { rate, error, failed };
}
