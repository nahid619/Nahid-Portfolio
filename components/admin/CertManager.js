// components/admin/CertManager.js
"use client";

import { useState } from "react";
import React from "react";
import Image from "next/image";
import { useFetch } from "@/hooks/useFetch";
import {
  AdminSection, AddButton, AdminTable, AdminTr, AdminTd,
  EditBtn, DeleteBtn, AdminForm, FormField, AdminInput, AlertBox,
} from "./AdminUI";

const EMPTY = { title: "", imageUrl: "", imagePublicId: "", order: 0 };

function CertForm({ form, setForm, onSubmit, saving, onCancel, isNew }) {
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");

  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target.value })); }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadMsg("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "nahid-portfolio/certifications");
      fd.append("type", "image");
      if (form.imagePublicId) fd.append("oldPublicId", form.imagePublicId);
      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      setForm(f => ({ ...f, imageUrl: data.url, imagePublicId: data.publicId }));
      setUploadMsg("✓ Uploaded!");
    } catch (err) {
      setUploadMsg("✗ " + err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <AdminForm title={isNew ? "Add Certification" : "Edit Certification"} onSubmit={onSubmit} loading={saving} onCancel={onCancel}>
      <FormField label="Certificate Title">
        <AdminInput value={form.title} onChange={set("title")} placeholder="SQA Manual and Automation Testing" required />
      </FormField>
      <FormField label="Certificate Image">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {form.imageUrl && (
            <div style={{ width: "80px", height: "56px", position: "relative", borderRadius: "4px", overflow: "hidden", border: "1px solid #02275b", flexShrink: 0 }}>
              <Image src={form.imageUrl} alt="preview" fill style={{ objectFit: "cover" }} sizes="80px" />
            </div>
          )}
          <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#02275b", color: "white", padding: "7px 14px", borderRadius: "6px", fontSize: "0.813rem", cursor: uploading ? "not-allowed" : "pointer", fontWeight: 600, opacity: uploading ? 0.7 : 1, flexShrink: 0 }}>
            {uploading ? "Uploading…" : form.imageUrl ? "Replace Image" : "Upload Image"}
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} disabled={uploading} />
          </label>
          {uploadMsg && <span style={{ fontSize: "0.75rem", color: uploadMsg.startsWith("✓") ? "#06D001" : "#ef4444" }}>{uploadMsg}</span>}
          <AdminInput value={form.imageUrl} onChange={set("imageUrl")} placeholder="or paste image URL" />
        </div>
      </FormField>
      <FormField label="Display Order">
        <AdminInput value={form.order} onChange={set("order")} type="number" placeholder="1" />
      </FormField>
    </AdminForm>
  );
}

export default function CertManager() {
  const { data: certs, loading, refetch } = useFetch("/api/certifications");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState({ type: "", text: "" });

  function openAdd() { setEditingId("new"); setForm(EMPTY); setMsg({ type: "", text: "" }); }
  function openEdit(c) { setEditingId(c._id); setForm({ ...c, imagePublicId: c.imagePublicId || "" }); setMsg({ type: "", text: "" }); }
  function cancel() { setEditingId(null); setForm(EMPTY); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const isNew  = editingId === "new";
      const url    = isNew ? "/api/certifications" : `/api/certifications/${editingId}`;
      const method = isNew ? "POST" : "PUT";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, order: Number(form.order) }) });
      if (res.ok) { setMsg({ type: "success", text: isNew ? "Added!" : "Updated!" }); refetch(); cancel(); }
      else { const d = await res.json(); setMsg({ type: "error", text: d.message || "Failed." }); }
    } catch { setMsg({ type: "error", text: "Network error." }); }
    finally { setSaving(false); }
  }

  async function handleDelete(id, title) {
    if (!confirm(`Delete "${title}"?`)) return;
    const res = await fetch(`/api/certifications/${id}`, { method: "DELETE" });
    if (res.ok) { setMsg({ type: "success", text: "Deleted." }); refetch(); }
  }

  return (
    <AdminSection title="Certifications" action={<AddButton onClick={openAdd} />}>
      <AlertBox type={msg.type} message={msg.text} />

      {editingId === "new" && (
        <div style={{ background: "#011428", border: "1px solid #059212", borderRadius: "8px", padding: "1rem", marginBottom: "1rem" }}>
          <CertForm form={form} setForm={setForm} onSubmit={handleSubmit} saving={saving} onCancel={cancel} isNew />
        </div>
      )}

      <AdminTable headers={["Preview", "Title", "Order", "Actions"]}>
        {loading
          ? <AdminTr><AdminTd muted>Loading…</AdminTd></AdminTr>
          : certs?.map(c => (
              <React.Fragment key={c._id}>
                <AdminTr>
                  <AdminTd>
                    {c.imageUrl
                      ? <div style={{ width: "50px", height: "36px", position: "relative", borderRadius: "4px", overflow: "hidden" }}><Image src={c.imageUrl} alt={c.title} fill style={{ objectFit: "cover" }} sizes="50px" /></div>
                      : <span style={{ fontSize: "1.25rem" }}>📜</span>
                    }
                  </AdminTd>
                  <AdminTd>{c.title}</AdminTd>
                  <AdminTd muted>{c.order}</AdminTd>
                  <AdminTd>
                    <EditBtn onClick={() => editingId === c._id ? cancel() : openEdit(c)} />
                    <DeleteBtn onClick={() => handleDelete(c._id, c.title)} />
                  </AdminTd>
                </AdminTr>
                {editingId === c._id && (
                  <tr>
                    <td colSpan={4} style={{ padding: 0 }}>
                      <div style={{ padding: "1rem", background: "#011428", borderTop: "2px solid #059212", borderBottom: "1px solid #02275b" }}>
                        <CertForm form={form} setForm={setForm} onSubmit={handleSubmit} saving={saving} onCancel={cancel} isNew={false} />
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