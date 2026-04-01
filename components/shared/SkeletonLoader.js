"use client";

/**
 * SkeletonLoader
 * Shimmer loading placeholders shown while data is fetching.
 *
 * Props:
 *   variant — "card" | "line" | "circle"
 *   width   — CSS width string (default varies by variant)
 *   height  — CSS height string (default varies by variant)
 *   count   — how many to render in a row (default: 1)
 *   style   — extra style overrides
 */
export default function SkeletonLoader({
  variant = "card",
  width,
  height,
  count = 1,
  style = {},
}) {
  const defaults = {
    card:   { width: "100%", height: "80px",  borderRadius: "10px" },
    line:   { width: "100%", height: "12px",  borderRadius: "6px"  },
    circle: { width: "48px", height: "48px",  borderRadius: "50%"  },
  };

  const base = defaults[variant] || defaults.card;

  const skeletonStyle = {
    display: "inline-block",
    width:  width  || base.width,
    height: height || base.height,
    borderRadius: base.borderRadius,
    background:
      "linear-gradient(90deg, #02275b 25%, #02356e 50%, #02275b 75%)",
    backgroundSize: "200% 100%",
    animation: "skeletonShimmer 1.5s ease-in-out infinite",
    flexShrink: 0,
    ...style,
  };

  return (
    <>
      <style>{`
        @keyframes skeletonShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={skeletonStyle} />
      ))}
    </>
  );
}

/**
 * SkeletonCard — convenience wrapper for a full card skeleton
 * with a shimmer image area + a few lines of text below.
 */
export function SkeletonCard({ height = "200px" }) {
  return (
    <div
      style={{
        background: "#00193b",
        border: "1px solid #02275b",
        borderRadius: "10px",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <SkeletonLoader variant="card" height={height} style={{ borderRadius: 0 }} />
      <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <SkeletonLoader variant="line" width="70%" />
        <SkeletonLoader variant="line" width="90%" />
        <SkeletonLoader variant="line" width="50%" />
      </div>
    </div>
  );
}

/**
 * SkeletonSkillCard — for the skills grid
 */
export function SkeletonSkillCard() {
  return (
    <div
      style={{
        background: "#00193b",
        border: "1px solid #02275b",
        borderRadius: "10px",
        padding: "10px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <SkeletonLoader variant="circle" width="32px" height="32px" />
      <SkeletonLoader variant="line" width="60%" height="10px" />
    </div>
  );
}