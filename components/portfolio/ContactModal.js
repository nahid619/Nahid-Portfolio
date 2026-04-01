"use client";

import { useFetch } from "@/hooks/useFetch";
import { Modal } from "@/components/shared";

const STATIC_OPTIONS = [
  {
    name: "WhatsApp",
    url: "https://wa.me/8801756867148",
    hint: "01756867148 — opens WhatsApp directly",
    bg: "#128c7e",
    emoji: "💬",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/nahid-hasan-0274881a7/",
    hint: "View professional profile & connect",
    bg: "#0a66c2",
    emoji: "in",
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/nahidhasan987",
    hint: "View Facebook profile",
    bg: "#1877f2",
    emoji: "fb",
  },
  {
    name: "Email",
    url: "mailto:nahidhasan00619@gmail.com?subject=Hello Nahid",
    hint: "nahidhasan00619@gmail.com",
    bg: "#c0392b",
    emoji: "✉",
  },
];

export default function ContactModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="320px">
      <h2 style={{ color: "white", fontSize: "1.1rem", fontWeight: 700, margin: "0 0 4px" }}>
        Get in touch
      </h2>
      <p style={{ color: "#bcc4ba", fontSize: "0.813rem", margin: "0 0 20px" }}>
        Choose how you&apos;d like to reach Nahid
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {STATIC_OPTIONS.map((opt) => (
          <a
            key={opt.name}
            href={opt.url}
            target={opt.name === "Email" ? "_self" : "_blank"}
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "#02275b",
              border: "1px solid transparent",
              borderRadius: "9px",
              padding: "10px 12px",
              textDecoration: "none",
              transition: "border-color 0.2s, background 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#06D001";
              e.currentTarget.style.background = "#021f40";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "transparent";
              e.currentTarget.style.background = "#02275b";
            }}
          >
            <div
              style={{
                width: "36px", height: "36px",
                borderRadius: "8px",
                background: opt.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px", fontWeight: 700, color: "white",
                flexShrink: 0,
              }}
            >
              {opt.emoji}
            </div>
            <div>
              <div style={{ color: "white", fontSize: "0.875rem", fontWeight: 600 }}>
                {opt.name}
              </div>
              <div style={{ color: "#bcc4ba", fontSize: "0.75rem" }}>
                {opt.hint}
              </div>
            </div>
          </a>
        ))}
      </div>
    </Modal>
  );
}