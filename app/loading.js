// app/loading.js
//
// Loading fallback for the HOME route. Covers two cases:
//   1. The very first visit, before any HTML has been rendered.
//   2. Navigating back home (e.g. "Back to Portfolio" from /projects).
//
// Why a spinner and not a skeleton:
// Skeletons work when the placeholder resembles what replaces it — the
// /projects grid is a predictable set of equal cards, so a skeleton there
// reads as "cards are coming". The landing page is a hero with mixed
// typography, buttons and a portrait; a skeleton of it is just a few grey
// slabs that look like a layout failure rather than a load in progress.
// A centred, branded spinner communicates "the site is starting" clearly.
//
// Still a Server Component with zero client JS and no imports, so it ships
// as static HTML inside the route prefetch and can never itself be slow.
// All animation is pure CSS.

export default function Loading() {
  return (
    <main className="hm-wrap">
      <style>{`
        .hm-wrap {
          background: #011428;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        /* dvh avoids the mobile browser-chrome jump where supported */
        @supports (min-height: 100dvh) {
          .hm-wrap { min-height: 100dvh; }
        }

        .hm-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 22px;
          /* Debounced: starts invisible and fades in after 120ms, so a fast
             load never flashes a spinner on screen. */
          opacity: 0;
          animation: hmFadeIn 0.35s ease 0.12s forwards;
        }

        .hm-ring {
          position: relative;
          width: 76px;
          height: 76px;
        }
        .hm-ring span {
          position: absolute;
          border-radius: 50%;
          box-sizing: border-box;
        }
        /* Faint full circle the arcs travel around */
        .hm-track {
          inset: 0;
          border: 3px solid rgba(6, 208, 1, 0.20);
        }
        /* Outer green arc, clockwise */
        .hm-arc-outer {
          inset: 0;
          border: 3px solid transparent;
          border-top-color: #06D001;
          border-right-color: rgba(6, 208, 1, 0.45);
          animation: hmSpin 0.9s cubic-bezier(0.55, 0.15, 0.45, 0.85) infinite;
        }
        /* Inner cyan arc, counter-clockwise — picks up the accent colour
           already used by the section-header underlines. */
        .hm-arc-inner {
          inset: 13px;
          border: 2px solid transparent;
          border-bottom-color: #22d3ee;
          animation: hmSpinReverse 1.3s cubic-bezier(0.55, 0.15, 0.45, 0.85) infinite;
        }
        /* Breathing core dot */
        .hm-core {
          top: 50%;
          left: 50%;
          width: 9px;
          height: 9px;
          margin: -4.5px 0 0 -4.5px;
          background: #06D001;
          box-shadow: 0 0 12px rgba(6, 208, 1, 0.65);
          animation: hmPulse 1.5s ease-in-out infinite;
        }

        .hm-brand {
          margin: 0;
          color: #ffffff;
          font-family: var(--font-poppins), Poppins, sans-serif;
          font-weight: 700;
          font-size: 1.15rem;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }
        .hm-brand i {
          color: #06D001;
          font-style: normal;
        }
        .hm-sub {
          margin: 0;
          color: #bcc4ba;
          font-family: var(--font-poppins), Poppins, sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          animation: hmDim 1.6s ease-in-out infinite;
        }

        @keyframes hmSpin        { to { transform: rotate(360deg);  } }
        @keyframes hmSpinReverse { to { transform: rotate(-360deg); } }
        @keyframes hmFadeIn      { to { opacity: 1; } }
        @keyframes hmPulse {
          0%, 100% { transform: scale(0.7); opacity: 0.55; }
          50%      { transform: scale(1);   opacity: 1;    }
        }
        @keyframes hmDim {
          0%, 100% { opacity: 0.45; }
          50%      { opacity: 0.9;  }
        }

        /* Accessibility: hold a static ring rather than spinning it. */
        @media (prefers-reduced-motion: reduce) {
          .hm-loader   { opacity: 1; animation: none; }
          .hm-arc-outer,
          .hm-arc-inner,
          .hm-core,
          .hm-sub      { animation: none; }
          .hm-arc-outer { border-right-color: rgba(6, 208, 1, 0.45); }
        }
      `}</style>

      <div className="hm-loader" role="status" aria-live="polite" aria-label="Loading portfolio">
        <div className="hm-ring" aria-hidden="true">
          <span className="hm-track" />
          <span className="hm-arc-outer" />
          <span className="hm-arc-inner" />
          <span className="hm-core" />
        </div>

        <p className="hm-brand">Nahid<i>.</i>Hasan</p>
        <p className="hm-sub">Loading</p>
      </div>
    </main>
  );
}