// app/certifications/loading.js
// Instant feedback while the force-dynamic page waits on MongoDB — same
// loader as /projects and /experiences (see app/projects/loading.js).

import RouteLoader from "@/components/shared/RouteLoader";

export default function Loading() {
  return <RouteLoader label="Loading certifications" />;
}
