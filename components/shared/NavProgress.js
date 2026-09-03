// components/shared/NavProgress.js
"use client";

// Immediate click feedback for cross-route links.
//
// loading.js handles the route-level skeleton, but on a slow connection the
// prefetch may not have finished when the user clicks, so there can still be
// a beat where nothing visibly happens. useLinkStatus (next/link) reports the
// pending state of the nearest ancestor <Link>, which lets us show a spinner
// the instant the click lands.
//
// IMPORTANT: this must be rendered as a DESCENDANT of a <Link>. Used outside
// one, `pending` simply stays false and this renders nothing.
//
// The spinner is debounced in CSS: it starts at opacity 0 with a 120ms
// animation delay, so fast navigations never flash a spinner.

import { useLinkStatus } from "next/link";

export default function NavProgress({ size = 14, color = "#06D001", label = "Loading page" }) {
  const { pending } = useLinkStatus();

  if (!pending) return null;

  return (
    <>
      <span
        role="status"
        aria-label={label}
        className="nav-progress"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderColor: `${color}40`,
          borderTopColor: color,
        }}
      />
      <style>{`
        .nav-progress {
          display: inline-block;
          border-width: 2px;
          border-style: solid;
          border-radius: 50%;
          flex-shrink: 0;
          opacity: 0;
          animation:
            navProgressSpin 0.7s linear infinite,
            navProgressIn 0.2s ease 0.12s forwards;
        }
        @keyframes navProgressSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes navProgressIn {
          to { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .nav-progress { animation: navProgressIn 0.2s ease forwards; }
        }
      `}</style>
    </>
  );
}