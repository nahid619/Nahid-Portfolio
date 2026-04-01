"use client";

import { useState } from "react";
import Image from "next/image";
import { useFetch } from "@/hooks/useFetch";
import {
  AdminSection, AddButton, AdminTable, AdminTr, AdminTd,
  EditBtn, DeleteBtn, AdminForm, FormRow, FormField,
  AdminInput, AdminSelect, StatusBadge, AlertBox,
} from "./AdminUI";

const EMPTY = { name: "", iconUrl: "", iconPublicId: "", category: "salesforce", order: 0 };
const CATEGORIES = ["salesforce", "sqa", "web", "programming"];

export default function SkillsManager() {
  const { data: skills, loading, refetch } = useFetch("/api/skills");
  const [editingId, setEditingId] = useState(null); // _id of row being edited, "new" for add
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg]             = useState({ type: "", text: "" });

  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target.value })); }

  function openAdd() {
    setEditingId("new");
    setForm(EMPTY);
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
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, order: Number(form.order) }) });
      if (res.ok) { setMsg({ type: "success", text: isNew ? "Skill added!" : "Skill updated!" }); refetch(); cancel(); }
      else { const d = await res.json(); setMsg({ type: "error", text: d.message || "Failed." }); }
    } catch { setMsg({ type: "error", text: "Network error." }); }
    finally { setSaving(false); }
  }

  async function handleDelete(s) {
    if (!confirm(`Delete "${s.name}"?`)) return;
    const res = await fetch(`/api/skills/${s._id}`, { method: "DELETE" });
    if (res.ok) { setMsg({ type: "success", text: "Deleted." }); refetch(); }
  }

  const InlineForm = (
    <tr>
      <td colSpan={5} style={{ padding: "0" }}>
        <div style={{ padding: "1rem", background: "#011428", borderTop: "1px solid #02275b", borderBottom: "1px solid #02275b" }}>
          <AlertBox type={msg.type} message={msg.text} />
          <AdminForm
            title={editingId === "new" ? "Add New Skill" : "Edit Skill"}
            onSubmit={handleSubmit}
            loading={saving}
            onCancel={cancel}
          >
            <FormRow>
              <FormField label="Skill Name">
                <AdminInput value={form.name} onChange={set("name")} placeholder="e.g. Salesforce Admin" required />
              </FormField>
              <FormField label="Category">
                <AdminSelect value={form.category} onChange={set("category")}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </AdminSelect>
              </FormField>
            </FormRow>

            {/* Icon upload */}
            <FormField label="Skill Icon">
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                {form.iconUrl && (
                  <div style={{ width: "36px", height: "36px", background: "#00193b", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative", flexShrink: 0 }}>
                    <Image src={form.iconUrl} alt="icon" fill style={{ objectFit: "contain" }} sizes="36px" />
                  </div>
                )}
                <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#02275b", color: "white", padding: "7px 14px", borderRadius: "6px", fontSize: "0.813rem", cursor: uploading ? "not-allowed" : "pointer", fontWeight: 600, opacity: uploading ? 0.7 : 1, flexShrink: 0 }}>
                  {uploading ? "Uploading…" : form.iconUrl ? "Replace Icon" : "Upload Icon"}
                  <input type="file" accept="image/*,.svg" onChange={handleIconUpload} style={{ display: "none" }} disabled={uploading} />
                </label>
                <span style={{ color: "#bcc4ba", fontSize: "0.75rem" }}>or paste URL:</span>
                <AdminInput value={form.iconUrl} onChange={set("iconUrl")} placeholder="/assets/img/skill/salesforce.svg" />
              </div>
            </FormField>

            <FormField label="Display Order">
              <AdminInput value={form.order} onChange={set("order")} type="number" placeholder="1" />
            </FormField>
          </AdminForm>
        </div>
      </td>
    </tr>
  );

  return (
    <AdminSection title="Skills" action={<AddButton onClick={openAdd} label="+ Add Skill" />}>
      {!msg.text && <AlertBox type={msg.type} message={msg.text} />}

      {/* Add form at top */}
      {editingId === "new" && (
        <div style={{ marginBottom: "1rem" }}>
          <AlertBox type={msg.type} message={msg.text} />
          <div style={{ padding: "1rem", background: "#011428", border: "1px solid #02275b", borderRadius: "8px" }}>
            <AdminForm title="Add New Skill" onSubmit={handleSubmit} loading={saving} onCancel={cancel}>
              <FormRow>
                <FormField label="Skill Name">
                  <AdminInput value={form.name} onChange={set("name")} placeholder="e.g. Salesforce Admin" required />
                </FormField>
                <FormField label="Category">
                  <AdminSelect value={form.category} onChange={set("category")}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </AdminSelect>
                </FormField>
              </FormRow>
              <FormField label="Skill Icon">
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  {form.iconUrl && (
                    <div style={{ width: "36px", height: "36px", background: "#00193b", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative", flexShrink: 0 }}>
                      <Image src={form.iconUrl} alt="icon" fill style={{ objectFit: "contain" }} sizes="36px" />
                    </div>
                  )}
                  <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#02275b", color: "white", padding: "7px 14px", borderRadius: "6px", fontSize: "0.813rem", cursor: uploading ? "not-allowed" : "pointer", fontWeight: 600, opacity: uploading ? 0.7 : 1, flexShrink: 0 }}>
                    {uploading ? "Uploading…" : "Upload Icon"}
                    <input type="file" accept="image/*,.svg" onChange={handleIconUpload} style={{ display: "none" }} disabled={uploading} />
                  </label>
                  <span style={{ color: "#bcc4ba", fontSize: "0.75rem" }}>or paste URL:</span>
                  <AdminInput value={form.iconUrl} onChange={set("iconUrl")} placeholder="/assets/img/skill/salesforce.svg" />
                </div>
              </FormField>
              <FormField label="Display Order">
                <AdminInput value={form.order} onChange={set("order")} type="number" placeholder="1" />
              </FormField>
            </AdminForm>
          </div>
        </div>
      )}

      <AdminTable headers={["Icon", "Skill Name", "Category", "Order", "Actions"]}>
        {loading
          ? <AdminTr><AdminTd muted>Loading…</AdminTd></AdminTr>
          : skills?.map(s => (
              <>
                <AdminTr key={s._id}>
                  <AdminTd>
                    {s.iconUrl ? (
                      <div style={{ width: "28px", height: "28px", position: "relative", flexShrink: 0 }}>
                        <Image src={s.iconUrl} alt={s.name} fill style={{ objectFit: "contain" }} sizes="28px" />
                      </div>
                    ) : (
                      <span style={{ color: "#06D001", fontWeight: 700, fontSize: "0.813rem" }}>{s.name.slice(0, 2)}</span>
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

                {/* Inline edit form — appears right below clicked row */}
                {editingId === s._id && (
                  <tr key={`edit-${s._id}`}>
                    <td colSpan={5} style={{ padding: 0 }}>
                      <div style={{ padding: "1rem", background: "#011428", borderTop: "2px solid #059212", borderBottom: "1px solid #02275b" }}>
                        <AlertBox type={msg.type} message={msg.text} />
                        <AdminForm title="Edit Skill" onSubmit={handleSubmit} loading={saving} onCancel={cancel}>
                          <FormRow>
                            <FormField label="Skill Name">
                              <AdminInput value={form.name} onChange={set("name")} required />
                            </FormField>
                            <FormField label="Category">
                              <AdminSelect value={form.category} onChange={set("category")}>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                              </AdminSelect>
                            </FormField>
                          </FormRow>
                          <FormField label="Skill Icon">
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                              {form.iconUrl && (
                                <div style={{ width: "36px", height: "36px", background: "#00193b", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative", flexShrink: 0 }}>
                                  <Image src={form.iconUrl} alt="icon" fill style={{ objectFit: "contain" }} sizes="36px" />
                                </div>
                              )}
                              <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#02275b", color: "white", padding: "7px 14px", borderRadius: "6px", fontSize: "0.813rem", cursor: uploading ? "not-allowed" : "pointer", fontWeight: 600, opacity: uploading ? 0.7 : 1, flexShrink: 0 }}>
                                {uploading ? "Uploading…" : form.iconUrl ? "Replace Icon" : "Upload Icon"}
                                <input type="file" accept="image/*,.svg" onChange={handleIconUpload} style={{ display: "none" }} disabled={uploading} />
                              </label>
                              <span style={{ color: "#bcc4ba", fontSize: "0.75rem" }}>or paste URL:</span>
                              <AdminInput value={form.iconUrl} onChange={set("iconUrl")} placeholder="/assets/img/skill/salesforce.svg" />
                            </div>
                          </FormField>
                          <FormField label="Display Order">
                            <AdminInput value={form.order} onChange={set("order")} type="number" />
                          </FormField>
                        </AdminForm>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
      </AdminTable>
    </AdminSection>
  );
}