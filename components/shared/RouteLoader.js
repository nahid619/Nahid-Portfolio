// components/shared/RouteLoader.js
//
// The single circular loading screen used by every route-level loading.js.
//
// Deliberately NOT a client component — there is no "use client" here, so
// this renders to static HTML on the server, ships inside the route
// prefetch, and adds zero JavaScript. All animation is CSS.
//
// For that reason, import it DIRECTLY:
//     import RouteLoader from "@/components/shared/RouteLoader";
// and not via "@/components/shared", because that barrel file also exports
// NavProgress, which is a client component and would drag a client bundle
// into a loading screen that doesn't need one.
//
// Sizing: everything derives from the --ring custom property, so the ring,
// its stroke weights, the core dot and the text all scale together.
// Change --ring alone to resize the whole loader.
//
// Props:
//   label — the small uppercase line under the wordmark. Keep it short.

export default function RouteLoader({ label = "Loading" }) {
  return (
    <main className="rl-wrap">
      <style>{`
        .rl-wrap {
          background: #011428;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        /* dvh avoids the mobile browser-chrome jump where supported */
        @supports (min-height: 100dvh) {
          .rl-wrap { min-height: 100dvh; }
        }

        .rl-loader {
          /* Fluid: ~112px on a 360px phone, capped at 168px on desktop.
             vmin rather than vw so tall narrow screens don't oversize it. */
          --ring: clamp(112px, 26vmin, 168px);

          display: flex;
          flex-direction: column;
          align-items: center;
          gap: calc(var(--ring) * 0.2);
          /* Debounced: starts invisible and fades in after 120ms, so a fast
             navigation never flashes a spinner on screen. */
          opacity: 0;
          animation: rlFadeIn 0.35s ease 0.12s forwards;
        }

        .rl-ring {
          position: relative;
          width: var(--ring);
          height: var(--ring);
        }
        .rl-ring span {
          position: absolute;
          border-radius: 50%;
          box-sizing: border-box;
        }
        /* Faint full circle the arcs travel around */
        .rl-track {
          inset: 0;
          border: calc(var(--ring) / 34) solid rgba(6, 208, 1, 0.20);
        }
        /* Outer green arc, clockwise */
        .rl-arc-outer {
          inset: 0;
          border: calc(var(--ring) / 34) solid transparent;
          border-top-color: #06D001;
          border-right-color: rgba(6, 208, 1, 0.45);
          animation: rlSpin 0.9s cubic-bezier(0.55, 0.15, 0.45, 0.85) infinite;
        }
        /* Inner cyan arc, counter-clockwise — picks up the accent colour
           already used by the section-header underlines. Percentage inset
           so it tracks the ring size. */
        .rl-arc-inner {
          inset: 17%;
          border: calc(var(--ring) / 48) solid transparent;
          border-bottom-color: #22d3ee;
          animation: rlSpinReverse 1.3s cubic-bezier(0.55, 0.15, 0.45, 0.85) infinite;
        }
        /* Breathing core dot. Centred with a transform rather than negative
           margins so it scales with --ring; the translate is repeated inside
           the keyframes because transform is a single property. */
        .rl-core {
          top: 50%;
          left: 50%;
          width: calc(var(--ring) / 8);
          height: calc(var(--ring) / 8);
          background: #06D001;
          box-shadow: 0 0 calc(var(--ring) / 5) rgba(6, 208, 1, 0.6);
          transform: translate(-50%, -50%);
          animation: rlPulse 1.5s ease-in-out infinite;
        }

        .rl-brand {
          margin: 0;
          color: #ffffff;
          font-family: var(--font-poppins), Poppins, sans-serif;
          font-weight: 700;
          font-size: calc(var(--ring) / 7.5);
          letter-spacing: -0.01em;
          white-space: nowrap;
        }
        .rl-brand i {
          color: #06D001;
          font-style: normal;
        }
        .rl-sub {
          margin: 0;
          color: #bcc4ba;
          font-family: var(--font-poppins), Poppins, sans-serif;
          font-size: calc(var(--ring) / 15);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-align: center;
          animation: rlDim 1.6s ease-in-out infinite;
        }

        @keyframes rlSpin        { to { transform: rotate(360deg);  } }
        @keyframes rlSpinReverse { to { transform: rotate(-360deg); } }
        @keyframes rlFadeIn      { to { opacity: 1; } }
        @keyframes rlPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(0.68); opacity: 0.55; }
          50%      { transform: translate(-50%, -50%) scale(1);    opacity: 1;    }
        }
        @keyframes rlDim {
          0%, 100% { opacity: 0.45; }
          50%      { opacity: 0.9;  }
        }

        /* Accessibility: hold a static ring rather than spinning it. The
           core keeps its centring transform because animation:none falls
           back to the declared value above. */
        @media (prefers-reduced-motion: reduce) {
          .rl-loader { opacity: 1; animation: none; }
          .rl-arc-outer,
          .rl-arc-inner,
          .rl-core,
          .rl-sub { animation: none; }
        }
      `}</style>

      <div className="rl-loader" role="status" aria-live="polite" aria-label={label}>
        <div className="rl-ring" aria-hidden="true">
          <span className="rl-track" />
          <span className="rl-arc-outer" />
          <span className="rl-arc-inner" />
          <span className="rl-core" />
        </div>

        <p className="rl-brand">Nahid<i>.</i>Hasan</p>
        <p className="rl-sub">{label}</p>
      </div>
    </main>
  );
}