import { useState, useEffect } from "react";

const ytdAPI = (from, to) =>
  `https://api.ratiowatch.org/ytd?_from=${from}&_to=${to}`;

export function useHistoryFetch(from, to) {
  const [ratios, setRatios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRate = () => {
    const url = ytdAPI(from, to);

    fetch(url)
      .then((r) => r.json())
      .then((json) => {
        if (json) {
          setRatios(json["payload"]["ratios"]);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchRate();
  }, [from, to]);

  return { ratios, isLoading };
}
