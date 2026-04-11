// components/portfolio/ContactModal.js
"use client";

import Image from "next/image";
import { useFetch } from "@/hooks/useFetch";
import { Modal } from "@/components/shared";

export default function ContactModal({ isOpen, onClose, contactLinks = [] }) {
  // Only links with "contact-modal" in their showIn array
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="320px">
      <h2 style={{ color:"white", fontSize:"1.1rem", fontWeight:700, margin:"0 0 4px" }}>Get in touch</h2>
      <p style={{ color:"#bcc4ba", fontSize:"0.813rem", margin:"0 0 20px" }}>
        Choose how you&apos;d like to reach Nahid
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
        {(!contactLinks || contactLinks.length === 0) ? (
          <div style={{ color:"#bcc4ba", fontSize:"0.875rem", textAlign:"center", padding:"1rem" }}>
            No contact links configured. Add links in Admin → Social Links and check &quot;Contact modal&quot;.
          </div>
        ) : (
          contactLinks.map(link => (
            <a
              key={link._id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display:"flex", alignItems:"center", gap:"12px",
                background:"#02275b", border:"1px solid transparent",
                borderRadius:"9px", padding:"10px 12px",
                textDecoration:"none", transition:"border-color 0.2s,background 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#06D001"; e.currentTarget.style.background = "#021f40"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.background = "#02275b"; }}
            >
              <div style={{
                width:"36px", height:"36px", borderRadius:"8px",
                background:"rgba(5,146,18,0.2)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"14px", fontWeight:700, color:"white",
                flexShrink:0, overflow:"hidden", position:"relative",
              }}>
                {link.iconImageUrl ? (
                  <Image src={link.iconImageUrl} alt={link.name} fill style={{ objectFit:"contain" }} sizes="36px" />
                ) : (
                  <span>{link.logo}</span>
                )}
              </div>
              <div>
                <div style={{ color:"white", fontSize:"0.875rem", fontWeight:600 }}>{link.name}</div>
                <div style={{ color:"#bcc4ba", fontSize:"0.75rem", maxWidth:"200px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{link.url}</div>
              </div>
            </a>
          ))
        )}
      </div>
    </Modal>
  );
}