"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useFetch } from "@/hooks/useFetch";
import { AdminSection, AdminForm, FormRow, FormField, AdminInput, AdminTextarea, AlertBox } from "./AdminUI";

export default function ProfileManager() {
  const { data: profile, loading, refetch } = useFetch("/api/profile");
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

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
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "nahid-portfolio/profile");
      fd.append("type", "image");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        setForm(f => ({ ...f, profileImageUrl: data.url }));
        setMsg({ type: "success", text: "Photo uploaded!" });
      }
    } catch {
      setMsg({ type: "error", text: "Upload failed." });
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
      if (res.ok) {
        setMsg({ type: "success", text: "Profile saved successfully!" });
        refetch();
      } else {
        setMsg({ type: "error", text: "Failed to save profile." });
      }
    } catch {
      setMsg({ type: "error", text: "Something went wrong." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ color: "#bcc4ba" }}>Loading profile…</div>;

  return (
    <AdminSection title="Profile">
      <AlertBox type={msg.type} message={msg.text} />

      {/* Photo upload */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "1.25rem", padding: "1rem", background: "#011428", borderRadius: "10px", border: "1px solid #02275b" }}>
        <div style={{ width: "72px", height: "72px", borderRadius: "50%", overflow: "hidden", border: "2px solid #059212", background: "#00193b", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
          {form.profileImageUrl
            ? <Image src={form.profileImageUrl} alt="Profile" fill style={{ objectFit: "cover" }} sizes="72px" />
            : <span style={{ color: "#06D001", fontSize: "1.5rem", fontWeight: 700 }}>NH</span>
          }
        </div>
        <div>
          <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#02275b", color: "white", padding: "7px 14px", borderRadius: "6px", fontSize: "0.813rem", cursor: "pointer", fontWeight: 600 }}>
            {uploading ? "Uploading…" : "Upload Photo"}
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} disabled={uploading} />
          </label>
          <p style={{ color: "#bcc4ba", fontSize: "0.75rem", margin: "6px 0 0" }}>JPG, PNG or WebP. Will be stored on Cloudinary.</p>
        </div>
      </div>

      <AdminForm onSubmit={handleSubmit} loading={saving}>
        <FormRow>
          <FormField label="Full Name">
            <AdminInput value={form.name} onChange={set("name")} placeholder="Nahid Hasan" required />
          </FormField>
          <FormField label="Job Title">
            <AdminInput value={form.jobTitle} onChange={set("jobTitle")} placeholder="Salesforce Technical Consultant" required />
          </FormField>
        </FormRow>
        <FormField label="Bio">
          <AdminTextarea value={form.bio} onChange={set("bio")} placeholder="Write your bio..." rows={5} />
        </FormField>
        <FormRow>
          <FormField label="Email">
            <AdminInput value={form.email} onChange={set("email")} type="email" placeholder="you@email.com" />
          </FormField>
          <FormField label="Phone / WhatsApp">
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