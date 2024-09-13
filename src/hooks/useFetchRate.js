import { useState, useEffect } from "react";

export function useFetchRate(from, to) {
  const [rate, setRate] = useState(null);
  const [error, setError] = useState(null);

  const fetchRate = () => {
    setRate(null);
    setError(null);

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${from}&tsyms=${to}`;

    fetch(url)
      .then((r) => r.json())
      .then((json) => {
        if (json.Response === "Error") {
          setError(json.Message);
        } else {
          const price = json.RAW[from][to].PRICE;
          setRate(price);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  useEffect(() => {
    fetchRate();
  }, [from, to]);

  return { rate, error };
}
