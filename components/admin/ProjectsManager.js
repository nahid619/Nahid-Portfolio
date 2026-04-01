"use client";

import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import {
  AdminSection, AddButton, AdminTable, AdminTr, AdminTd,
  EditBtn, DeleteBtn, AdminForm, FormRow, FormField,
  AdminInput, AdminTextarea, AdminSelect, StatusBadge, AlertBox,
} from "./AdminUI";

const EMPTY = { title: "", category: "sqa", description: "", highlights: "", challenges: "", techStack: "", projectImageUrl: "", videoUrl: "", githubUrl: "", liveUrl: "", publishedDate: "", order: 0 };

export default function ProjectsManager() {
  const { data: projects, loading, refetch } = useFetch("/api/projects");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg]           = useState({ type: "", text: "" });

  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target.value })); }

  function openAdd() { setEditing(null); setForm(EMPTY); setShowForm(true); setMsg({ type: "", text: "" }); }
  function openEdit(p) {
    setEditing(p._id);
    setForm({
      ...p,
      techStack:  Array.isArray(p.techStack)  ? p.techStack.join(", ")  : p.techStack  || "",
      highlights: Array.isArray(p.highlights) ? p.highlights.join("\n") : p.highlights || "",
    });
    setShowForm(true);
    setMsg({ type: "", text: "" });
  }
  function cancel() { setShowForm(false); setEditing(null); setForm(EMPTY); }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "nahid-portfolio/projects");
      fd.append("type", "image");
      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) { setForm(f => ({ ...f, projectImageUrl: data.url })); setMsg({ type: "success", text: "Image uploaded!" }); }
    } catch { setMsg({ type: "error", text: "Upload failed." }); }
    finally { setUploading(false); }
  }

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
      const url    = editing ? `/api/projects/${editing}` : "/api/projects";
      const method = editing ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) { setMsg({ type: "success", text: editing ? "Project updated!" : "Project added!" }); refetch(); cancel(); }
      else setMsg({ type: "error", text: "Failed to save." });
    } catch { setMsg({ type: "error", text: "Something went wrong." }); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) { setMsg({ type: "success", text: "Deleted." }); refetch(); }
  }

  return (
    <AdminSection title="Projects" action={<AddButton onClick={openAdd} />}>
      <AlertBox type={msg.type} message={msg.text} />

      <AdminTable headers={["Title", "Category", "Tech Stack", "Actions"]}>
        {loading
          ? <AdminTr><AdminTd muted>Loading…</AdminTd></AdminTr>
          : projects?.map(p => (
              <AdminTr key={p._id}>
                <AdminTd>{p.title}</AdminTd>
                <AdminTd><StatusBadge label={p.category} type={p.category} /></AdminTd>
                <AdminTd muted>{p.techStack?.slice(0, 3).join(", ")}{p.techStack?.length > 3 ? "…" : ""}</AdminTd>
                <AdminTd>
                  <EditBtn onClick={() => openEdit(p)} />
                  <DeleteBtn onClick={() => handleDelete(p._id)} />
                </AdminTd>
              </AdminTr>
            ))}
      </AdminTable>

      {showForm && (
        <AdminForm title={editing ? "Edit Project" : "Add Project"} onSubmit={handleSubmit} loading={saving} onCancel={cancel}>
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

          {/* Image upload */}
          <FormField label="Project Image">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {form.projectImageUrl && (
                <img src={form.projectImageUrl} alt="preview" style={{ width: "60px", height: "40px", objectFit: "cover", borderRadius: "4px", border: "1px solid #02275b" }} />
              )}
              <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#02275b", color: "white", padding: "7px 14px", borderRadius: "6px", fontSize: "0.813rem", cursor: "pointer", fontWeight: 600 }}>
                {uploading ? "Uploading…" : "Upload Image"}
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} disabled={uploading} />
              </label>
              <span style={{ color: "#bcc4ba", fontSize: "0.75rem" }}>or</span>
              <AdminInput value={form.projectImageUrl} onChange={set("projectImageUrl")} placeholder="Paste image URL" />
            </div>
          </FormField>

          <FormField label="Description">
            <AdminTextarea value={form.description} onChange={set("description")} placeholder="What the project does…" rows={3} />
          </FormField>
          <FormField label="Key Highlights (one per line)">
            <AdminTextarea value={form.highlights} onChange={set("highlights")} placeholder={"60+ test cases\nIdentified critical bugs\n…"} rows={4} />
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
              <AdminInput value={form.videoUrl} onChange={set("videoUrl")} placeholder="Google Drive or YouTube link" />
            </FormField>
            <FormField label="Published Date">
              <AdminInput value={form.publishedDate} onChange={set("publishedDate")} type="date" />
            </FormField>
          </FormRow>
          <FormField label="Display Order">
            <AdminInput value={form.order} onChange={set("order")} type="number" placeholder="1" />
          </FormField>
        </AdminForm>
      )}
    </AdminSection>
  );
}