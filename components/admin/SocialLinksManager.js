"use client";

import { useState } from "react";
import React from "react";
import { useFetch } from "@/hooks/useFetch";
import {
  AdminSection, AddButton, AdminTable, AdminTr, AdminTd,
  EditBtn, DeleteBtn, AdminForm, FormRow, FormField,
  AdminInput, AdminSelect, StatusBadge, AlertBox,
} from "./AdminUI";

const EMPTY = { name: "", url: "", logo: "", showIn: "both", order: 0 };
const SHOW_IN_LABELS = { both: "Both", footer: "Footer only", "contact-modal": "Contact modal" };

function LinkForm({ form, setForm, onSubmit, saving, onCancel, isNew }) {
  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target.value })); }
  return (
    <AdminForm title={isNew ? "Add Link" : "Edit Link"} onSubmit={onSubmit} loading={saving} onCancel={onCancel}>
      <FormRow>
        <FormField label="Platform Name">
          <AdminInput value={form.name} onChange={set("name")} placeholder="e.g. LinkedIn" required />
        </FormField>
        <FormField label="Logo / Emoji">
          <AdminInput value={form.logo} onChange={set("logo")} placeholder="in  or  GH  or  🏆" />
        </FormField>
      </FormRow>
      <FormField label="Profile URL">
        <AdminInput value={form.url} onChange={set("url")} placeholder="https://linkedin.com/in/…" required />
      </FormField>
      <FormRow>
        <FormField label="Show In">
          <AdminSelect value={form.showIn} onChange={set("showIn")}>
            <option value="both">Both (footer + contact modal)</option>
            <option value="footer">Footer only</option>
            <option value="contact-modal">Contact modal only</option>
          </AdminSelect>
        </FormField>
        <FormField label="Display Order">
          <AdminInput value={form.order} onChange={set("order")} type="number" placeholder="1" />
        </FormField>
      </FormRow>
    </AdminForm>
  );
}

export default function SocialLinksManager() {
  const { data: links, loading, refetch } = useFetch("/api/social-links");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState({ type: "", text: "" });

  function openAdd() { setEditingId("new"); setForm(EMPTY); setMsg({ type: "", text: "" }); }
  function openEdit(l) { setEditingId(l._id); setForm(l); setMsg({ type: "", text: "" }); }
  function cancel() { setEditingId(null); setForm(EMPTY); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const isNew  = editingId === "new";
      const url    = isNew ? "/api/social-links" : `/api/social-links/${editingId}`;
      const method = isNew ? "POST" : "PUT";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, order: Number(form.order) }) });
      if (res.ok) { setMsg({ type: "success", text: isNew ? "Link added!" : "Link updated!" }); refetch(); cancel(); }
      else { const d = await res.json(); setMsg({ type: "error", text: d.message || "Failed." }); }
    } catch { setMsg({ type: "error", text: "Network error." }); }
    finally { setSaving(false); }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"?`)) return;
    const res = await fetch(`/api/social-links/${id}`, { method: "DELETE" });
    if (res.ok) { setMsg({ type: "success", text: "Deleted." }); refetch(); }
  }

  return (
    <AdminSection title="Social & Profile Links" action={<AddButton onClick={openAdd} />}>
      <AlertBox type={msg.type} message={msg.text} />

      <div style={{ color: "#bcc4ba", fontSize: "0.813rem", marginBottom: "1rem", padding: "10px 14px", background: "#011428", borderRadius: "6px", border: "1px solid #02275b" }}>
        💡 <strong style={{ color: "white" }}>Both</strong> = footer + contact modal &nbsp;|&nbsp; <strong style={{ color: "white" }}>Footer only</strong> = footer column &nbsp;|&nbsp; <strong style={{ color: "white" }}>Contact modal only</strong> = contact options
      </div>

      {editingId === "new" && (
        <div style={{ background: "#011428", border: "1px solid #059212", borderRadius: "8px", padding: "1rem", marginBottom: "1rem" }}>
          <LinkForm form={form} setForm={setForm} onSubmit={handleSubmit} saving={saving} onCancel={cancel} isNew />
        </div>
      )}

      <AdminTable headers={["Logo", "Platform", "Show In", "Order", "Actions"]}>
        {loading
          ? <AdminTr><AdminTd muted>Loading…</AdminTd></AdminTr>
          : links?.map(l => (
              <React.Fragment key={l._id}>
                <AdminTr>
                  <AdminTd><span style={{ fontSize: "1.1rem" }}>{l.logo}</span></AdminTd>
                  <AdminTd>
                    <div style={{ fontWeight: 600, color: "white" }}>{l.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "#bcc4ba", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.url}</div>
                  </AdminTd>
                  <AdminTd><StatusBadge label={SHOW_IN_LABELS[l.showIn] || l.showIn} type={l.showIn === "both" ? "current" : "default"} /></AdminTd>
                  <AdminTd muted>{l.order}</AdminTd>
                  <AdminTd>
                    <EditBtn onClick={() => editingId === l._id ? cancel() : openEdit(l)} />
                    <DeleteBtn onClick={() => handleDelete(l._id, l.name)} />
                  </AdminTd>
                </AdminTr>
                {editingId === l._id && (
                  <tr>
                    <td colSpan={5} style={{ padding: 0 }}>
                      <div style={{ padding: "1rem", background: "#011428", borderTop: "2px solid #059212", borderBottom: "1px solid #02275b" }}>
                        <LinkForm form={form} setForm={setForm} onSubmit={handleSubmit} saving={saving} onCancel={cancel} isNew={false} />
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