import { useState, useEffect } from 'react';

/**
 * Returns a debounced representation of the provided value.
 * @param {any} value - The input value to debounce.
 * @param {number} delay - Re-evaluation delay in milliseconds.
 * @returns {any} The debounced value.
 */
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
