// components/portfolio/CertModal.js
// Full-size certificate viewer. Built on the shared Modal so it gets the
// same overlay, × button, Escape-to-close, scroll lock and focus handling
// as ProjectModal.
"use client";

import Image from "next/image";
import { Modal, TechBadge } from "@/components/shared";
import { formatIssueDate, CertPlaceholder } from "./certUtils";

const primaryBtn = {
  flex: 1,
  background: "linear-gradient(135deg, #059212, #06D001)",
  color: "white",
  borderRadius: "7px",
  padding: "10px",
  fontSize: "0.875rem",
  fontWeight: 700,
  textAlign: "center",
  textDecoration: "none",
};

const secondaryBtn = {
  ...primaryBtn,
  background: "transparent",
  border: "1px solid #059212",
  color: "#06D001",
};

export default function CertModal({ cert, isOpen, onClose }) {
  if (!cert) return null;

  const date = formatIssueDate(cert.issueDate);

  const footer = (cert.credentialUrl || cert.imageUrl) ? (
    <>
      {cert.credentialUrl && (
        <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" style={primaryBtn}>
          Verify credential
        </a>
      )}
      {cert.imageUrl && (
        <a href={cert.imageUrl} target="_blank" rel="noopener noreferrer" style={cert.credentialUrl ? secondaryBtn : primaryBtn}>
          Open full size
        </a>
      )}
    </>
  ) : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="880px" footer={footer} label={cert.title}>
      {/* Certificate — contain, never cropped, so the small print stays readable */}
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1.414 / 1",
        maxHeight: "60vh",
        background: "#011428",
        border: "1px solid #02275b",
        borderRadius: "8px",
        overflow: "hidden",
        marginBottom: "18px",
      }}>
        {cert.imageUrl ? (
          <Image
            src={cert.imageUrl}
            alt={`${cert.title} certificate`}
            fill
            style={{ objectFit: "contain", padding: "8px" }}
            sizes="(max-width: 900px) 100vw, 880px"
          />
        ) : (
          <CertPlaceholder size={56} />
        )}
      </div>

      <h3 style={{ color: "white", fontSize: "1.15rem", fontWeight: 700, margin: "0 0 6px", lineHeight: 1.35 }}>
        {cert.title}
      </h3>

      {(cert.issuer || date) && (
        <p style={{ margin: "0 0 14px", fontSize: "0.875rem", color: "#bcc4ba" }}>
          {cert.issuer && <span style={{ color: "#06D001", fontWeight: 600 }}>{cert.issuer}</span>}
          {cert.issuer && date && <span aria-hidden="true">{"  ·  "}</span>}
          {date && <span>Issued {date}</span>}
        </p>
      )}

      {cert.credentialId && (
        <p style={{ margin: "0 0 14px", fontSize: "0.813rem", color: "#bcc4ba" }}>
          Credential ID{" "}
          <span style={{ color: "white", fontWeight: 600, wordBreak: "break-all" }}>{cert.credentialId}</span>
        </p>
      )}

      {cert.skills?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {cert.skills.map(s => <TechBadge key={s} label={s} />)}
        </div>
      )}
    </Modal>
  );
}
