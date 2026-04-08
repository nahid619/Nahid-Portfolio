// components/shared/SectionHeader.js
/**
 * SectionHeader
 * The centered title + subtitle pattern used above every section.
 *
 * Props:
 *   title    — main heading (e.g. "Skills")
 *   subtitle — smaller line below (e.g. "My technical level")
 *   align    — "center" | "left" (default: "center")
 */
export default function SectionHeader({ title, subtitle, align = "center" }) {
  const isLeft = align === "left";

  return (
    <div
      className="section-header"
      style={{
        textAlign: isLeft ? "left" : "center",
        marginBottom: "2rem",
      }}
    >
      <h2
        style={{
          color: "#ffffff",
          fontSize: "clamp(1.5rem, 3vw, 2rem)",
          fontWeight: 700,
          margin: 0,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>

      {subtitle && (
        <span
          style={{
            display: "block",
            color: "#bcc4ba",
            fontSize: "0.813rem",
            marginTop: "0.35rem",
            letterSpacing: "0.02em",
          }}
        >
          {subtitle}
        </span>
      )}

      {/* Green accent underline */}
      <div
        style={{
          display: isLeft ? "block" : "inline-block",
          height: "2px",
          width: "48px",
          background: "linear-gradient(90deg, #00C896, #00A8FF)",
          borderRadius: "2px",
          marginTop: "10px",
          ...(isLeft ? {} : { marginLeft: "auto", marginRight: "auto" }),
        }}
      />
    </div>
  );
}