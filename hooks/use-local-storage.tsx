"use client";

import * as React from "react";

type StorageDeserializer<T> = (value: string) => T;

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  deserialize: StorageDeserializer<T> | null = null
): [T, (value: T | ((prevState: T) => T)) => void] {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);

      if (item) {
        const parsedItem = JSON.parse(item);

        // If a custom deserializer is provided, use it
        if (deserialize) {
          return deserialize(item);
        }

        return parsedItem;
      }

      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = React.useCallback(
    (value: T | ((prevState: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // Save state
        setStoredValue(valueToStore);

        // Save to localStorage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Listen for changes to this localStorage key from other windows/tabs
  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== key) {
        return;
      }

      try {
        const newValue = e.newValue
          ? deserialize
            ? deserialize(e.newValue)
            : JSON.parse(e.newValue)
          : undefined;

        if (newValue) {
          setStoredValue(newValue);
        }
      } catch (error) {
        console.error(`Error parsing localStorage key "${key}":`, error);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, deserialize]);

  return [storedValue, setValue];
}
