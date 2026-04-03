// components/portfolio/Footer.js
"use client";

import Image from "next/image";
import { useFetch } from "@/hooks/useFetch";

const QUICK_LINKS = [
  { label: "Qualification", href: "#qualification" },
  { label: "Projects",      href: "#portfolio"     },
  { label: "Certifications",href: "#certification" },
  { label: "Contact",       href: "#contact"       },
];

export default function Footer() {
  // Only links with "footer" in their showIn array
  const { data: footerLinks } = useFetch("/api/social-links", { params: { location: "footer" } });

  return (
    <footer>
      <div style={{
        background: "linear-gradient(135deg, #059212 0%, #028f00 100%)",
        padding: "3rem 0 2rem",
      }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"0 1.5rem" }}>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"2rem", marginBottom:"2rem", alignItems:"start" }}>

            {/* Col 1 */}
            <div>
              <h2 style={{ color:"white", fontSize:"1.5rem", fontWeight:700, margin:"0 0 4px", letterSpacing:"-0.01em" }}>Nahid Hasan</h2>
              <p style={{ color:"rgba(255,255,255,0.8)", fontSize:"0.813rem", margin:0 }}>Salesforce Technical Consultant</p>
            </div>

            {/* Col 2 */}
            <div>
              <div style={{ color:"rgba(255,255,255,0.7)", fontSize:"0.75rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"12px" }}>Quick Links</div>
              <ul style={{ listStyle:"none", margin:0, padding:0, display:"flex", flexDirection:"column", gap:"8px" }}>
                {QUICK_LINKS.map(link => (
                  <li key={link.href}>
                    <a href={link.href} style={{ color:"white", fontSize:"0.875rem", textDecoration:"none", fontWeight:500, transition:"color 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#011428"}
                      onMouseLeave={e => e.currentTarget.style.color = "white"}
                    >{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — dynamic from DB */}
            <div>
              <div style={{ color:"rgba(255,255,255,0.7)", fontSize:"0.75rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"12px" }}>Find Me On</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
                {footerLinks?.map(link => (
                  <a key={link._id} href={link.url} target="_blank" rel="noopener noreferrer"
                    style={{
                      display:"inline-flex", alignItems:"center", gap:"6px",
                      background:"rgba(255,255,255,0.15)", color:"white",
                      padding:"5px 12px", borderRadius:"6px", fontSize:"0.813rem",
                      fontWeight:600, textDecoration:"none", transition:"background 0.2s",
                      overflow:"hidden",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.2)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                  >
                    {link.iconImageUrl ? (
                      <span style={{ width:"16px", height:"16px", position:"relative", display:"inline-block", flexShrink:0 }}>
                        <Image src={link.iconImageUrl} alt={link.name} fill style={{ objectFit:"contain" }} sizes="16px" />
                      </span>
                    ) : (
                      <span>{link.logo}</span>
                    )}
                    <span>{link.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div style={{ borderTop:"1px solid rgba(255,255,255,0.2)", paddingTop:"1.25rem", textAlign:"center", color:"rgba(255,255,255,0.7)", fontSize:"0.813rem" }}>
            © {new Date().getFullYear()} Nahid Hasan. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}