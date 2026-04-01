"use client";

import { useState } from "react";
import React from "react";
import Image from "next/image";
import { useFetch } from "@/hooks/useFetch";
import {
  AdminSection, AddButton, AdminTable, AdminTr, AdminTd,
  EditBtn, DeleteBtn, AdminForm, FormRow, FormField,
  AdminInput, AdminTextarea, AdminSelect, StatusBadge, AlertBox,
} from "./AdminUI";

const EMPTY = { title: "", category: "sqa", description: "", highlights: "", challenges: "", techStack: "", projectImageUrl: "", projectImagePublicId: "", videoUrl: "", githubUrl: "", liveUrl: "", publishedDate: "", order: 0 };

function ProjectForm({ form, setForm, onSubmit, saving, onCancel, isNew }) {
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
      fd.append("folder", "nahid-portfolio/projects");
      fd.append("type", "image");
      if (form.projectImagePublicId) fd.append("oldPublicId", form.projectImagePublicId);
      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      setForm(f => ({ ...f, projectImageUrl: data.url, projectImagePublicId: data.publicId }));
      setUploadMsg("✓ Image uploaded");
    } catch (err) {
      setUploadMsg("✗ " + err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <AdminForm title={isNew ? "Add Project" : "Edit Project"} onSubmit={onSubmit} loading={saving} onCancel={onCancel}>
      <FormRow>
        <FormField label="Project Title">
          <AdminInput value={form.title} onChange={set("title")} placeholder="WafiCommerce QA Testing" required />
        </FormField>
        <FormField label="Category">
          <AdminSelect value={form.category} onChange={set("category")}>
            <option value="sqa">SQA</option>
            <option value="salesforce">Salesforce</option>
            <option value="web">Web</option>
          </AdminSelect>
        </FormField>
      </FormRow>

      <FormField label="Project Image">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {form.projectImageUrl && (
            <div style={{ width: "70px", height: "48px", position: "relative", borderRadius: "4px", overflow: "hidden", border: "1px solid #02275b", flexShrink: 0 }}>
              <Image src={form.projectImageUrl} alt="preview" fill style={{ objectFit: "cover" }} sizes="70px" />
            </div>
          )}
          <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#02275b", color: "white", padding: "7px 14px", borderRadius: "6px", fontSize: "0.813rem", cursor: uploading ? "not-allowed" : "pointer", fontWeight: 600, opacity: uploading ? 0.7 : 1, flexShrink: 0 }}>
            {uploading ? "Uploading…" : form.projectImageUrl ? "Replace Image" : "Upload Image"}
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} disabled={uploading} />
          </label>
          {uploadMsg && <span style={{ fontSize: "0.75rem", color: uploadMsg.startsWith("✓") ? "#06D001" : "#ef4444" }}>{uploadMsg}</span>}
          <AdminInput value={form.projectImageUrl} onChange={set("projectImageUrl")} placeholder="or paste image URL" />
        </div>
      </FormField>

      <FormField label="Description">
        <AdminTextarea value={form.description} onChange={set("description")} placeholder="What the project does…" rows={3} />
      </FormField>
      <FormField label="Key Highlights (one per line)">
        <AdminTextarea value={form.highlights} onChange={set("highlights")} placeholder={"60+ test cases\nIdentified critical bugs"} rows={4} />
      </FormField>
      <FormField label="Challenges & Learnings">
        <AdminTextarea value={form.challenges} onChange={set("challenges")} placeholder="What was hard and what you learned…" rows={3} />
      </FormField>
      <FormField label="Tech Stack (comma-separated)">
        <AdminInput value={form.techStack} onChange={set("techStack")} placeholder="Postman, Manual Testing, Selenium" />
      </FormField>
      <FormRow>
        <FormField label="GitHub URL">
          <AdminInput value={form.githubUrl} onChange={set("githubUrl")} placeholder="https://github.com/…" />
        </FormField>
        <FormField label="Live / Demo URL">
          <AdminInput value={form.liveUrl} onChange={set("liveUrl")} placeholder="https://…" />
        </FormField>
      </FormRow>
      <FormRow>
        <FormField label="Video URL (optional)">
          <AdminInput value={form.videoUrl} onChange={set("videoUrl")} placeholder="YouTube or Drive link" />
        </FormField>
        <FormField label="Published Date">
          <AdminInput value={form.publishedDate} onChange={set("publishedDate")} type="date" />
        </FormField>
      </FormRow>
      <FormField label="Display Order">
        <AdminInput value={form.order} onChange={set("order")} type="number" placeholder="1" />
      </FormField>
    </AdminForm>
  );
}

