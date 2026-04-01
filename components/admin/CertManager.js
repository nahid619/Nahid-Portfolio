"use client";

import { useState } from "react";
import Image from "next/image";
import { useFetch } from "@/hooks/useFetch";
import {
  AdminSection, AddButton, AdminTable, AdminTr, AdminTd,
  EditBtn, DeleteBtn, AdminForm, FormRow, FormField,
  AdminInput, AlertBox,
} from "./AdminUI";

const EMPTY = { title: "", imageUrl: "", order: 0 };

export default function CertManager() {
  const { data: certs, loading, refetch } = useFetch("/api/certifications");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg]           = useState({ type: "", text: "" });

  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target.value })); }
  function openAdd() { setEditing(null); setForm(EMPTY); setShowForm(true); setMsg({ type: "", text: "" }); }
  function openEdit(c) { setEditing(c._id); setForm(c); setShowForm(true); setMsg({ type: "", text: "" }); }
  function cancel() { setShowForm(false); setEditing(null); setForm(EMPTY); }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "nahid-portfolio/certifications");
      fd.append("type", "image");
      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) { setForm(f => ({ ...f, imageUrl: data.url })); setMsg({ type: "success", text: "Image uploaded!" }); }
    } catch { setMsg({ type: "error", text: "Upload failed." }); }
    finally { setUploading(false); }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const url    = editing ? `/api/certifications/${editing}` : "/api/certifications";
      const method = editing ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, order: Number(form.order) }) });
      if (res.ok) { setMsg({ type: "success", text: editing ? "Updated!" : "Added!" }); refetch(); cancel(); }
      else setMsg({ type: "error", text: "Failed to save." });
    } catch { setMsg({ type: "error", text: "Something went wrong." }); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this certification?")) return;
    const res = await fetch(`/api/certifications/${id}`, { method: "DELETE" });
    if (res.ok) { setMsg({ type: "success", text: "Deleted." }); refetch(); }
  }

  return (
    <AdminSection title="Certifications" action={<AddButton onClick={openAdd} />}>
      <AlertBox type={msg.type} message={msg.text} />

      <AdminTable headers={["Preview", "Title", "Order", "Actions"]}>
        {loading
          ? <AdminTr><AdminTd muted>Loading…</AdminTd></AdminTr>
          : certs?.map(c => (
              <AdminTr key={c._id}>
                <AdminTd>
                  {c.imageUrl
                    ? <div style={{ width: "50px", height: "36px", position: "relative", borderRadius: "4px", overflow: "hidden" }}>
                        <Image src={c.imageUrl} alt={c.title} fill style={{ objectFit: "cover" }} sizes="50px" />
                      </div>
                    : <span style={{ fontSize: "1.25rem" }}>📜</span>
                  }
                </AdminTd>
                <AdminTd>{c.title}</AdminTd>
                <AdminTd muted>{c.order}</AdminTd>
                <AdminTd>
                  <EditBtn onClick={() => openEdit(c)} />
                  <DeleteBtn onClick={() => handleDelete(c._id)} />
                </AdminTd>
              </AdminTr>
            ))}
      </AdminTable>

      {showForm && (
        <AdminForm title={editing ? "Edit Certification" : "Add Certification"} onSubmit={handleSubmit} loading={saving} onCancel={cancel}>
          <FormField label="Certificate Title">
            <AdminInput value={form.title} onChange={set("title")} placeholder="e.g. SQA Manual and Automation Testing" required />
          </FormField>

          {/* Image upload */}
          <FormField label="Certificate Image">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              {form.imageUrl && (
                <div style={{ width: "80px", height: "56px", position: "relative", borderRadius: "4px", overflow: "hidden", border: "1px solid #02275b", flexShrink: 0 }}>
                  <Image src={form.imageUrl} alt="preview" fill style={{ objectFit: "cover" }} sizes="80px" />
                </div>
              )}
              <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#02275b", color: "white", padding: "7px 14px", borderRadius: "6px", fontSize: "0.813rem", cursor: "pointer", fontWeight: 600, flexShrink: 0 }}>
                {uploading ? "Uploading…" : "Upload Image"}
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} disabled={uploading} />
              </label>
              <AdminInput value={form.imageUrl} onChange={set("imageUrl")} placeholder="or paste image URL" />
            </div>
          </FormField>

          <FormField label="Display Order">
            <AdminInput value={form.order} onChange={set("order")} type="number" placeholder="1" />
          </FormField>
        </AdminForm>
      )}
    </AdminSection>
  );
}