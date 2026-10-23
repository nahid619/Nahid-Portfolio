// components/shared/useDialog.js
"use client";

import { useEffect, useRef } from "react";

/**
 * useDialog(isOpen, onClose) → ref for the dialog panel
 *
 * Shared by Modal and ExperienceModal so every popup behaves the same way:
 *   - body scroll lock while open
 *   - Escape closes
 *   - focus moves into the panel (the × button if it has data-modal-close)
 *   - Tab / Shift+Tab cycle inside the panel instead of escaping behind it
 *   - focus returns to whatever opened the dialog when it closes
 *
 * Callers pass inline arrows (() => setSelected(null)), so onClose gets a
 * new identity every render. It is kept in a ref so the effect only re-runs
 * when isOpen changes — otherwise focus would snap back to × on re-render.
 */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function useDialog(isOpen, onClose) {
  const panelRef   = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const opener = document.activeElement;
    document.body.style.overflow = "hidden";

    const raf = requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const target = panel.querySelector("[data-modal-close]") || panel;
      target.focus();
    });

    function handleKey(e) {
      if (e.key === "Escape") {
        onCloseRef.current?.();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const items = panelRef.current.querySelectorAll(FOCUSABLE);
      if (!items.length) return;
      const first = items[0];
      const last  = items[items.length - 1];

      if (e.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      if (opener && typeof opener.focus === "function") opener.focus({ preventScroll: true });
    };
  }, [isOpen]);

  return panelRef;
}