export default function ProjectsManager() {
  const { data: projects, loading, refetch } = useFetch("/api/projects");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState({ type: "", text: "" });

  function openAdd() {
    setEditingId("new"); setForm(EMPTY); setMsg({ type: "", text: "" });
  }
  function openEdit(p) {
    setEditingId(p._id);
    setForm({
      ...p,
      techStack:  Array.isArray(p.techStack)  ? p.techStack.join(", ")  : (p.techStack  || ""),
      highlights: Array.isArray(p.highlights) ? p.highlights.join("\n") : (p.highlights || ""),
      projectImagePublicId: p.projectImagePublicId || "",
    });
    setMsg({ type: "", text: "" });
  }
  function cancel() { setEditingId(null); setForm(EMPTY); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        techStack:  form.techStack  ? form.techStack.split(",").map(s => s.trim()).filter(Boolean)  : [],
        highlights: form.highlights ? form.highlights.split("\n").map(s => s.trim()).filter(Boolean) : [],
        order: Number(form.order),
      };
      const isNew  = editingId === "new";
      const url    = isNew ? "/api/projects" : `/api/projects/${editingId}`;
      const method = isNew ? "POST" : "PUT";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) { setMsg({ type: "success", text: isNew ? "Project added!" : "Project updated!" }); refetch(); cancel(); }
      else { const d = await res.json(); setMsg({ type: "error", text: d.message || "Failed." }); }
    } catch { setMsg({ type: "error", text: "Network error." }); }
    finally { setSaving(false); }
  }

  async function handleDelete(id, title) {
    if (!confirm(`Delete "${title}"?`)) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) { setMsg({ type: "success", text: "Deleted." }); refetch(); }
  }

  return (
    <AdminSection title="Projects" action={<AddButton onClick={openAdd} />}>
      <AlertBox type={msg.type} message={msg.text} />

      {editingId === "new" && (
        <div style={{ background: "#011428", border: "1px solid #059212", borderRadius: "8px", padding: "1rem", marginBottom: "1rem" }}>
          <ProjectForm form={form} setForm={setForm} onSubmit={handleSubmit} saving={saving} onCancel={cancel} isNew />
        </div>
      )}

      <AdminTable headers={["Image", "Title", "Category", "Tech", "Actions"]}>
        {loading
          ? <AdminTr><AdminTd muted>Loading…</AdminTd></AdminTr>
          : projects?.map(p => (
              <React.Fragment key={p._id}>
                <AdminTr>
                  <AdminTd>
                    {p.projectImageUrl
                      ? <div style={{ width: "48px", height: "34px", position: "relative", borderRadius: "4px", overflow: "hidden" }}><Image src={p.projectImageUrl} alt={p.title} fill style={{ objectFit: "cover" }} sizes="48px" /></div>
                      : <span style={{ fontSize: "1.25rem" }}>📁</span>
                    }
                  </AdminTd>
                  <AdminTd>{p.title}</AdminTd>
                  <AdminTd><StatusBadge label={p.category} type={p.category} /></AdminTd>
                  <AdminTd muted style={{ fontSize: "0.75rem" }}>{p.techStack?.slice(0, 2).join(", ")}{p.techStack?.length > 2 ? "…" : ""}</AdminTd>
                  <AdminTd>
                    <EditBtn onClick={() => editingId === p._id ? cancel() : openEdit(p)} />
                    <DeleteBtn onClick={() => handleDelete(p._id, p.title)} />
                  </AdminTd>
                </AdminTr>
                {editingId === p._id && (
                  <tr>
                    <td colSpan={5} style={{ padding: 0 }}>
                      <div style={{ padding: "1rem", background: "#011428", borderTop: "2px solid #059212", borderBottom: "1px solid #02275b" }}>
                        <ProjectForm form={form} setForm={setForm} onSubmit={handleSubmit} saving={saving} onCancel={cancel} isNew={false} />
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