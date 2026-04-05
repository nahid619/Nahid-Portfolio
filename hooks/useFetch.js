// hooks/useFetch.js
"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * useFetch — Reusable data-fetching hook
 *
 * Usage:
 *   const { data, loading, error, refetch } = useFetch("/api/skills");
 *
 * With options:
 *   const { data } = useFetch("/api/projects", {
 *     params: { category: "sqa" },
 *     skip: !isReady,
 *   });
 *
 * @param {string} url - API endpoint
 * @param {Object} options
 * @param {Object} options.params - Query params appended to URL
 * @param {boolean} options.skip - Skip the fetch entirely (useful for conditional fetching)
 * @param {any} options.initialData - Value used before data arrives
 */
export function useFetch(url, options = {}) {
  const { params = null, skip = false, initialData = null } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState(null);

  // ✅ Serialize params to a stable string — not an object
  const paramsString = params ? new URLSearchParams(params).toString() : "";
  const fullUrl = paramsString ? `${url}?${paramsString}` : url;

  const fetchData = useCallback(async () => {
    if (skip) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(fullUrl);

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `HTTP ${res.status}`);
      }

      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [fullUrl, skip]); // ✅ fullUrl is a string — stable reference

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * useMutation — For POST / PUT / DELETE operations
 *
 * Usage:
 *   const { mutate, loading, error } = useMutation("/api/projects", "POST");
 *   await mutate({ title: "New Project" });
 *
 * @param {string} url - API endpoint
 * @param {string} method - "POST" | "PUT" | "DELETE" | "PATCH"
 */
export function useMutation(url, method = "POST") {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(
    async (body) => {
      setLoading(true);
      setError(null);

      try {
        const isFormData = body instanceof FormData;

        const res = await fetch(url, {
          method,
          headers: isFormData ? undefined : { "Content-Type": "application/json" },
          body: isFormData ? body : JSON.stringify(body),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || `HTTP ${res.status}`);
        }

        const data = await res.json();
        return data;
      } catch (err) {
        setError(err.message || "Something went wrong");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [url, method]
  );

  return { mutate, loading, error };
}