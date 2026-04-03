// components/admin/SocialLinksManager.js
"use client";

import { useState } from "react";
import React from "react";
import Image from "next/image";
import { useFetch } from "@/hooks/useFetch";
import {
  AdminSection, AddButton, AdminTable, AdminTr, AdminTd,
  EditBtn, DeleteBtn, AdminForm, FormRow, FormField,
  AdminInput, AlertBox,
} from "./AdminUI";

const LOCATIONS = [
  { value: "navbar",        label: "Navbar icons (top right)"   },
  { value: "footer",        label: "Footer column"               },
  { value: "contact-modal", label: "Contact modal options"       },
  { value: "hero",          label: "Hero section social icons"   },
];

const EMPTY = { name: "", url: "", logo: "", iconImageUrl: "", iconPublicId: "", showIn: ["navbar"], order: 0 };

function LocationCheckboxes({ selected, onChange }) {
  function toggle(val) {
    const next = selected.includes(val)
      ? selected.filter(v => v !== val)
      : [...selected, val];
    onChange(next);
  }
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
      {LOCATIONS.map(loc => (
        <label key={loc.value} style={{ display: "flex", alignItems: "center", gap: "7px", color: "#bcc4ba", fontSize: "0.875rem", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={selected.includes(loc.value)}
            onChange={() => toggle(loc.value)}
            style={{ accentColor: "#059212", width: "15px", height: "15px" }}
          />
          {loc.label}
        </label>
      ))}
    </div>
  );
}

function LinkForm({ form, setForm, onSubmit, saving, onCancel, isNew }) {
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");

  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target.value })); }

  async function handleIconUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadMsg("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "nahid-portfolio/social-icons");
      fd.append("type", "image");
      if (form.iconPublicId) { fd.append("oldPublicId", form.iconPublicId); fd.append("oldResType", "image"); }
      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      setForm(f => ({ ...f, iconImageUrl: data.url, iconPublicId: data.publicId }));
      setUploadMsg("✓ Uploaded!");
    } catch (err) { setUploadMsg("✗ " + err.message); }
    finally { setUploading(false); }
  }

  return (
    <AdminForm title={isNew ? "Add Link" : "Edit Link"} onSubmit={onSubmit} loading={saving} onCancel={onCancel}>
      <FormRow>
        <FormField label="Platform Name">
          <AdminInput value={form.name} onChange={set("name")} placeholder="e.g. LinkedIn" required />
        </FormField>
        <FormField label="Text Logo (fallback)">
          <AdminInput value={form.logo} onChange={set("logo")} placeholder="in  GH  🏆  fb" />
        </FormField>
      </FormRow>

      {/* Icon image upload */}
      <FormField label="Icon Image (overrides text logo in navbar/footer)">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {form.iconImageUrl && (
            <div style={{ width: "32px", height: "32px", position: "relative", borderRadius: "6px", overflow: "hidden", border: "1px solid #02275b", flexShrink: 0 }}>
              <Image src={form.iconImageUrl} alt="icon" fill style={{ objectFit: "contain" }} sizes="32px" />
            </div>
          )}
          <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#02275b", color: "white", padding: "7px 14px", borderRadius: "6px", fontSize: "0.813rem", cursor: uploading ? "not-allowed" : "pointer", fontWeight: 600, opacity: uploading ? 0.7 : 1, flexShrink: 0 }}>
            {uploading ? "Uploading…" : form.iconImageUrl ? "Replace Icon" : "Upload Icon"}
            <input type="file" accept="image/*,.svg" onChange={handleIconUpload} style={{ display: "none" }} disabled={uploading} />
          </label>
          {uploadMsg && <span style={{ fontSize: "0.75rem", color: uploadMsg.startsWith("✓") ? "#06D001" : "#ef4444" }}>{uploadMsg}</span>}
          <AdminInput value={form.iconImageUrl} onChange={set("iconImageUrl")} placeholder="or paste icon URL" />
        </div>
      </FormField>

      <FormField label="Profile URL">
        <AdminInput value={form.url} onChange={set("url")} placeholder="https://linkedin.com/in/…" required />
      </FormField>

      {/* Location checkboxes */}
      <FormField label="Show In (select all that apply)">
        <LocationCheckboxes
          selected={Array.isArray(form.showIn) ? form.showIn : [form.showIn || "navbar"]}
          onChange={vals => setForm(f => ({ ...f, showIn: vals }))}
        />
        <div style={{ color: "#bcc4ba", fontSize: "0.75rem", marginTop: "5px" }}>
          Navbar = top-right icon buttons · Hero = social icons under buttons · Footer = footer column · Contact modal = contact options
        </div>
      </FormField>

      <FormField label="Display Order">
        <AdminInput value={form.order} onChange={set("order")} type="number" placeholder="1" />
      </FormField>
    </AdminForm>
  );
}

