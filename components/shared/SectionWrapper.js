"use client";

import { useEffect, useRef, useState } from "react";

/**
 * SectionWrapper
 * Wraps every section with consistent padding and a
 * fade-in-from-bottom animation when it enters the viewport.
 *
 * Props:
 *   id        — section anchor id (e.g. "skills")
 *   className — extra Tailwind classes
 *   delay     — animation delay in ms (default 0)
 *   children
 */
export default function SectionWrapper({
  id,
  className = "",
  delay = 0,
  children,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // animate once only
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className={`section-wrapper ${className}`}
      style={{
        padding: "5rem 0 3rem",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </section>
  );
}