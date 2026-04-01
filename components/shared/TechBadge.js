/**
 * TechBadge
 * Small colored pill/tag for tech stack, skills, etc.
 *
 * Props:
 *   label   — text to display
 *   variant — "default" | "outline" | "lime"
 *             default: dark green bg + lime text
 *             outline: transparent bg + green border + green text
 *             lime:    lime bg + dark text (for highlights)
 */
export default function TechBadge({ label, variant = "default" }) {
  const variants = {
    default: {
      background: "#0e3501",
      color: "#9BEC00",
      border: "1px solid transparent",
    },
    outline: {
      background: "transparent",
      color: "#06D001",
      border: "1px solid #059212",
    },
    lime: {
      background: "#9BEC00",
      color: "#011428",
      border: "1px solid transparent",
    },
  };

  const style = variants[variant] || variants.default;

  return (
    <span
      style={{
        display: "inline-block",
        ...style,
        fontSize: "0.7rem",
        fontWeight: 500,
        padding: "3px 8px",
        borderRadius: "4px",
        letterSpacing: "0.02em",
        fontFamily: "var(--font-poppins), Poppins, sans-serif",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}