// components/portfolio/CertClient.js
//
// Certifications, in two variants:
//   variant="preview" (homepage) — the spotlight card, the next 3 certs by
//                                  display order, and a "See all" card that
//                                  links to /certifications. Mirrors how the
//                                  Projects and Experience sections preview.
//   variant="all" (/certifications) — the spotlight card plus every cert.
// Clicking any certificate opens the full-size viewer (CertModal).
//
// Replaces the old auto-rotating carousel, which assumed 3 visible cards when
// ~5 fit at desktop width (sliding up to 468px into empty space), advanced
// every 3s with no pause control, and cropped the certificates.
//
// Data stays a prop — no fetching here.

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TechBadge, NavProgress } from "@/components/shared";
import CertModal from "./CertModal";
import { formatIssueDate, CertPlaceholder, splitFeatured } from "./certUtils";

// 3 tiles + the "See all" card = exactly one row of the 4-column desktop grid
const PREVIEW_COUNT = 3;

export default function CertClient({ certifications = [], variant = "preview" }) {
  const [selected, setSelected] = useState(null);

  if (!certifications.length) return null;

  const { featured, rest } = splitFeatured(certifications);
  const isPreview   = variant === "preview";
  const shown       = isPreview ? rest.slice(0, PREVIEW_COUNT) : rest;
  const showSeeAll  = isPreview && rest.length > shown.length;

  return (
    <>
      <div className="cert-spotlights">
        {featured.map(cert => (
          <SpotlightCard key={cert._id} cert={cert} onOpen={() => setSelected(cert)} />
        ))}
      </div>

      {(shown.length > 0 || showSeeAll) && (
        <ul className="cert-grid" aria-label={isPreview ? "Selected certifications" : "All certifications"}>
          {shown.map(cert => (
            <li key={cert._id} style={{ display: "flex" }}>
              <CertTile cert={cert} onOpen={() => setSelected(cert)} />
            </li>
          ))}
          {showSeeAll && (
            <li style={{ display: "flex" }}>
              <Link href="/certifications" className="cert-see-all">
                <span aria-hidden="true" style={{ fontSize: "2rem", color: "#06D001", lineHeight: 1 }}>→</span>
                <span style={{ color: "#06D001", fontSize: "0.938rem", fontWeight: 700 }}>See all certifications</span>
                <span style={{ color: "#bcc4ba", fontSize: "0.75rem" }}>View all {certifications.length}</span>
                <NavProgress label="Loading all certifications" />
              </Link>
            </li>
          )}
        </ul>
      )}

      <CertModal cert={selected} isOpen={!!selected} onClose={() => setSelected(null)} />

      <style>{`
        .cert-spotlights { display: grid; gap: 16px; margin-bottom: 16px; }

        .cert-spot {
          display: grid;
          grid-template-columns: minmax(0, 460px) minmax(0, 1fr);
          background: #00193b;
          border: 1px solid #059212;
          border-radius: 14px;
          overflow: hidden;
          text-align: left;
        }
        .cert-spot-stage {
          position: relative;
          display: block;
          width: 100%;
          aspect-ratio: 1.414 / 1;
          background: #011428;
          border: none;
          border-right: 1px solid #02275b;
          padding: 0;
          cursor: zoom-in;
        }
        .cert-spot-body {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 10px;
          padding: clamp(18px, 3vw, 32px);
          min-width: 0;
        }
        .cert-spot-title {
          color: #ffffff;
          font-size: clamp(1.15rem, 2.2vw, 1.5rem);
          font-weight: 700;
          line-height: 1.3;
          margin: 0;
        }
        .cert-meta { margin: 0; font-size: 0.813rem; color: #bcc4ba; line-height: 1.5; }
        .cert-meta strong { color: #06D001; font-weight: 600; }
        .cert-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 6px; }
        .cert-btn {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 9px 18px;
          border-radius: 7px;
          font-size: 0.813rem; font-weight: 700;
          font-family: var(--font-poppins), Poppins, sans-serif;
          cursor: pointer;
          text-decoration: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .cert-btn-primary { background: linear-gradient(135deg, #059212, #06D001); color: #ffffff; border: none; }
        .cert-btn-ghost   { background: transparent; color: #06D001; border: 1px solid #059212; }
        .cert-btn-ghost:hover { background: #021f40; border-color: #06D001; }

        .cert-grid {
          list-style: none;
          margin: 0; padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }
        .cert-tile {
          display: flex;
          flex-direction: column;
          width: 100%;
          background: #00193b;
          border: 1px solid #02275b;
          border-radius: 10px;
          overflow: hidden;
          padding: 0;
          text-align: left;
          cursor: pointer;
          font-family: var(--font-poppins), Poppins, sans-serif;
          transition: border-color 0.2s;
        }
        .cert-tile:hover { border-color: #059212; }
        .cert-tile-stage {
          position: relative;
          width: 100%;
          aspect-ratio: 1.414 / 1;
          background: #011428;
          border-bottom: 1px solid #02275b;
          flex-shrink: 0;
        }
        .cert-tile-body { display: flex; flex-direction: column; gap: 6px; padding: 12px 14px 14px; flex: 1; }
        .cert-tile-title {
          color: #ffffff;
          font-size: 0.875rem;
          font-weight: 600;
          line-height: 1.4;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .cert-tile-badges { display: flex; flex-wrap: wrap; gap: 4px; margin-top: auto; padding-top: 4px; }

        .cert-see-all {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          min-height: 180px;
          padding: 24px 16px;
          text-align: center;
          text-decoration: none;
          background: #00193b;
          border: 2px dashed #059212;
          border-radius: 10px;
          transition: background 0.2s, border-color 0.2s;
        }
        .cert-see-all:hover { background: #021f40; border-color: #06D001; }

        @media (max-width: 760px) {
          .cert-spot { grid-template-columns: 1fr; }
          .cert-spot-stage { border-right: none; border-bottom: 1px solid #02275b; }
        }
        @media (max-width: 520px) {
          .cert-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
          .cert-tile-body { padding: 10px; }
          .cert-tile-title { font-size: 0.8rem; }
        }
      `}</style>
    </>
  );
}

