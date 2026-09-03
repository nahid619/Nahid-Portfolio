// app/projects/loading.js
//
// BUG FIX — "clicking See All Projects feels stuck"
//
// /projects is `force-dynamic`, so every visit waits on a serverless
// invocation plus a MongoDB round trip before ANY html is sent. With no
// loading.js, Next.js has nothing to show during that wait, so the browser
// sat on the old page and the click looked like it did nothing.
//
// This file is a Next.js App Router convention: Next automatically wraps
// app/projects/page.js in a <Suspense> boundary using this as the fallback,
// and prefetches this shell. Navigation becomes instant — the skeleton
// paints immediately, then the real content streams in and swaps itself.
//
// Deliberately a Server Component with no imports and no client JS, so it
// ships as static html in the prefetch and cannot itself be slow.
// The layout mirrors AllProjectsClient so the swap doesn't shift content.

export default function Loading() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem 4rem" }}>
      <style>{`
        @keyframes pjShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .pj-sk {
          background: linear-gradient(90deg, #02275b 25%, #02356e 50%, #02275b 75%);
          background-size: 200% 100%;
          animation: pjShimmer 1.5s ease-in-out infinite;
          border-radius: 6px;
          display: block;
        }
        .pj-card {
          background: #00193b;
          border: 1px solid #02275b;
          border-radius: 12px;
          overflow: hidden;
        }
        .pj-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        @media (prefers-reduced-motion: reduce) {
          .pj-sk { animation: none; }
        }
      `}</style>

      {/* Back link placeholder */}
      <span className="pj-sk" style={{ width: "140px", height: "14px", marginBottom: "1.5rem" }} />

      {/* Title + subtitle placeholder */}
      <div style={{ marginBottom: "1.75rem" }}>
        <span className="pj-sk" style={{ width: "240px", height: "34px", marginBottom: "12px" }} />
        <span className="pj-sk" style={{ width: "130px", height: "13px" }} />
      </div>

      {/* Tab row placeholder */}
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {[52, 88, 56, 48, 68].map((w, i) => (
          <span key={i} className="pj-sk" style={{ width: `${w}px`, height: "16px" }} />
        ))}
      </div>

      {/* Card grid placeholder */}
      <div className="pj-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="pj-card">
            <span className="pj-sk" style={{ height: "170px", borderRadius: 0 }} />
            <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "9px" }}>
              <span className="pj-sk" style={{ width: "65%", height: "16px" }} />
              <span className="pj-sk" style={{ width: "100%", height: "11px" }} />
              <span className="pj-sk" style={{ width: "80%",  height: "11px" }} />
              <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                <span className="pj-sk" style={{ width: "62px", height: "18px" }} />
                <span className="pj-sk" style={{ width: "78px", height: "18px" }} />
                <span className="pj-sk" style={{ width: "54px", height: "18px" }} />
              </div>
              <span className="pj-sk" style={{ width: "100%", height: "30px", marginTop: "6px" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}