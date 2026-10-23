// components/shared/CardButton.js
"use client";

/**
 * CardButton
 * The project and experience cards open a modal on click, but they were
 * plain <div>s — keyboard users couldn't reach them and screen readers
 * didn't announce them as interactive.
 *
 * Wrapping each card's title in a real <button> fixes that without turning
 * the whole card into a button (some cards contain GitHub / Live links, and
 * a link inside a button is invalid). The card keeps its onClick for mouse
 * users; this button stops propagation so the handler only runs once.
 * Cards add className "kb-card" so the whole card highlights on focus.
 */
export default function CardButton({ onClick, children, style, label }) {
  return (
    <button
      type="button"
      className="card-btn"
      aria-label={label}
      aria-haspopup="dialog"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      style={style}
    >
      {children}
    </button>
  );
}
