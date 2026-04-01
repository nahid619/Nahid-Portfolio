"use client";

import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { AdminSection, AlertBox } from "./AdminUI";

export default function CVManager() {
  const { data: profile, refetch } = useFetch("/api/profile");
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setMsg({ type: "error", text: "Only PDF files are allowed." });
      return;
    }

    setUploading(true);
    setMsg({ type: "", text: "" });

    try {
      // 1. Upload to Cloudinary
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "nahid-portfolio/cv");
      fd.append("type", "cv");
      const uploadRes  = await fetch("/api/upload", { method: "POST", body: fd });
      const uploadData = await uploadRes.json();

      if (!uploadData.url) throw new Error("Upload failed");

      // 2. Save URL back to profile
      const saveRes = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profile, cvFileUrl: uploadData.url }),
      });

      if (saveRes.ok) {
        setMsg({ type: "success", text: "CV uploaded and saved successfully! The Download CV button on your portfolio now points to this file." });
        refetch();
      } else {
        throw new Error("Failed to save URL");
      }
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Something went wrong." });
    } finally {
      setUploading(false);
    }
  }

  return (
    <AdminSection title="CV / Resume">
      <AlertBox type={msg.type} message={msg.text} />

      <div style={{ background: "#011428", border: "1px dashed #02275b", borderRadius: "12px", padding: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>📄</div>

        {profile?.cvFileUrl ? (
          <>
            <div style={{ color: "white", fontSize: "0.938rem", fontWeight: 700, marginBottom: "4px" }}>
              CV currently uploaded
            </div>
            <a
              href={profile.cvFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#06D001", fontSize: "0.813rem", display: "block", marginBottom: "1.25rem", wordBreak: "break-all" }}
            >
              {profile.cvFileUrl}
            </a>
          </>
        ) : (
          <div style={{ color: "#bcc4ba", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
            No CV uploaded yet. Upload a PDF to enable the Download CV button on your portfolio.
          </div>
        )}

        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "linear-gradient(135deg, #059212, #06D001)",
            color: "white",
            padding: "10px 24px",
            borderRadius: "8px",
            fontSize: "0.875rem",
            fontWeight: 700,
            cursor: uploading ? "not-allowed" : "pointer",
            opacity: uploading ? 0.7 : 1,
            transition: "opacity 0.2s",
          }}
        >
          {uploading ? "Uploading…" : profile?.cvFileUrl ? "Replace CV" : "Upload CV"}
          <input
            type="file"
            accept="application/pdf"
            onChange={handleUpload}
            style={{ display: "none" }}
            disabled={uploading}
          />
        </label>

        <p style={{ color: "#bcc4ba", fontSize: "0.75rem", marginTop: "1rem" }}>
          PDF only. File will be stored on Cloudinary and the URL saved to your profile automatically.
        </p>
      </div>
    </AdminSection>
  );
}