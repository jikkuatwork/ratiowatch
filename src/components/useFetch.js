import { useState, useEffect } from "react";

export function useFetch(from, to, API) {
  const [rate, setRate] = useState(null);
  const [error, setError] = useState(null);

  const fetchRate = () => {
    const apiInstance = new API(from, to);
    const url = apiInstance.url();

    setRate(null);
    setError(null);

    fetch(url)
      .then((r) => r.json())
      .then((json) => {
        const { rate, error } = apiInstance.extract(json);
        setRate(rate);
        setError(error);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  useEffect(() => {
    fetchRate();
  }, [from, to, API]);

  return { rate, error, fetchRate };
}
