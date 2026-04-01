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
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "nahid-portfolio/cv");
      fd.append("type", "cv");
      if (profile?.cvPublicId) {
        fd.append("oldPublicId", profile.cvPublicId);
      }

      const uploadRes  = await fetch("/api/upload", { method: "POST", body: fd });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) throw new Error(uploadData.message || "Upload failed");

      // Save URL + publicId to profile
      const saveRes = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profile,
          cvFileUrl:  uploadData.url,
          cvPublicId: uploadData.publicId,
        }),
      });

      if (!saveRes.ok) throw new Error("CV uploaded but failed to save URL to profile");

      setMsg({ type: "success", text: "CV uploaded successfully! The Download CV button on your portfolio now points to this file." });
      refetch();

      // Reset input so same file can be re-uploaded if needed
      e.target.value = "";
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setUploading(false);
    }
  }

  return (
    <AdminSection title="CV / Resume">
      <AlertBox type={msg.type} message={msg.text} />

      <div style={{ background: "#011428", border: "1px dashed #02275b", borderRadius: "12px", padding: "2.5rem 2rem", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>📄</div>

        {profile?.cvFileUrl ? (
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ color: "white", fontSize: "0.938rem", fontWeight: 700, marginBottom: "6px" }}>
              CV currently active
            </div>
            <a
              href={profile.cvFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#06D001", fontSize: "0.813rem", display: "inline-block", marginBottom: "6px", wordBreak: "break-all", maxWidth: "400px" }}
            >
              View current CV ↗
            </a>
            <div style={{ color: "#bcc4ba", fontSize: "0.75rem" }}>
              Uploading a new PDF will automatically remove the old one from Cloudinary.
            </div>
          </div>
        ) : (
          <div style={{ color: "#bcc4ba", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            No CV uploaded yet. Upload a PDF to enable the &quot;Download CV&quot; button on your portfolio.
          </div>
        )}

        <label
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: uploading ? "#028f00" : "linear-gradient(135deg,#059212,#06D001)",
            color: "white", padding: "11px 28px", borderRadius: "8px",
            fontSize: "0.875rem", fontWeight: 700,
            cursor: uploading ? "not-allowed" : "pointer",
            opacity: uploading ? 0.8 : 1,
            transition: "opacity 0.2s",
            boxShadow: "0 4px 16px rgba(5,146,18,0.3)",
          }}
        >
          {uploading ? (
            <>
              <span style={{ display: "inline-block", width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
              Uploading…
            </>
          ) : (
            profile?.cvFileUrl ? "Replace CV" : "Upload CV"
          )}
          <input
            type="file"
            accept="application/pdf"
            onChange={handleUpload}
            style={{ display: "none" }}
            disabled={uploading}
          />
        </label>

        <p style={{ color: "#bcc4ba", fontSize: "0.75rem", marginTop: "1rem" }}>
          PDF only · Max 10MB · Stored securely on Cloudinary
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AdminSection>
  );
}