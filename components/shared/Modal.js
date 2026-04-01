"use client";

import { useEffect } from "react";

/**
 * Modal
 * Generic dark overlay modal with:
 *   - scrollable content body
 *   - fixed footer for action buttons
 *   - click-outside to close
 *   - Escape key to close
 *   - body scroll lock when open
 *
 * Props:
 *   isOpen   — boolean
 *   onClose  — () => void
 *   children — modal body content
 *   footer   — JSX for pinned footer buttons (optional)
 *   maxWidth — CSS max-width of modal panel (default "500px")
 *   title    — optional title shown at top of scrollable area
 */
export default function Modal({
  isOpen,
  onClose,
  children,
  footer,
  maxWidth = "500px",
  title,
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

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .modal-scroll::-webkit-scrollbar { width: 4px; }
        .modal-scroll::-webkit-scrollbar-track { background: transparent; }
        .modal-scroll::-webkit-scrollbar-thumb { background: #059212; border-radius: 2px; }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(1, 20, 40, 0.88)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          animation: "overlayFadeIn 0.2s ease",
        }}
      >
        {/* Panel — stop click propagation so clicking inside doesn't close */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
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
          {/* Scrollable body */}
          <div
            className="modal-scroll"
            style={{
              overflowY: "auto",
              flex: 1,
              padding: "20px",
            }}
          >
            {/* Optional close button top-right */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: title ? "4px" : "0" }}>
              <button
                onClick={onClose}
                style={{
                  background: "rgba(2,39,91,0.7)",
                  border: "none",
                  color: "#bcc4ba",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  cursor: "pointer",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            {children}
          </div>

          {/* Fixed footer */}
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
}