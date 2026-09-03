// app/loading.js
//
// Loading fallback for the HOME route — this is the "Back to Portfolio"
// direction. The homepage is force-dynamic and getHomePageData() runs a
// dozen Mongo queries, so navigating back from /projects had the same
// dead-click problem as going forward.
//
// This also covers the very first visit: instead of a blank white screen
// while the server renders, visitors get an immediate branded shell.
//
// If you'd rather the homepage never show a skeleton, delete this file —
// the /projects and /experiences fallbacks are independent of it.

export default function Loading() {
  return (
    <main style={{ background: "#011428", minHeight: "100vh" }}>
      <style>{`
        @keyframes hmShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes hmPulse {
          0%, 100% { opacity: 0.45; }
          50%      { opacity: 1;    }
        }
        .hm-sk {
          background: linear-gradient(90deg, #02275b 25%, #02356e 50%, #02275b 75%);
          background-size: 200% 100%;
          animation: hmShimmer 1.5s ease-in-out infinite;
          border-radius: 6px;
          display: block;
        }
        .hm-brand {
          color: #ffffff;
          font-weight: 700;
          font-size: 1.1rem;
          letter-spacing: -0.01em;
          animation: hmPulse 1.6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .hm-sk, .hm-brand { animation: none; }
        }
      `}</style>

      {/* Header shell — mirrors NavBar's 64px bar so nothing jumps on swap */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
        background: "rgba(1,20,40,0.92)",
        backdropFilter: "blur(12px)",
        height: "64px",
      }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem",
          height: "64px", display: "flex", alignItems: "center",
          justifyContent: "space-between",
        }}>
          <span className="hm-brand">
            Nahid<span style={{ color: "#06D001" }}>.</span>Hasan
          </span>
          <span className="hm-sk" style={{ width: "180px", height: "12px" }} />
        </div>
      </div>
      <div style={{ height: "64px" }} />

      {/* Hero shell */}
      <section style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex", alignItems: "center",
        padding: "4rem 1.5rem 3rem",
      }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto", width: "100%",
          display: "flex", flexDirection: "column", gap: "16px",
        }}>
          <span className="hm-sk" style={{ width: "min(180px, 60%)", height: "13px" }} />
          <span className="hm-sk" style={{ width: "min(520px, 90%)", height: "44px" }} />
          <span className="hm-sk" style={{ width: "min(380px, 75%)", height: "44px" }} />
          <span className="hm-sk" style={{ width: "min(600px, 95%)", height: "12px", marginTop: "10px" }} />
          <span className="hm-sk" style={{ width: "min(540px, 88%)", height: "12px" }} />
          <div style={{ display: "flex", gap: "12px", marginTop: "18px" }}>
            <span className="hm-sk" style={{ width: "150px", height: "42px", borderRadius: "8px" }} />
            <span className="hm-sk" style={{ width: "130px", height: "42px", borderRadius: "8px" }} />
          </div>
        </div>
      </section>
    </main>
  );
}