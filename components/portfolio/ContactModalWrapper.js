// components/portfolio/ContactModalWrapper.js
"use client";

import { useState, useEffect } from "react";
import ContactModal from "./ContactModal";

// This tiny client wrapper sits inside the server page.js
// It manages open/close state for the contact modal
// and registers a global trigger so HeroContactButton
// (also a client component) can open it via window.__openContactModal()

export default function ContactModalWrapper({ contactLinks }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Register the opener after hydration
    window.__openContactModal = () => setIsOpen(true);
    // Cleanup on unmount
    return () => { delete window.__openContactModal; };
  }, []);

  return (
    <ContactModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      contactLinks={contactLinks}
    />
  );
}
