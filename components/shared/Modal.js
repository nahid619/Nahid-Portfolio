// components/shared/Modal.js
"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * Modal
 * Generic dark overlay modal with:
 *   - scrollable content body
 *   - fixed footer for action buttons
 *   - × button absolutely pinned to top-right of panel (never overlaps content)
 *   - click-outside to close
 *   - Escape key to close
 *   - body scroll lock when open
 *   - createPortal so position:fixed works correctly inside transformed parents
 *
 * Props:
 *   isOpen   — boolean
 *   onClose  — () => void
 *   children — modal body content
 *   footer   — JSX for pinned footer buttons (optional)
 *   maxWidth — CSS max-width of modal panel (default "500px")
 */
export default function Modal({
  isOpen,
  onClose,
  children,
  footer,
  maxWidth = "500px",
}) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key closes modal
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Don't render on server or when closed
  if (!isOpen) return null;
  if (typeof window === "undefined") return null;

  const modal = (
    <>
      <style>{`
        .modal-scroll::-webkit-scrollbar { width: 4px; }
        .modal-scroll::-webkit-scrollbar-track { background: transparent; }
        .modal-scroll::-webkit-scrollbar-thumb { background: #059212; border-radius: 2px; }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* Overlay — full viewport, centered */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(1, 20, 40, 0.88)",
          zIndex: 9000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          animation: "overlayFadeIn 0.2s ease",
        }}
      >
        {/* Panel */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "relative",   /* ← needed for absolute × button */
            background: "#00193b",
            border: "1px solid #059212",
            borderRadius: "14px",
            width: "100%",
            maxWidth,
            maxHeight: "85vh",
            display: "flex",
            flexDirection: "column",
            animation: "modalFadeIn 0.25s ease",
            boxShadow: "0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(5,146,18,0.2)",
          }}
        >
          {/* × button — absolutely pinned to top-right of panel, never scrolls */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              zIndex: 10,
              background: "rgba(2,39,91,0.85)",
              border: "1px solid #02275b",
              color: "#bcc4ba",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              cursor: "pointer",
              fontSize: "16px",
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#059212"; e.currentTarget.style.color = "white"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#02275b"; e.currentTarget.style.color = "#bcc4ba"; }}
          >
            ×
          </button>

          {/* Scrollable body — padding-top gives room so content doesn't hide under × */}
          <div
            className="modal-scroll"
            style={{
              overflowY: "auto",
              flex: 1,
              padding: "20px",
              paddingTop: "48px",
            }}
          >
            {children}
          </div>

          {/* Pinned footer */}
          {footer && (
            <div
              style={{
                padding: "12px 20px",
                borderTop: "1px solid #02275b",
                display: "flex",
                gap: "10px",
                flexShrink: 0,
                background: "#00193b",
                borderRadius: "0 0 14px 14px",
              }}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );

  // Portal into document.body so position:fixed is always relative to the viewport,
  // not a transformed ancestor (SectionWrapper fade-in creates a stacking context)
  return createPortal(modal, document.body);
}