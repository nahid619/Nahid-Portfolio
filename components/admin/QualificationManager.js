// components/admin/QualificationManager.js
"use client";

import { useState } from "react";
import React from "react";
import { useFetch } from "@/hooks/useFetch";
import {
  AdminSection, AddButton, AdminTable, AdminTr, AdminTd,
  EditBtn, DeleteBtn, AdminForm, FormRow, FormField,
  AdminInput, AdminTextarea, AdminSelect, AlertBox,
} from "./AdminUI";

const EMPTY = { title: "", subtitle: "", institution: "", period: "", detail: "", highlights: "", side: "left", order: 0 };

function QualForm({ form, setForm, onSubmit, saving, onCancel, isNew }) {
  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target.value })); }
  return (
    <AdminForm title={isNew ? "Add Education Entry" : "Edit Education Entry"} onSubmit={onSubmit} loading={saving} onCancel={onCancel}>
      <FormRow>
        <FormField label="Title (e.g. B.Sc. in CSE)">
          <AdminInput value={form.title} onChange={set("title")} placeholder="B.Sc. in CSE" required />
        </FormField>
        <FormField label="Subtitle / Degree">
          <AdminInput value={form.subtitle} onChange={set("subtitle")} placeholder="Computer Science and Engineering" />
        </FormField>
      </FormRow>
      <FormRow>
        <FormField label="Institution Name">
          <AdminInput value={form.institution} onChange={set("institution")} placeholder="Varendra University, Rajshahi" required />
        </FormField>
        <FormField label="Period (e.g. 2020 – 2024)">
          <AdminInput value={form.period} onChange={set("period")} placeholder="2020 – 2024" required />
        </FormField>
      </FormRow>
      <FormField label="Result / Detail (e.g. CGPA: 3.70 / 4.00)">
        <AdminInput value={form.detail} onChange={set("detail")} placeholder="CGPA: 3.70 / 4.00" />
      </FormField>
      <FormField label="Highlights (one per line)">
        <AdminTextarea value={form.highlights} onChange={set("highlights")} placeholder={"Algorithms, DBMS, Data Structures\nPlaced 4th in coding competition"} rows={4} />
      </FormField>
      <FormRow>
        <FormField label="Timeline Side">
          <AdminSelect value={form.side} onChange={set("side")}>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </AdminSelect>
        </FormField>
        <FormField label="Display Order">
          <AdminInput value={form.order} onChange={set("order")} type="number" placeholder="1" />
        </FormField>
      </FormRow>
    </AdminForm>
  );
}

export default function QualificationManager() {
  const { data: quals, loading, refetch } = useFetch("/api/qualifications");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState({ type: "", text: "" });

  function openAdd() { setEditingId("new"); setForm(EMPTY); setMsg({ type: "", text: "" }); }
  function openEdit(q) {
    setEditingId(q._id);
    setForm({ ...q, highlights: Array.isArray(q.highlights) ? q.highlights.join("\n") : (q.highlights || "") });
    setMsg({ type: "", text: "" });
  }
  function cancel() { setEditingId(null); setForm(EMPTY); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        highlights: form.highlights ? form.highlights.split("\n").map(s => s.trim()).filter(Boolean) : [],
        order: Number(form.order),
      };
      const isNew  = editingId === "new";
      const url    = isNew ? "/api/qualifications" : `/api/qualifications/${editingId}`;
      const method = isNew ? "POST" : "PUT";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) { setMsg({ type: "success", text: isNew ? "Added!" : "Updated!" }); refetch(); cancel(); }
      else { const d = await res.json(); setMsg({ type: "error", text: d.message || "Failed." }); }
    } catch { setMsg({ type: "error", text: "Network error." }); }
    finally { setSaving(false); }
  }

  async function handleDelete(id, title) {
    if (!confirm(`Delete "${title}"?`)) return;
    const res = await fetch(`/api/qualifications/${id}`, { method: "DELETE" });
    if (res.ok) { setMsg({ type: "success", text: "Deleted." }); refetch(); }
  }

  return (
    <AdminSection title="Qualifications / Education" action={<AddButton onClick={openAdd} />}>
      <AlertBox type={msg.type} message={msg.text} />

      {editingId === "new" && (
        <div style={{ background: "#011428", border: "1px solid #059212", borderRadius: "8px", padding: "1rem", marginBottom: "1rem" }}>
          <QualForm form={form} setForm={setForm} onSubmit={handleSubmit} saving={saving} onCancel={cancel} isNew />
        </div>
      )}

      <AdminTable headers={["Title", "Institution", "Period", "Side", "Order", "Actions"]}>
        {loading
          ? <AdminTr><AdminTd muted>Loading…</AdminTd></AdminTr>
          : quals?.map(q => (
              <React.Fragment key={q._id}>
                <AdminTr>
                  <AdminTd>{q.title}</AdminTd>
                  <AdminTd muted>{q.institution}</AdminTd>
                  <AdminTd muted>{q.period}</AdminTd>
                  <AdminTd muted>{q.side}</AdminTd>
                  <AdminTd muted>{q.order}</AdminTd>
                  <AdminTd>
                    <EditBtn onClick={() => editingId === q._id ? cancel() : openEdit(q)} />
                    <DeleteBtn onClick={() => handleDelete(q._id, q.title)} />
                  </AdminTd>
                </AdminTr>
                {editingId === q._id && (
                  <tr>
                    <td colSpan={6} style={{ padding: 0 }}>
                      <div style={{ padding: "1rem", background: "#011428", borderTop: "2px solid #059212", borderBottom: "1px solid #02275b" }}>
                        <QualForm form={form} setForm={setForm} onSubmit={handleSubmit} saving={saving} onCancel={cancel} isNew={false} />
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