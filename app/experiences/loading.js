// app/experiences/loading.js
//
// Same fix as app/projects/loading.js — /experiences is also force-dynamic
// and had no loading fallback, so "See All Experience" from the homepage
// had the identical dead-click feel.

export default function Loading() {
  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem 1rem 4rem" }}>
      <style>{`
        @keyframes exShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .ex-sk {
          background: linear-gradient(90deg, #02275b 25%, #02356e 50%, #02275b 75%);
          background-size: 200% 100%;
          animation: exShimmer 1.5s ease-in-out infinite;
          border-radius: 6px;
          display: block;
        }
        .ex-card {
          background: #00193b;
          border: 1px solid #02275b;
          border-radius: 12px;
          padding: 18px 20px;
          margin-bottom: 16px;
        }
        @media (prefers-reduced-motion: reduce) {
          .ex-sk { animation: none; }
        }
      `}</style>

      {/* Back link placeholder */}
      <span className="ex-sk" style={{ width: "140px", height: "14px", marginBottom: "1.5rem" }} />

      {/* Title + subtitle placeholder */}
      <div style={{ marginBottom: "1.75rem" }}>
        <span className="ex-sk" style={{ width: "280px", height: "34px", marginBottom: "12px" }} />
        <span className="ex-sk" style={{ width: "150px", height: "13px" }} />
      </div>

      {/* Experience card placeholders */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="ex-card">
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
            <span className="ex-sk" style={{ width: "46px", height: "46px", borderRadius: "10px" }} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
              <span className="ex-sk" style={{ width: "45%", height: "16px" }} />
              <span className="ex-sk" style={{ width: "30%", height: "12px" }} />
            </div>
          </div>
          <span className="ex-sk" style={{ width: "100%", height: "11px", marginBottom: "8px" }} />
          <span className="ex-sk" style={{ width: "88%",  height: "11px", marginBottom: "14px" }} />
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            <span className="ex-sk" style={{ width: "88px", height: "20px" }} />
            <span className="ex-sk" style={{ width: "74px", height: "20px" }} />
            <span className="ex-sk" style={{ width: "56px", height: "20px" }} />
          </div>
        </div>
      ))}
    </div>
  );
}