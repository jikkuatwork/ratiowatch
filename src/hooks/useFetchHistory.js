import { useState, useEffect } from "react";

export function useFetchHistory(from, to) {
  const [ratios, setRatios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = () => {
    setIsLoading(true);
    const url = `https://api.ratiowatch.org/ytd?_from=${from}&_to=${to}`;
    fetch(url)
      .then((r) => r.json())
      .then((json) => {
        if (json) {
          setRatios(json.payload.ratios);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchHistory();
  }, [from, to]);

  return { ratios, isLoading };
}
