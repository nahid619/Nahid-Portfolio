// components/portfolio/HeroContactButton.js
// Phase 3 — NEW FILE
//
// Why this exists:
// HeroSection is now a server component (no "use client").
// But the "Contact Me" button needs onClick to open the modal.
// So we extract JUST the button into this tiny client component.
// Everything else in HeroSection stays server-rendered.

"use client";

export default function HeroContactButton() {
  function handleClick() {
    // ContactModalWrapper (also client) registers this on window
    if (typeof window !== "undefined" && window.__openContactModal) {
      window.__openContactModal();
    }
  }

  return (
    <button
      onClick={handleClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        background: "linear-gradient(135deg, #059212, #06D001)",
        color: "white",
        border: "none",
        padding: "13px 28px",
        borderRadius: "8px",
        fontSize: "0.938rem",
        fontWeight: 700,
        fontFamily: "var(--font-poppins), Poppins, sans-serif",
        cursor: "pointer",
        boxShadow: "0 4px 20px rgba(5,146,18,0.35)",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 28px rgba(5,146,18,0.45)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(5,146,18,0.35)";
      }}
    >
      Contact Me
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.86A16 16 0 0 0 13 13.91l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 15.22z"/>
      </svg>
    </button>
  );
}
