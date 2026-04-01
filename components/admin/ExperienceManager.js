"use client";

import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { calculateTotalExperience } from "@/lib/calculateExperience";
import {
  AdminSection, AddButton, AdminTable, AdminTr, AdminTd,
  EditBtn, DeleteBtn, AdminForm, FormRow, FormField,
  AdminInput, AdminTextarea, AdminSelect, StatusBadge, AlertBox,
} from "./AdminUI";

const EMPTY = { role: "", company: "", companyUrl: "", companyLogoUrl: "", employmentType: "Full-time", location: "", startDate: "", endDate: "", isCurrent: false, description: "", skills: "" };

function ExpForm({ form, setForm, onSubmit, saving, onCancel, isNew }) {
  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target.value })); }
  return (
    <AdminForm
      title={isNew ? "Add Experience" : "Edit Experience"}
      onSubmit={onSubmit}
      loading={saving}
      onCancel={onCancel}
    >
      <FormRow>
        <FormField label="Job Title / Role">
          <AdminInput value={form.role} onChange={set("role")} placeholder="Salesforce Consultant" required />
        </FormField>
        <FormField label="Company Name">
          <AdminInput value={form.company} onChange={set("company")} placeholder="GFGG IT Solutions" required />
        </FormField>
      </FormRow>
      <FormRow>
        <FormField label="Employment Type">
          <AdminSelect value={form.employmentType} onChange={set("employmentType")}>
            {["Full-time","Part-time","Contract","Freelance","Internship"].map(t => <option key={t}>{t}</option>)}
          </AdminSelect>
        </FormField>
        <FormField label="Location">
          <AdminInput value={form.location} onChange={set("location")} placeholder="Rajshahi, Bangladesh" />
        </FormField>
      </FormRow>
      <FormRow>
        <FormField label="Start Date">
          <AdminInput value={form.startDate} onChange={set("startDate")} type="month" required />
        </FormField>
        <FormField label="End Date (leave blank if current)">
          <AdminInput value={form.endDate || ""} onChange={set("endDate")} type="month" disabled={form.isCurrent} />
        </FormField>
      </FormRow>
      <FormField label="">
        <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#bcc4ba", fontSize: "0.875rem", cursor: "pointer" }}>
          <input type="checkbox" checked={!!form.isCurrent}
            onChange={e => setForm(f => ({ ...f, isCurrent: e.target.checked, endDate: e.target.checked ? "" : f.endDate }))}
          />
          Currently working here
        </label>
      </FormField>
      <FormField label="Company Website URL">
        <AdminInput value={form.companyUrl} onChange={set("companyUrl")} placeholder="https://company.com" />
      </FormField>
      <FormField label="Description">
        <AdminTextarea value={form.description} onChange={set("description")} placeholder="What you did, achievements…" rows={4} />
      </FormField>
      <FormField label="Skills Used (comma-separated)">
        <AdminInput value={form.skills} onChange={set("skills")} placeholder="Salesforce, Apex, Flow Builder…" />
      </FormField>
    </AdminForm>
  );
}

export default function ExperienceManager() {
  const { data: experiences, loading, refetch } = useFetch("/api/experiences");
  const [editingId, setEditingId] = useState(null); // _id | "new"
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState({ type: "", text: "" });

  const totalExp = experiences ? calculateTotalExperience(experiences) : null;

  function openAdd() { setEditingId("new"); setForm(EMPTY); setMsg({ type: "", text: "" }); }
  function openEdit(exp) {
    setEditingId(exp._id);
    setForm({ ...exp, skills: Array.isArray(exp.skills) ? exp.skills.join(", ") : (exp.skills || "") });
    setMsg({ type: "", text: "" });
  }
  function cancel() { setEditingId(null); setForm(EMPTY); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: "", text: "" });
    try {
      const payload = {
        ...form,
        skills: form.skills ? form.skills.split(",").map(s => s.trim()).filter(Boolean) : [],
        isCurrent: !!form.isCurrent,
        endDate: form.isCurrent ? null : form.endDate || null,
      };
      const isNew  = editingId === "new";
      const url    = isNew ? "/api/experiences" : `/api/experiences/${editingId}`;
      const method = isNew ? "POST" : "PUT";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) { setMsg({ type: "success", text: isNew ? "Experience added!" : "Experience updated!" }); refetch(); cancel(); }
      else { const d = await res.json(); setMsg({ type: "error", text: d.message || "Failed." }); }
    } catch { setMsg({ type: "error", text: "Network error." }); }
    finally { setSaving(false); }
  }

  async function handleDelete(id, role) {
    if (!confirm(`Delete "${role}"?`)) return;
    const res = await fetch(`/api/experiences/${id}`, { method: "DELETE" });
    if (res.ok) { setMsg({ type: "success", text: "Deleted." }); refetch(); }
  }

  return (
    <AdminSection title="Work Experience" action={<AddButton onClick={openAdd} />}>
      <AlertBox type={msg.type} message={msg.text} />

      {/* Auto-calculated total */}
      {totalExp && (
        <div style={{ background: "#011428", border: "1px solid #02275b", borderRadius: "8px", padding: "12px 16px", marginBottom: "1rem" }}>
          <div style={{ color: "#bcc4ba", fontSize: "0.75rem" }}>Auto-calculated total experience (shown in About)</div>
          <div style={{ color: "#06D001", fontSize: "1.5rem", fontWeight: 700 }}>{totalExp}+</div>
        </div>
      )}

      {/* Add form */}
      {editingId === "new" && (
        <div style={{ background: "#011428", border: "1px solid #059212", borderRadius: "8px", padding: "1rem", marginBottom: "1rem" }}>
          <ExpForm form={form} setForm={setForm} onSubmit={handleSubmit} saving={saving} onCancel={cancel} isNew />
        </div>
      )}

      <AdminTable headers={["Role", "Company", "Period", "Status", "Actions"]}>
        {loading
          ? <AdminTr><AdminTd muted>Loading…</AdminTd></AdminTr>
          : experiences?.map(exp => (
              <>
                <AdminTr key={exp._id}>
                  <AdminTd>{exp.role}</AdminTd>
                  <AdminTd muted>{exp.company}</AdminTd>
                  <AdminTd muted style={{ fontSize: "0.75rem" }}>{exp.startDate} – {exp.isCurrent ? "Present" : (exp.endDate || "?")}</AdminTd>
                  <AdminTd><StatusBadge label={exp.isCurrent ? "Current" : "Past"} type={exp.isCurrent ? "current" : "past"} /></AdminTd>
                  <AdminTd>
                    <EditBtn onClick={() => editingId === exp._id ? cancel() : openEdit(exp)} />
                    <DeleteBtn onClick={() => handleDelete(exp._id, exp.role)} />
                  </AdminTd>
                </AdminTr>
                {editingId === exp._id && (
                  <tr key={`edit-${exp._id}`}>
                    <td colSpan={5} style={{ padding: 0 }}>
                      <div style={{ padding: "1rem", background: "#011428", borderTop: "2px solid #059212", borderBottom: "1px solid #02275b" }}>
                        <ExpForm form={form} setForm={setForm} onSubmit={handleSubmit} saving={saving} onCancel={cancel} isNew={false} />
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