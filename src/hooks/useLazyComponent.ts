"use client";

import type React from "react";

import { useState, useEffect } from "react";

export const useLazyComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  deps: any[] = []
) => {
  const [Component, setComponent] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadComponent = async () => {
      try {
        setLoading(true);
        setError(null);

        const module = await importFunc();

        if (isMounted) {
          setComponent(() => module.default);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err : new Error("Failed to load component")
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadComponent();

    return () => {
      isMounted = false;
    };
  }, deps);

  return { Component, loading, error };
};

export default useLazyComponent;
