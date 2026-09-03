// app/loading.js
//
// Loading fallback for the HOME route. Covers two cases:
//   1. The very first visit, before any HTML has been rendered.
//   2. Navigating back home (e.g. "Back to Portfolio" from /projects).
//
// All three routes now share one circular loader (see RouteLoader) instead
// of mixing a spinner here with skeletons elsewhere. Reasons:
//   - Consistency: two loading idioms on one small site is a polish flaw.
//     Clicking through to /projects and back showed a skeleton one way and
//     a spinner the other.
//   - Skeletons only pay off when the placeholder closely matches what
//     replaces it. The project cards vary in height (some have both GitHub
//     and Live buttons, some only one; titles wrap differently), so the
//     swap shifted content anyway.
//   - Skeletons suit SHORT waits. These routes are force-dynamic on a cold
//     serverless start, so the wait is often 2-5s — long enough that a
//     looping shimmer reads as "broken" rather than "loading".
//
// Imported directly rather than from "@/components/shared" so we don't pull
// that barrel's client components into a zero-JS loading screen.

import RouteLoader from "@/components/shared/RouteLoader";

export default function Loading() {
  return <RouteLoader label="Loading" />;
}