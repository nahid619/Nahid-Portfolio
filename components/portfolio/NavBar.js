// components/portfolio/NavBar.js
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { smoothScrollTo } from "@/lib/smoothScroll";

const NAV_LINKS = [
  { label: "Home",           href: "#home"          },
  { label: "About",          href: "#about"         },
  { label: "Experience",     href: "#experience"    },
  { label: "Skills",         href: "#skills"        },
  { label: "Qualification",  href: "#qualification" },
  { label: "Projects",       href: "#portfolio"     },
  { label: "Certifications", href: "#certification" },
  { label: "Contact",        href: "#contact"       },
];

const HEADER_OFFSET = 70;

// navLinks comes as a prop from page.js — no more useFetch
export default function NavBar({ navLinks = [] }) {
  const [scrolled,      setScrolled] = useState(false);
  const [menuOpen,      setMenuOpen] = useState(false);
  const [activeSection, setActive  ] = useState("home");

  // True while a programmatic scroll is running. The IntersectionObserver
  // below fires for every section we fly past during the 800ms animation,
  // which made the green highlight strobe across the nav. We freeze the
  // active state for the duration of the animation instead.
  const scrollingRef = useRef(false);

  // handleNavClick lives inside the component now so it can reach
  // scrollingRef and setActive.
  function handleNavClick(e, href) {
    e.preventDefault();
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

    scrollingRef.current = true;
    setActive(id); // highlight the destination immediately

    smoothScrollTo(top, 800, () => {
      scrollingRef.current = false;
    });
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      entries => {
        if (scrollingRef.current) return; // don't fight a programmatic scroll
        entries.forEach(e => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-15% 0px -85% 0px", threshold: 0 }
    );
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .nav-link { color:#bcc4ba; font-size:0.813rem; font-weight:500; text-decoration:none; padding:4px 2px; transition:color 0.2s; white-space:nowrap; }
        .nav-link:hover { color:#ffffff; }
        .nav-link.active { color:#06D001; font-weight:700; }
        .nav-brand { color:#ffffff; font-weight:700; font-size:1.1rem; text-decoration:none; flex-shrink:0; letter-spacing:-0.01em; white-space:nowrap; cursor:pointer; }
        .nav-social-btn { width:32px; height:32px; background:#02275b; border:1px solid #02275b; border-radius:7px; display:flex; align-items:center; justify-content:center; color:#06D001; font-weight:700; font-size:11px; cursor:pointer; text-decoration:none; transition:background 0.2s,border-color 0.2s; flex-shrink:0; overflow:hidden; position:relative; }
        .nav-social-btn:hover { background:#021f40; border-color:#059212; }
        .hamburger { display:none; flex-direction:column; gap:5px; cursor:pointer; background:none; border:none; padding:4px; }
        .hamburger span { display:block; width:22px; height:2px; background:#bcc4ba; border-radius:2px; transition:all 0.3s; }

        /* Breakpoint moved 900 -> 960: the longer "Nahid.Hasan" brand plus
           eight nav links plus two social buttons no longer fits at 900px. */
        @media (max-width:960px) { .nav-links-desktop { display:none !important; } .hamburger { display:flex !important; } }
        @media (min-width:961px) { .nav-menu-mobile { display:none !important; } }
        @media (max-width:1080px) and (min-width:961px) {
          .nav-links-desktop { gap:0.9rem !important; }
          .nav-link { font-size:0.75rem !important; }
        }
      `}</style>

      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
        background: scrolled ? "rgba(1,20,40,0.97)" : "rgba(1,20,40,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${scrolled ? "#02275b" : "transparent"}`,
        transition: "background 0.3s,border-color 0.3s,box-shadow 0.3s",
        boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.3)" : "none",
      }}>
        <nav style={{
          maxWidth: "1200px", margin: "0 auto",
          padding: "0 1.5rem", height: "64px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: "1rem",
        }}>

          {/*
            Logo. The onClick was missing here, so this was the only link in
            the nav that fell through to a native hash jump — instant teleport
            instead of the 800ms animation every other link gets, and no
            70px header offset either.
          */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, "#home")}
            className="nav-brand"
            aria-label="Nahid Hasan — back to top"
          >
            Nahid<span style={{ color: "#06D001" }}>.</span>Hasan
          </a>

          {/* Desktop nav links */}
          <div
            className="nav-links-desktop"
            style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}
          >
            {NAV_LINKS.map(link => {
              const id = link.href.replace("#", "");
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`nav-link ${activeSection === id ? "active" : ""}`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Right side: social icons + hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            {navLinks.map(link => (
              <a
                key={link._id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-social-btn"
                title={link.name}
              >
                {link.iconImageUrl ? (
                  <Image
                    src={link.iconImageUrl}
                    alt={link.name}
                    fill
                    style={{ objectFit: "contain" }}
                    sizes="32px"
                  />
                ) : (
                  <span>{link.logo}</span>
                )}
              </a>
            ))}

            <button
              className="hamburger"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
              <span style={{ opacity: menuOpen ? 0 : 1 }} />
              <span style={{ transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
            </button>
          </div>
        </nav>

        {/* Mobile dropdown menu */}
        <div
          className="nav-menu-mobile"
          style={{
            display: menuOpen ? "flex" : "none",
            flexDirection: "column",
            background: "#00193b",
            borderTop: "1px solid #02275b",
            padding: "1rem 1.5rem 1.5rem",
            gap: "4px",
          }}
        >
          {NAV_LINKS.map(link => {
            const id = link.href.replace("#", "");
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { handleNavClick(e, link.href); setMenuOpen(false); }}
                className={`nav-link ${activeSection === id ? "active" : ""}`}
                style={{
                  fontSize: "1rem",
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(13,45,94,0.5)",
                  textAlign: "center",
                  display: "block",
                }}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      </header>

      <div style={{ height: "64px" }} />
    </>
  );
}