// `as="span"` inside the tile, because a <button> may only hold phrasing content
function MetaLine({ cert, as: Tag = "p" }) {
  const date = formatIssueDate(cert.issueDate);
  if (!cert.issuer && !date) return null;
  return (
    <Tag className="cert-meta" style={Tag === "span" ? { display: "block" } : undefined}>
      {cert.issuer && <strong>{cert.issuer}</strong>}
      {cert.issuer && date && <br />}
      {date && <span>Issued {date}</span>}
    </Tag>
  );
}

function Badges({ skills = [], max }) {
  if (!skills.length) return null;
  const shown = skills.slice(0, max);
  return (
    <>
      {shown.map(s => <TechBadge key={s} label={s} />)}
      {skills.length > max && <TechBadge label={`+${skills.length - max}`} variant="outline" />}
    </>
  );
}

function SpotlightCard({ cert, onOpen }) {
  return (
    <article className="cert-spot" aria-label={cert.title}>
      <button
        type="button"
        className="cert-spot-stage"
        onClick={onOpen}
        aria-label={`View ${cert.title} certificate`}
      >
        {cert.imageUrl ? (
          <Image
            src={cert.imageUrl}
            alt=""
            fill
            style={{ objectFit: "contain", padding: "12px" }}
            sizes="(max-width: 760px) 100vw, 460px"
          />
        ) : (
          <CertPlaceholder size={56} />
        )}
      </button>

      <div className="cert-spot-body">
        <h3 className="cert-spot-title">{cert.title}</h3>
        <MetaLine cert={cert} />
        {cert.credentialId && (
          <p className="cert-meta">Credential ID <span style={{ color: "#ffffff", wordBreak: "break-all" }}>{cert.credentialId}</span></p>
        )}
        {cert.skills?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            <Badges skills={cert.skills} max={6} />
          </div>
        )}
        <div className="cert-actions">
          <button type="button" className="cert-btn cert-btn-primary" onClick={onOpen}>
            View certificate
          </button>
          {cert.credentialUrl && (
            <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="cert-btn cert-btn-ghost">
              Verify credential
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function CertTile({ cert, onOpen }) {
  return (
    <button
      type="button"
      className="cert-tile"
      onClick={onOpen}
      aria-label={`${cert.title} — view certificate`}
    >
      <span className="cert-tile-stage">
        {cert.imageUrl ? (
          <Image
            src={cert.imageUrl}
            alt=""
            fill
            style={{ objectFit: "contain", padding: "8px" }}
            sizes="(max-width: 520px) 50vw, 280px"
          />
        ) : (
          <CertPlaceholder />
        )}
      </span>
      <span className="cert-tile-body">
        <span className="cert-tile-title">{cert.title}</span>
        <MetaLine cert={cert} as="span" />
        {cert.skills?.length > 0 && (
          <span className="cert-tile-badges">
            <Badges skills={cert.skills} max={3} />
          </span>
        )}
      </span>
    </button>
  );
}
