// app/experiences/loading.js
//
// Same fix as app/projects/loading.js — /experiences is also force-dynamic
// and had no loading fallback, so "See All Experience" from the homepage
// had the identical dead-click feel.

import RouteLoader from "@/components/shared/RouteLoader";

export default function Loading() {
  return <RouteLoader label="Loading experience" />;
}