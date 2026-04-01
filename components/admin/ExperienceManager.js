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

export default function ExperienceManager() {
  const { data: experiences, loading, refetch } = useFetch("/api/experiences");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null); // _id or null
  const [form, setForm]         = useState(EMPTY);
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState({ type: "", text: "" });

  const totalExp = experiences ? calculateTotalExperience(experiences) : null;

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  function openAdd() {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
    setMsg({ type: "", text: "" });
  }

  function openEdit(exp) {
    setEditing(exp._id);
    setForm({ ...exp, skills: Array.isArray(exp.skills) ? exp.skills.join(", ") : exp.skills });
    setShowForm(true);
    setMsg({ type: "", text: "" });
  }

  function cancel() {
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY);
  }

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

      const url    = editing ? `/api/experiences/${editing}` : "/api/experiences";
      const method = editing ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });

      if (res.ok) {
        setMsg({ type: "success", text: editing ? "Experience updated!" : "Experience added!" });
        refetch();
        cancel();
      } else {
        setMsg({ type: "error", text: "Failed to save." });
      }
    } catch {
      setMsg({ type: "error", text: "Something went wrong." });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this experience?")) return;
    const res = await fetch(`/api/experiences/${id}`, { method: "DELETE" });
    if (res.ok) { setMsg({ type: "success", text: "Deleted." }); refetch(); }
  }

  return (
    <AdminSection title="Work Experience" action={<AddButton onClick={openAdd} />}>
      <AlertBox type={msg.type} message={msg.text} />

      {/* Auto-calculated total */}
      {totalExp && (
        <div style={{ background: "#011428", border: "1px solid #02275b", borderRadius: "8px", padding: "12px 16px", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "12px" }}>
          <div>
            <div style={{ color: "#bcc4ba", fontSize: "0.75rem" }}>Auto-calculated total experience</div>
            <div style={{ color: "#06D001", fontSize: "1.5rem", fontWeight: 700 }}>{totalExp}+</div>
            <div style={{ color: "#bcc4ba", fontSize: "0.75rem" }}>Shown in About section</div>
          </div>
        </div>
      )}

      <AdminTable headers={["Role", "Company", "Period", "Status", "Actions"]}>
        {loading
          ? <AdminTr><AdminTd muted colSpan={5}>Loading…</AdminTd></AdminTr>
          : experiences?.map(exp => (
              <AdminTr key={exp._id}>
                <AdminTd>{exp.role}</AdminTd>
                <AdminTd muted>{exp.company}</AdminTd>
                <AdminTd muted>{exp.startDate} – {exp.isCurrent ? "Present" : (exp.endDate || "?")}</AdminTd>
                <AdminTd><StatusBadge label={exp.isCurrent ? "Current" : "Past"} type={exp.isCurrent ? "current" : "past"} /></AdminTd>
                <AdminTd>
                  <EditBtn onClick={() => openEdit(exp)} />
                  <DeleteBtn onClick={() => handleDelete(exp._id)} />
                </AdminTd>
              </AdminTr>
            ))}
      </AdminTable>

      {showForm && (
        <AdminForm title={editing ? "Edit Experience" : "Add Experience"} onSubmit={handleSubmit} loading={saving} onCancel={cancel}>
          <FormRow>
            <FormField label="Job Title / Role">
              <AdminInput value={form.role} onChange={set("role")} placeholder="e.g. Salesforce Consultant" required />
            </FormField>
            <FormField label="Company Name">
              <AdminInput value={form.company} onChange={set("company")} placeholder="e.g. GFGG IT Solutions" required />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField label="Employment Type">
              <AdminSelect value={form.employmentType} onChange={set("employmentType")}>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Freelance</option>
                <option>Internship</option>
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
            <FormField label="End Date">
              <AdminInput value={form.endDate || ""} onChange={set("endDate")} type="month" disabled={form.isCurrent} placeholder="Leave blank if current" />
            </FormField>
          </FormRow>
          <FormField label="">
            <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#bcc4ba", fontSize: "0.875rem", cursor: "pointer" }}>
              <input type="checkbox" checked={!!form.isCurrent} onChange={e => setForm(f => ({ ...f, isCurrent: e.target.checked, endDate: e.target.checked ? "" : f.endDate }))} />
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
      )}
    </AdminSection>
  );
}