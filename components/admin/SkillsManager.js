// components/admin/SkillsManager.js
"use client";

import { useState } from "react";
import React from "react";
import Image from "next/image";
import { useFetch } from "@/hooks/useFetch";
import CategoryPanel from "./CategoryPanel";
import {
  AdminSection, AddButton, AdminTable, AdminTr, AdminTd,
  EditBtn, DeleteBtn, AdminForm, FormRow, FormField,
  AdminInput, AdminSelect, StatusBadge, AlertBox,
} from "./AdminUI";

const EMPTY = { name: "", iconUrl: "", iconPublicId: "", category: "salesforce", order: 0 };

export default function SkillsManager() {
  const { data: skills, loading, refetch } = useFetch("/api/skills");
  // Fetch categories to populate the category dropdown dynamically
  const { data: categories } = useFetch("/api/categories?section=skills");

  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg]             = useState({ type: "", text: "" });

  // Build category options from DB (exclude the "All" tab which has empty value)
  const categoryOptions = categories
    ? categories.filter(c => c.value !== "").map(c => c.value)
    : ["salesforce", "sqa", "web", "programming"];

  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target.value })); }

  function openAdd() {
    setEditingId("new");
    setForm({ ...EMPTY, category: categoryOptions[0] || "salesforce" });
    setMsg({ type: "", text: "" });
  }

  function openEdit(s) {
    setEditingId(s._id);
    setForm({ ...s, iconPublicId: s.iconPublicId || "" });
    setMsg({ type: "", text: "" });
  }

  function cancel() { setEditingId(null); setForm(EMPTY); }

  async function handleIconUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMsg({ type: "", text: "" });
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "nahid-portfolio/skills");
      fd.append("type", "image");
      if (form.iconPublicId) fd.append("oldPublicId", form.iconPublicId);

      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      setForm(f => ({ ...f, iconUrl: data.url, iconPublicId: data.publicId }));
      setMsg({ type: "success", text: "Icon uploaded!" });
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const isNew  = editingId === "new";
      const url    = isNew ? "/api/skills" : `/api/skills/${editingId}`;
      const method = isNew ? "POST" : "PUT";
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, order: Number(form.order) }),
      });
      if (res.ok) {
        setMsg({ type: "success", text: isNew ? "Skill added!" : "Skill updated!" });
        refetch();
        cancel();
      } else {
        const d = await res.json();
        setMsg({ type: "error", text: d.message || "Failed." });
      }
    } catch {
      setMsg({ type: "error", text: "Network error." });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(s) {
    if (!confirm(`Delete "${s.name}"?`)) return;
    const res = await fetch(`/api/skills/${s._id}`, { method: "DELETE" });
    if (res.ok) { setMsg({ type: "success", text: "Deleted." }); refetch(); }
  }

  // Reusable icon upload UI block
  function IconUploadField() {
    return (
      <FormField label="Skill Icon">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {form.iconUrl && (
            <div style={{
              width: "36px", height: "36px",
              background: "#00193b", borderRadius: "6px",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden", position: "relative", flexShrink: 0,
            }}>
              <Image src={form.iconUrl} alt="icon" fill style={{ objectFit: "contain" }} sizes="36px" />
            </div>
          )}
          <label style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "#02275b", color: "white",
            padding: "7px 14px", borderRadius: "6px",
            fontSize: "0.813rem", cursor: uploading ? "not-allowed" : "pointer",
            fontWeight: 600, opacity: uploading ? 0.7 : 1, flexShrink: 0,
          }}>
            {uploading ? "Uploading…" : form.iconUrl ? "Replace Icon" : "Upload Icon"}
            <input type="file" accept="image/*,.svg" onChange={handleIconUpload} style={{ display: "none" }} disabled={uploading} />
          </label>
          <span style={{ color: "#bcc4ba", fontSize: "0.75rem" }}>or paste URL:</span>
          <AdminInput value={form.iconUrl} onChange={set("iconUrl")} placeholder="/assets/img/skill/salesforce.svg" />
        </div>
      </FormField>
    );
  }

  return (
    <AdminSection title="Skills" action={<AddButton onClick={openAdd} label="+ Add Skill" />}>

      {/* ── Category tab manager ── */}
      <CategoryPanel section="skills" />

      {/* ── Alerts ── */}
      <AlertBox type={msg.type} message={msg.text} />

      {/* ── Add new skill form ── */}
      {editingId === "new" && (
        <div style={{
          background: "#011428",
          border: "1px solid #059212",
          borderRadius: "8px",
          padding: "1rem",
          marginBottom: "1rem",
        }}>
          <AdminForm title="Add New Skill" onSubmit={handleSubmit} loading={saving} onCancel={cancel}>
            <FormRow>
              <FormField label="Skill Name">
                <AdminInput value={form.name} onChange={set("name")} placeholder="e.g. Salesforce Admin" required />
              </FormField>
              <FormField label="Category">
                <AdminSelect value={form.category} onChange={set("category")}>
                  {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </AdminSelect>
              </FormField>
            </FormRow>
            <IconUploadField />
            <FormField label="Display Order">
              <AdminInput value={form.order} onChange={set("order")} type="number" placeholder="1" />
            </FormField>
          </AdminForm>
        </div>
      )}

      {/* ── Skills table ── */}
      <AdminTable headers={["Icon", "Skill Name", "Category", "Order", "Actions"]}>
        {loading
          ? <AdminTr><AdminTd muted>Loading…</AdminTd></AdminTr>
          : skills?.map(s => (
              <React.Fragment key={s._id}>
                <AdminTr>
                  <AdminTd>
                    {s.iconUrl ? (
                      <div style={{ width: "28px", height: "28px", position: "relative", flexShrink: 0 }}>
                        <Image src={s.iconUrl} alt={s.name} fill style={{ objectFit: "contain" }} sizes="28px" />
                      </div>
                    ) : (
                      <span style={{ color: "#06D001", fontWeight: 700, fontSize: "0.813rem" }}>
                        {s.name.slice(0, 2)}
                      </span>
                    )}
                  </AdminTd>
                  <AdminTd>{s.name}</AdminTd>
                  <AdminTd><StatusBadge label={s.category} type={s.category} /></AdminTd>
                  <AdminTd muted>{s.order}</AdminTd>
                  <AdminTd>
                    <EditBtn onClick={() => editingId === s._id ? cancel() : openEdit(s)} />
                    <DeleteBtn onClick={() => handleDelete(s)} />
                  </AdminTd>
                </AdminTr>

                {/* Inline edit form */}
                {editingId === s._id && (
                  <tr>
                    <td colSpan={5} style={{ padding: 0 }}>
                      <div style={{
                        padding: "1rem",
                        background: "#011428",
                        borderTop: "2px solid #059212",
                        borderBottom: "1px solid #02275b",
                      }}>
                        <AlertBox type={msg.type} message={msg.text} />
                        <AdminForm title="Edit Skill" onSubmit={handleSubmit} loading={saving} onCancel={cancel}>
                          <FormRow>
                            <FormField label="Skill Name">
                              <AdminInput value={form.name} onChange={set("name")} required />
                            </FormField>
                            <FormField label="Category">
                              <AdminSelect value={form.category} onChange={set("category")}>
                                {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                              </AdminSelect>
                            </FormField>
                          </FormRow>
                          <IconUploadField />
                          <FormField label="Display Order">
                            <AdminInput value={form.order} onChange={set("order")} type="number" />
                          </FormField>
                        </AdminForm>
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