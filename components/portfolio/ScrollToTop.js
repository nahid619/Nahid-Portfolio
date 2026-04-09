// components/portfolio/ScrollToTop.js
"use client";

import { useState, useEffect } from "react";
import { smoothScrollTo } from "@/lib/smoothScroll";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => smoothScrollTo(0, 800)}
      className="scroll-top-btn"
      aria-label="Scroll to top"
      title="Back to top"
    >
      ↑
    </button>
  );
}

