// components/portfolio/certUtils.js
// Small helpers shared by CertClient and CertModal.

// "2026-04" → "Apr 2026". Built from parts (not new Date("2026-04")) so the
// server and browser agree regardless of timezone — no hydration mismatch.
export function formatIssueDate(value) {
  if (!value || typeof value !== "string") return "";
  const [y, m] = value.split("-").map(Number);
  if (!y || !m) return "";
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

// Shown when a certification has no image uploaded yet.
export function CertPlaceholder({ size = 40 }) {
  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <svg
        width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke="#059212" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="9" r="6" />
        <path d="M8.5 13.8 7 22l5-3 5 3-1.5-8.2" />
      </svg>
    </div>
  );
}

// Which cert gets the large spotlight card: the first one ticked "featured"
// in the admin panel (by display order). If none is ticked, the first cert
// by display order is used, so the section always has a lead credential.
// Everything else keeps its display order — that order is the ranking that
// decides which certificates make the homepage preview.
export function splitFeatured(certs = []) {
  const lead = certs.find(c => c.featured) || certs[0];
  if (!lead) return { featured: [], rest: [] };
  return { featured: [lead], rest: certs.filter(c => c._id !== lead._id) };
}
