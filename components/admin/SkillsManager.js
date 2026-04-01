"use client";

import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import {
  AdminSection, AddButton, AdminTable, AdminTr, AdminTd,
  EditBtn, DeleteBtn, AdminForm, FormRow, FormField,
  AdminInput, AdminSelect, StatusBadge, AlertBox,
} from "./AdminUI";

const EMPTY = { name: "", iconUrl: "", category: "salesforce", order: 0 };

const CATEGORIES = ["salesforce", "sqa", "web", "programming"];

export default function SkillsManager() {
  const { data: skills, loading, refetch } = useFetch("/api/skills");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState({ type: "", text: "" });

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  function openAdd() { setEditing(null); setForm(EMPTY); setShowForm(true); setMsg({ type: "", text: "" }); }
  function openEdit(s) { setEditing(s._id); setForm(s); setShowForm(true); setMsg({ type: "", text: "" }); }
  function cancel() { setShowForm(false); setEditing(null); setForm(EMPTY); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const url    = editing ? `/api/skills/${editing}` : "/api/skills";
      const method = editing ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, order: Number(form.order) }) });
      if (res.ok) { setMsg({ type: "success", text: editing ? "Skill updated!" : "Skill added!" }); refetch(); cancel(); }
      else setMsg({ type: "error", text: "Failed to save." });
    } catch { setMsg({ type: "error", text: "Something went wrong." }); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this skill?")) return;
    const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
    if (res.ok) { setMsg({ type: "success", text: "Deleted." }); refetch(); }
  }

  return (
    <AdminSection title="Skills" action={<AddButton onClick={openAdd} />}>
      <AlertBox type={msg.type} message={msg.text} />

      <AdminTable headers={["Icon", "Skill Name", "Category", "Order", "Actions"]}>
        {loading
          ? <AdminTr><AdminTd muted>Loading…</AdminTd></AdminTr>
          : skills?.map(s => (
              <AdminTr key={s._id}>
                <AdminTd>
                  {s.iconUrl
                    ? <img src={s.iconUrl} alt={s.name} style={{ width: "24px", height: "24px", objectFit: "contain" }} />
                    : <span style={{ color: "#06D001", fontWeight: 700, fontSize: "0.813rem" }}>{s.name.slice(0, 2)}</span>
                  }
                </AdminTd>
                <AdminTd>{s.name}</AdminTd>
                <AdminTd><StatusBadge label={s.category} type={s.category} /></AdminTd>
                <AdminTd muted>{s.order}</AdminTd>
                <AdminTd>
                  <EditBtn onClick={() => openEdit(s)} />
                  <DeleteBtn onClick={() => handleDelete(s._id)} />
                </AdminTd>
              </AdminTr>
            ))}
      </AdminTable>

      {showForm && (
        <AdminForm title={editing ? "Edit Skill" : "Add Skill"} onSubmit={handleSubmit} loading={saving} onCancel={cancel}>
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
          <FormRow>
            <FormField label="Icon URL (Cloudinary or /assets/img/skill/...)">
              <AdminInput value={form.iconUrl} onChange={set("iconUrl")} placeholder="/assets/img/skill/salesforce.svg" />
            </FormField>
            <FormField label="Display Order">
              <AdminInput value={form.order} onChange={set("order")} type="number" placeholder="1" />
            </FormField>
          </FormRow>
        </AdminForm>
      )}
    </AdminSection>
  );
}