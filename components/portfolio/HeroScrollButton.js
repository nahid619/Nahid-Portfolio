// components/portfolio/HeroScrollButton.js
// "use client" — needs onClick for smooth scroll
// Extracted from HeroSection so HeroSection can stay a server component

"use client";

import { smoothScrollTo } from "@/lib/smoothScroll";

export default function HeroScrollButton() {
  function handleClick(e) {
    e.preventDefault();
    const el = document.getElementById("about");
    if (el) {
      smoothScrollTo(el.getBoundingClientRect().top + window.scrollY - 70, 800);
    }
  }

  return (
    <>
      <style>{`
        @keyframes scrollBounce {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(6px); }
        }
        .hero-scroll-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: #bcc4ba;
          font-size: 0.75rem;
          text-decoration: none;
          animation: scrollBounce 2s ease-in-out infinite;
        }
      `}</style>

      <a href="#about" onClick={handleClick} className="hero-scroll-btn">
        <span>Scroll</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059212" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <polyline points="19 12 12 19 5 12"/>
        </svg>
      </a>
    </>
  );
}
