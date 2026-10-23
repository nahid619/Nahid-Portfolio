// components/portfolio/ContactSection.js
// "use client" needed — inputs use onFocus/onBlur, send button uses onMouseEnter/onMouseLeave
"use client";

import { SectionWrapper, SectionHeader } from "@/components/shared";

const EMAIL = "nahidhasan00619@gmail.com";

// The old "Send Message" button was a fixed mailto: link, so whatever the
// visitor typed into Name / Email / Message was thrown away and their mail
// app opened with "Write your message here...". Now the form builds the
// mailto: from what they actually typed.
function handleSubmit(e) {
  e.preventDefault();
  const data    = new FormData(e.currentTarget);
  const name    = String(data.get("name")    || "").trim();
  const email   = String(data.get("email")   || "").trim();
  const message = String(data.get("message") || "").trim();

  const subject = name ? `Portfolio enquiry from ${name}` : "Portfolio enquiry";
  const sign    = [name, email].filter(Boolean).join("\n");
  const body    = sign ? `${message}\n\n${sign}` : message;

  window.location.href =
    `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const INFO_ITEMS = [
  {
    icon: "💬",
    title: "WhatsApp",
    value: "01756867148",
    href: "https://wa.me/8801756867148",
  },
  {
    icon: "✉",
    title: "Email",
    value: EMAIL,
    href: `mailto:${EMAIL}`,
  },
  {
    icon: "📍",
    title: "Location",
    value: "Darusha, Kornohar, Paba, Rajshahi-6210, Bangladesh",
    href: null,
  },
];

export default function ContactSection() {
  return (
    <SectionWrapper id="contact">
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        <SectionHeader title="Contact Me" subtitle="Get in touch" />

        <div
          className="contact-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(1.5rem, 4vw, 3rem)",
          }}
        >
          {/* Left: contact info */}
          <div>
            {INFO_ITEMS.map(item => (
              <div
                key={item.title}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                  marginBottom: "1.5rem",
                  textAlign: "left",
                }}
              >
                <div style={{
                  width: "44px", height: "44px",
                  background: "#00193b",
                  border: "1px solid #02275b",
                  borderRadius: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px", flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ color: "#06D001", fontSize: "0.813rem", fontWeight: 600, marginBottom: "3px" }}>
                    {item.title}
                  </div>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#bcc4ba", fontSize: "0.875rem", textDecoration: "none", lineHeight: 1.5 }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span style={{ color: "#bcc4ba", fontSize: "0.875rem", lineHeight: 1.5 }}>
                      {item.value}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right: message form */}
          <form onSubmit={handleSubmit} aria-label="Send a message" style={{
            background: "#00193b",
            border: "1px solid #02275b",
            borderRadius: "12px",
            padding: "1.5rem",
          }}>
            <div className="contact-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <FormField id="contact-name"  name="name"  label="Name"  type="text"  placeholder="Your name" autoComplete="name" required />
              <FormField id="contact-email" name="email" label="Email" type="email" placeholder="your@email.com" autoComplete="email" />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label htmlFor="contact-message" style={{
                color: "#9BEC00", fontSize: "0.75rem", fontWeight: 600,
                display: "block", marginBottom: "6px",
                letterSpacing: "0.05em", textTransform: "uppercase",
              }}>
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                placeholder="Your message..."
                rows={5}
                style={{
                  width: "100%",
                  background: "#011428",
                  border: "1px solid #02275b",
                  borderRadius: "7px",
                  padding: "10px 12px",
                  color: "white",
                  fontSize: "0.875rem",
                  fontFamily: "var(--font-poppins), Poppins, sans-serif",
                  resize: "vertical",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={e  => (e.target.style.borderColor = "#059212")}
                onBlur={e   => (e.target.style.borderColor = "#02275b")}
              />
            </div>

            <button
              type="submit"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                width: "100%",
                background: "linear-gradient(135deg, #059212, #06D001)",
                color: "white",
                padding: "11px 24px",
                borderRadius: "7px",
                fontSize: "0.875rem",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-poppins), Poppins, sans-serif",
                boxShadow: "0 4px 16px rgba(5,146,18,0.3)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
            >
              Send Message
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
            <p style={{ color: "#bcc4ba", fontSize: "0.75rem", marginTop: "10px", textAlign: "center", opacity: 0.8 }}>
              Opens your email app with this message filled in.
            </p>
          </form>
        </div>
      </div>
    </SectionWrapper>
  );
}

function FormField({ id, name, label, type, placeholder, autoComplete, required }) {
  return (
    <div>
      <label htmlFor={id} style={{
        color: "#9BEC00", fontSize: "0.75rem", fontWeight: 600,
        display: "block", marginBottom: "6px",
        letterSpacing: "0.05em", textTransform: "uppercase",
      }}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        style={{
          width: "100%",
          background: "#011428",
          border: "1px solid #02275b",
          borderRadius: "7px",
          padding: "10px 12px",
          color: "white",
          fontSize: "0.875rem",
          fontFamily: "var(--font-poppins), Poppins, sans-serif",
          outline: "none",
          transition: "border-color 0.2s",
        }}
        onFocus={e => (e.target.style.borderColor = "#059212")}
        onBlur={e  => (e.target.style.borderColor = "#02275b")}
      />
    </div>
  );
}
