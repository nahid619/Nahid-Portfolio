// hooks/useFetch.js
"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * useFetch — Reusable data-fetching hook
 *
 * Automatically re-fetches when:
 *   1. The URL or params change (original behaviour — shows skeletons)
 *   2. The browser window/tab regains focus — silent background revalidation
 *      Data swaps in quietly with NO skeleton flash. Fixes the issue where
 *      data added in the admin panel was invisible until a hard refresh.
 *
 * A 3-second debounce prevents hammering the API on rapid tab switches.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useFetch("/api/skills");
 *
 * With options:
 *   const { data } = useFetch("/api/projects", {
 *     params: { category: "sqa" },
 *     skip: !isReady,
 *     revalidateOnFocus: false,   // opt-out per call if needed
 *   });
 *
 * @param {string} url - API endpoint
 * @param {Object} options
 * @param {Object}  options.params            - Query params appended to URL
 * @param {boolean} options.skip              - Skip the fetch entirely
 * @param {any}     options.initialData       - Value used before data arrives
 * @param {boolean} options.revalidateOnFocus - Silent re-fetch on window focus (default: true)
 */
export function useFetch(url, options = {}) {
  const {
    params = null,
    skip = false,
    initialData = null,
    revalidateOnFocus = true,
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState(null);

  // Track the timestamp of the last fetch so we can debounce focus events
  const lastFetchedAt = useRef(0);
  // 3-second debounce — focus events can fire multiple times in quick succession
  const FOCUS_DEBOUNCE_MS = 3000;

  // Serialize params to a stable string — not an object
  const paramsString = params ? new URLSearchParams(params).toString() : "";
  const fullUrl = paramsString ? `${url}?${paramsString}` : url;

  /**
   * fetchData — the core fetch function.
   *
   * @param {boolean} silent - When true (focus revalidation), skips the
   *   loading spinner so the portfolio page never flashes skeleton loaders
   *   on every tab switch. Data is swapped in quietly once the response
   *   arrives. When false (initial load or URL change), shows skeletons.
   */
  const fetchData = useCallback(async (silent = false) => {
    if (skip) return;

    if (!silent) setLoading(true);
    setError(null);

    try {
      const res = await fetch(fullUrl);

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `HTTP ${res.status}`);
      }

      const json = await res.json();
      setData(json);
      lastFetchedAt.current = Date.now();
    } catch (err) {
      // Only surface errors on non-silent fetches to avoid briefly
      // flashing an error state during a background refresh
      if (!silent) setError(err.message || "Something went wrong");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [fullUrl, skip]);

  // Initial fetch + re-fetch on URL/params change — shows skeletons as normal
  useEffect(() => {
    fetchData(false);
  }, [fetchData]);

  // Silent revalidate on window focus
  // When the user switches back to the portfolio tab after adding data in
  // the admin panel, silently re-fetch so new items appear immediately
  // with no skeleton flash. Debounced to 3s to avoid hammering the API.
  useEffect(() => {
    if (!revalidateOnFocus || skip) return;

    const handleFocus = () => {
      const now = Date.now();
      if (now - lastFetchedAt.current < FOCUS_DEBOUNCE_MS) return;
      fetchData(true); // silent = true — no loading state, no error flash
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchData, revalidateOnFocus, skip]);

  // Expose refetch for manual use in admin managers — always shows loading
  const refetch = useCallback(() => fetchData(false), [fetchData]);

  return { data, loading, error, refetch };
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