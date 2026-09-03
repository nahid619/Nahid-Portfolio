// app/projects/loading.js
//
// BUG FIX — "clicking See All Projects feels stuck"
//
// /projects is `force-dynamic`, so every visit waits on a serverless
// invocation plus a MongoDB round trip before ANY html is sent. With no
// loading.js, Next.js had nothing to show during that wait, so the browser
// sat on the old page and the click looked like it did nothing.
//
// This file is a Next.js App Router convention: Next automatically wraps
// app/projects/page.js in a <Suspense> boundary using this as the fallback,
// and prefetches this shell. Navigation becomes instant — the loader paints
// immediately, then the real content streams in and swaps itself.
//
// Uses the same circular loader as the home route (was a card skeleton).
// See the note in app/loading.js for why.

import RouteLoader from "@/components/shared/RouteLoader";

export default function Loading() {
  return <RouteLoader label="Loading projects" />;
}