"use client";

/**
 * ArrowNav
 * Left/right arrow navigation buttons.
 * Used in Experience strip and Certifications carousel.
 *
 * Props:
 *   onPrev        — () => void
 *   onNext        — () => void
 *   prevDisabled  — boolean (default false)
 *   nextDisabled  — boolean (default false)
 *   justify       — "center" | "flex-start" | "flex-end" (default "center")
 */
export default function ArrowNav({
  onPrev,
  onNext,
  prevDisabled = false,
  nextDisabled = false,
  justify = "center",
}) {
  const btnStyle = (disabled) => ({
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    background: "#00193b",
    border: `1px solid ${disabled ? "#02275b" : "#059212"}`,
    color: disabled ? "#3a4a3a" : "#06D001",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background 0.2s, border-color 0.2s, transform 0.15s",
    fontSize: "18px",
    lineHeight: 1,
    flexShrink: 0,
    opacity: disabled ? 0.4 : 1,
  });

  function handleHoverIn(e, disabled) {
    if (!disabled) {
      e.currentTarget.style.background = "#021f40";
      e.currentTarget.style.transform = "scale(1.05)";
    }
  }
  function handleHoverOut(e, disabled) {
    if (!disabled) {
      e.currentTarget.style.background = "#00193b";
      e.currentTarget.style.transform = "scale(1)";
    }
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        justifyContent: "center",
        marginTop: "14px",
      }}
    >
      <button
        onClick={onPrev}
        disabled={prevDisabled}
        style={btnStyle(prevDisabled)}
        aria-label="Previous"
        onMouseEnter={(e) => handleHoverIn(e, prevDisabled)}
        onMouseLeave={(e) => handleHoverOut(e, prevDisabled)}
      >
        ←
      </button>

      <button
        onClick={onNext}
        disabled={nextDisabled}
        style={btnStyle(nextDisabled)}
        aria-label="Next"
        onMouseEnter={(e) => handleHoverIn(e, nextDisabled)}
        onMouseLeave={(e) => handleHoverOut(e, nextDisabled)}
      >
        →
      </button>
    </div>
  );
}