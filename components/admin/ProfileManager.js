"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useFetch } from "@/hooks/useFetch";
import {
  AdminSection, AdminForm, FormRow, FormField,
  AdminInput, AdminTextarea, AlertBox,
} from "./AdminUI";

export default function ProfileManager() {
  const { data: profile, loading, refetch } = useFetch("/api/profile");
  const [form, setForm]       = useState({});
  const [saving, setSaving]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg]         = useState({ type: "", text: "" });

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMsg({ type: "", text: "" });

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "nahid-portfolio/profile");
      fd.append("type", "image");
      // Pass old publicId for replacement if exists
      if (form.profileImagePublicId) {
        fd.append("oldPublicId", form.profileImagePublicId);
      }

      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Upload failed");

      // Save immediately so profile photo updates right away
      const newForm = { ...form, profileImageUrl: data.url, profileImagePublicId: data.publicId };
      setForm(newForm);

      const saveRes = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newForm),
      });
      if (!saveRes.ok) throw new Error("Photo uploaded but failed to save URL");

      setMsg({ type: "success", text: "Profile photo updated! It now shows in both the Hero and About sections." });
      refetch();
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: "", text: "" });
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: "success", text: "Profile saved! Changes are now live on your portfolio." });
        refetch();
      } else {
        setMsg({ type: "error", text: data.message || "Failed to save." });
      }
    } catch {
      setMsg({ type: "error", text: "Network error." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ color: "#bcc4ba", padding: "2rem" }}>Loading profile…</div>;

  return (
    <AdminSection title="Profile">
      <AlertBox type={msg.type} message={msg.text} />

      {/* ── Photo upload ───────────────────────── */}
      <div style={{ padding: "1rem 1.25rem", background: "#011428", border: "1px solid #02275b", borderRadius: "10px", marginBottom: "1.25rem" }}>
        <div style={{ color: "#9BEC00", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "10px" }}>
          Profile Photo
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          {/* Preview */}
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", overflow: "hidden", border: "2px solid #059212", background: "#00193b", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
            {form.profileImageUrl
              ? <Image src={form.profileImageUrl} alt="Profile" fill style={{ objectFit: "cover" }} sizes="72px" />
              : <span style={{ color: "#06D001", fontSize: "1.5rem", fontWeight: 700 }}>NH</span>
            }
          </div>
          <div>
            <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#02275b", color: "white", padding: "8px 16px", borderRadius: "6px", fontSize: "0.813rem", cursor: uploading ? "not-allowed" : "pointer", fontWeight: 600, opacity: uploading ? 0.7 : 1 }}>
              {uploading ? "Uploading…" : form.profileImageUrl ? "Replace Photo" : "Upload Photo"}
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} disabled={uploading} />
            </label>
            <p style={{ color: "#bcc4ba", fontSize: "0.75rem", marginTop: "5px" }}>
              Shows in <strong style={{ color: "white" }}>Hero section</strong> (blob area) and <strong style={{ color: "white" }}>About section</strong>. JPG, PNG or WebP.
              {form.profileImageUrl && " Uploading a new photo will automatically remove the old one."}
            </p>
          </div>
        </div>
      </div>

      {/* ── Form ───────────────────────────────── */}
      <AdminForm onSubmit={handleSubmit} loading={saving}>
        <FormRow>
          <FormField label="Full Name">
            <AdminInput value={form.name} onChange={set("name")} placeholder="Nahid Hasan" required />
          </FormField>
          <FormField label="Job Title">
            <AdminInput value={form.jobTitle} onChange={set("jobTitle")} placeholder="Salesforce Technical Consultant Level-1" required />
          </FormField>
        </FormRow>

        {/* Hero description — shown under role in Hero section */}
        <FormField label="Hero Description (shown in Home section under your role)">
          <AdminTextarea
            value={form.heroDescription}
            onChange={set("heroDescription")}
            placeholder="Short punchy description shown on the Hero section…"
            rows={3}
          />
        </FormField>

        {/* Bio — shown in About section */}
        <FormField label="About Section Bio (shown in About section)">
          <AdminTextarea
            value={form.bio}
            onChange={set("bio")}
            placeholder="Full bio shown in the About section…"
            rows={5}
          />
        </FormField>

        <FormRow>
          <FormField label="Email">
            <AdminInput value={form.email} onChange={set("email")} type="email" placeholder="you@email.com" />
          </FormField>
          <FormField label="Phone / WhatsApp Number">
            <AdminInput value={form.phone} onChange={set("phone")} placeholder="01756867148" />
          </FormField>
        </FormRow>
        <FormRow>
          <FormField label="WhatsApp Link">
            <AdminInput value={form.whatsappLink} onChange={set("whatsappLink")} placeholder="https://wa.me/880..." />
          </FormField>
          <FormField label="Location">
            <AdminInput value={form.location} onChange={set("location")} placeholder="Rajshahi, Bangladesh" />
          </FormField>
        </FormRow>
      </AdminForm>
    </AdminSection>
  );
}