export default function SocialLinksManager() {
  const { data: links, loading, refetch } = useFetch("/api/social-links");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState({ type: "", text: "" });

  function openAdd() { setEditingId("new"); setForm(EMPTY); setMsg({ type: "", text: "" }); }
  function openEdit(l) {
    setEditingId(l._id);
    setForm({ ...l, showIn: Array.isArray(l.showIn) ? l.showIn : [l.showIn || "navbar"], iconPublicId: l.iconPublicId || "", iconImageUrl: l.iconImageUrl || "" });
    setMsg({ type: "", text: "" });
  }
  function cancel() { setEditingId(null); setForm(EMPTY); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const isNew  = editingId === "new";
      const url    = isNew ? "/api/social-links" : `/api/social-links/${editingId}`;
      const method = isNew ? "POST" : "PUT";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, order: Number(form.order) }) });
      if (res.ok) { setMsg({ type: "success", text: isNew ? "Link added!" : "Link updated!" }); refetch(); cancel(); }
      else { const d = await res.json(); setMsg({ type: "error", text: d.message || "Failed." }); }
    } catch { setMsg({ type: "error", text: "Network error." }); }
    finally { setSaving(false); }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"?`)) return;
    const res = await fetch(`/api/social-links/${id}`, { method: "DELETE" });
    if (res.ok) { setMsg({ type: "success", text: "Deleted." }); refetch(); }
  }

  function renderLocations(showIn) {
    const locs = Array.isArray(showIn) ? showIn : [showIn || "navbar"];
    return locs.map(l => LOCATIONS.find(x => x.value === l)?.label || l).join(", ");
  }

  return (
    <AdminSection title="Social & Profile Links" action={<AddButton onClick={openAdd} />}>
      <AlertBox type={msg.type} message={msg.text} />

      <div style={{ color: "#bcc4ba", fontSize: "0.813rem", marginBottom: "1rem", padding: "10px 14px", background: "#011428", borderRadius: "6px", border: "1px solid #02275b" }}>
        💡 Use checkboxes to control exactly where each link appears. One link can appear in multiple locations simultaneously.
      </div>

      {editingId === "new" && (
        <div style={{ background: "#011428", border: "1px solid #059212", borderRadius: "8px", padding: "1rem", marginBottom: "1rem" }}>
          <LinkForm form={form} setForm={setForm} onSubmit={handleSubmit} saving={saving} onCancel={cancel} isNew />
        </div>
      )}

      <AdminTable headers={["Icon", "Platform", "Locations", "Order", "Actions"]}>
        {loading
          ? <AdminTr><AdminTd muted>Loading…</AdminTd></AdminTr>
          : links?.map(l => (
              <React.Fragment key={l._id}>
                <AdminTr>
                  <AdminTd>
                    {l.iconImageUrl
                      ? <div style={{ width: "26px", height: "26px", position: "relative", borderRadius: "4px", overflow: "hidden" }}><Image src={l.iconImageUrl} alt={l.name} fill style={{ objectFit: "contain" }} sizes="26px" /></div>
                      : <span style={{ fontSize: "1.1rem" }}>{l.logo}</span>
                    }
                  </AdminTd>
                  <AdminTd>
                    <div style={{ fontWeight: 600, color: "white" }}>{l.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "#bcc4ba", maxWidth: "140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.url}</div>
                  </AdminTd>
                  <AdminTd muted><span style={{ fontSize: "0.75rem" }}>{renderLocations(l.showIn)}</span></AdminTd>
                  <AdminTd muted>{l.order}</AdminTd>
                  <AdminTd>
                    <EditBtn onClick={() => editingId === l._id ? cancel() : openEdit(l)} />
                    <DeleteBtn onClick={() => handleDelete(l._id, l.name)} />
                  </AdminTd>
                </AdminTr>
                {editingId === l._id && (
                  <tr>
                    <td colSpan={5} style={{ padding: 0 }}>
                      <div style={{ padding: "1rem", background: "#011428", borderTop: "2px solid #059212", borderBottom: "1px solid #02275b" }}>
                        <LinkForm form={form} setForm={setForm} onSubmit={handleSubmit} saving={saving} onCancel={cancel} isNew={false} />
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
      </AdminTable>
    </AdminSection>
  );
}