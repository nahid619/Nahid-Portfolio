"use client";

import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import {
  AdminSection, AddButton, AdminTable, AdminTr, AdminTd,
  EditBtn, DeleteBtn, AdminForm, FormRow, FormField,
  AdminInput, AdminSelect, StatusBadge, AlertBox,
} from "./AdminUI";

const EMPTY = { name: "", url: "", logo: "", showIn: "both", order: 0 };

export default function SocialLinksManager() {
  const { data: links, loading, refetch } = useFetch("/api/social-links");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY);
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState({ type: "", text: "" });

  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target.value })); }
  function openAdd() { setEditing(null); setForm(EMPTY); setShowForm(true); setMsg({ type: "", text: "" }); }
  function openEdit(l) { setEditing(l._id); setForm(l); setShowForm(true); setMsg({ type: "", text: "" }); }
  function cancel() { setShowForm(false); setEditing(null); setForm(EMPTY); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const url    = editing ? `/api/social-links/${editing}` : "/api/social-links";
      const method = editing ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, order: Number(form.order) }) });
      if (res.ok) { setMsg({ type: "success", text: editing ? "Updated!" : "Added!" }); refetch(); cancel(); }
      else setMsg({ type: "error", text: "Failed to save." });
    } catch { setMsg({ type: "error", text: "Something went wrong." }); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this link?")) return;
    const res = await fetch(`/api/social-links/${id}`, { method: "DELETE" });
    if (res.ok) { setMsg({ type: "success", text: "Deleted." }); refetch(); }
  }

  const showInLabel = { both: "Both", footer: "Footer only", "contact-modal": "Contact modal only" };

  return (
    <AdminSection title="Social & Profile Links" action={<AddButton onClick={openAdd} />}>
      <AlertBox type={msg.type} message={msg.text} />

      <div style={{ color: "#bcc4ba", fontSize: "0.813rem", marginBottom: "1rem", padding: "10px 14px", background: "#011428", borderRadius: "6px", border: "1px solid #02275b" }}>
        💡 <strong style={{ color: "white" }}>Show In</strong> controls where each link appears: <em>Both</em> = nav icons + footer + contact modal, <em>Footer only</em> = footer column, <em>Contact modal only</em> = contact modal options.
      </div>

      <AdminTable headers={["Logo", "Platform", "URL", "Show In", "Order", "Actions"]}>
        {loading
          ? <AdminTr><AdminTd muted>Loading…</AdminTd></AdminTr>
          : links?.map(l => (
              <AdminTr key={l._id}>
                <AdminTd>
                  <span style={{ fontSize: "1.1rem" }}>{l.logo}</span>
                </AdminTd>
                <AdminTd>{l.name}</AdminTd>
                <AdminTd muted>
                  <span style={{ fontSize: "0.75rem", display: "block", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {l.url}
                  </span>
                </AdminTd>
                <AdminTd>
                  <StatusBadge label={showInLabel[l.showIn] || l.showIn} type={l.showIn === "both" ? "current" : "default"} />
                </AdminTd>
                <AdminTd muted>{l.order}</AdminTd>
                <AdminTd>
                  <EditBtn onClick={() => openEdit(l)} />
                  <DeleteBtn onClick={() => handleDelete(l._id)} />
                </AdminTd>
              </AdminTr>
            ))}
      </AdminTable>

      {showForm && (
        <AdminForm title={editing ? "Edit Link" : "Add New Link"} onSubmit={handleSubmit} loading={saving} onCancel={cancel}>
          <FormRow>
            <FormField label="Platform Name">
              <AdminInput value={form.name} onChange={set("name")} placeholder="e.g. LinkedIn" required />
            </FormField>
            <FormField label="Logo / Emoji / Short text">
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
      )}
    </AdminSection>
  );
}