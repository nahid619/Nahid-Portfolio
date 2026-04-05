// components/admin/CategoryPanel.js
"use client";

import { useState } from "react";
import React from "react";
import { useFetch } from "@/hooks/useFetch";
import {
  AdminTable, AdminTr, AdminTd, EditBtn, DeleteBtn,
  AdminForm, FormRow, FormField, AdminInput, AlertBox, AddButton,
} from "./AdminUI";

const EMPTY = { name: "", value: "", order: 0 };

/**
 * CategoryPanel
 * Collapsible panel embedded at the top of SkillsManager and ProjectsManager.
 * Lets admin add, edit, delete, and reorder tabs for a given section.
 *
 * Props:
 *   section — "skills" | "projects"
 */
export default function CategoryPanel({ section }) {
  const { data: categories, loading, refetch } = useFetch(`/api/categories?section=${section}`);
  const [open, setOpen]           = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState({ type: "", text: "" });

  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target.value })); }

  function openAdd() {
    // Default order = next after last
    const nextOrder = categories?.length ? Math.max(...categories.map(c => c.order)) + 1 : 1;
    setEditingId("new");
    setForm({ ...EMPTY, order: nextOrder });
    setMsg({ type: "", text: "" });
  }

  function openEdit(cat) {
    setEditingId(cat._id);
    setForm({ name: cat.name, value: cat.value, order: cat.order });
    setMsg({ type: "", text: "" });
  }

  function cancel() { setEditingId(null); setForm(EMPTY); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: "", text: "" });
    try {
      const isNew  = editingId === "new";
      const url    = isNew ? "/api/categories" : `/api/categories/${editingId}`;
      const method = isNew ? "POST" : "PUT";
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, section, order: Number(form.order) }),
      });
      if (res.ok) {
        setMsg({ type: "success", text: isNew ? "Tab added!" : "Tab updated!" });
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

  async function handleDelete(id, name) {
    if (!confirm(`Delete tab "${name}"?\n\nSkills/projects in this category are NOT deleted — they just won't show in this tab anymore.`)) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMsg({ type: "success", text: "Tab deleted." });
      refetch();
      if (editingId === id) cancel();
    } else {
      setMsg({ type: "error", text: "Failed to delete." });
    }
  }

  // Swap order values between two adjacent categories
  async function moveOrder(cat, direction) {
    if (!categories) return;
    const sorted  = [...categories].sort((a, b) => a.order - b.order);
    const idx     = sorted.findIndex(c => c._id === cat._id);
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;

    const target = sorted[targetIdx];
    await Promise.all([
      fetch(`/api/categories/${cat._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: target.order }),
      }),
      fetch(`/api/categories/${target._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: cat.order }),
      }),
    ]);
    refetch();
  }

  const sorted = categories ? [...categories].sort((a, b) => a.order - b.order) : [];

  return (
    <div style={{
      background: "#011428",
      border: "1px solid #02275b",
      borderRadius: "10px",
      marginBottom: "1.5rem",
      overflow: "hidden",
    }}>
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "white" }}>
            🗂 Manage Tab Categories
          </span>
          {categories && (
            <span style={{
              background: "#02275b",
              color: "#9BEC00",
              fontSize: "0.7rem",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "4px",
            }}>
              {categories.length} tab{categories.length !== 1 ? "s" : ""}
            </span>
          )}
          {categories && (
            <span style={{ color: "#bcc4ba", fontSize: "0.75rem" }}>
              Default: <strong style={{ color: "#06D001" }}>{sorted[0]?.name || "—"}</strong>
            </span>
          )}
        </div>
        <span style={{ color: "#bcc4ba", fontSize: "0.875rem" }}>
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div style={{ padding: "0 16px 16px", borderTop: "1px solid #02275b" }}>

          <AlertBox type={msg.type} message={msg.text} />

          {/* Add new tab form */}
          {editingId === "new" && (
            <div style={{
              background: "#00193b",
              border: "1px solid #059212",
              borderRadius: "8px",
              padding: "1rem",
              marginTop: "1rem",
              marginBottom: "1rem",
            }}>
              <AdminForm
                title="Add New Tab"
                onSubmit={handleSubmit}
                loading={saving}
                onCancel={cancel}
              >
                <FormRow>
                  <FormField label="Display Name">
                    <AdminInput
                      value={form.name}
                      onChange={set("name")}
                      placeholder="e.g. DevOps"
                      required
                    />
                  </FormField>
                  <FormField label="Slug (used as filter)">
                    <AdminInput
                      value={form.value}
                      onChange={set("value")}
                      placeholder='e.g. devops  (leave blank for "All")'
                    />
                  </FormField>
                  <FormField label="Order">
                    <AdminInput
                      value={form.order}
                      onChange={set("order")}
                      type="number"
                      placeholder="1"
                    />
                  </FormField>
                </FormRow>
              </AdminForm>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem", marginBottom: "10px" }}>
            {editingId !== "new" && <AddButton onClick={openAdd} label="+ Add Tab" />}
          </div>

          <AdminTable headers={["Name", "Slug", "Order", "Move", "Actions"]}>
            {loading
              ? <AdminTr><AdminTd muted>Loading…</AdminTd></AdminTr>
              : sorted.map((cat, i) => (
                  <React.Fragment key={cat._id}>
                    <AdminTr>
                      {/* Name + default badge */}
                      <AdminTd>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          {cat.name}
                          {i === 0 && (
                            <span style={{
                              background: "rgba(5,146,18,0.15)",
                              border: "1px solid #059212",
                              color: "#06D001",
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              padding: "1px 6px",
                              borderRadius: "4px",
                            }}>
                              default
                            </span>
                          )}
                        </div>
                      </AdminTd>
                      <AdminTd muted>
                        <code style={{ fontSize: "0.75rem", color: "#9BEC00" }}>
                          {cat.value === "" ? "(all)" : cat.value}
                        </code>
                      </AdminTd>
                      <AdminTd muted>{cat.order}</AdminTd>
                      {/* Move up/down */}
                      <AdminTd>
                        <button
                          onClick={() => moveOrder(cat, "up")}
                          disabled={i === 0}
                          style={{
                            background: "none",
                            border: "1px solid #02275b",
                            color: i === 0 ? "#3a4a3a" : "#bcc4ba",
                            borderRadius: "4px",
                            padding: "2px 7px",
                            cursor: i === 0 ? "not-allowed" : "pointer",
                            marginRight: "4px",
                            fontSize: "0.75rem",
                            opacity: i === 0 ? 0.4 : 1,
                          }}
                          title="Move up"
                        >↑</button>
                        <button
                          onClick={() => moveOrder(cat, "down")}
                          disabled={i === sorted.length - 1}
                          style={{
                            background: "none",
                            border: "1px solid #02275b",
                            color: i === sorted.length - 1 ? "#3a4a3a" : "#bcc4ba",
                            borderRadius: "4px",
                            padding: "2px 7px",
                            cursor: i === sorted.length - 1 ? "not-allowed" : "pointer",
                            fontSize: "0.75rem",
                            opacity: i === sorted.length - 1 ? 0.4 : 1,
                          }}
                          title="Move down"
                        >↓</button>
                      </AdminTd>
                      <AdminTd>
                        <EditBtn onClick={() => editingId === cat._id ? cancel() : openEdit(cat)} />
                        <DeleteBtn onClick={() => handleDelete(cat._id, cat.name)} />
                      </AdminTd>
                    </AdminTr>

                    {/* Inline edit form */}
                    {editingId === cat._id && (
                      <tr>
                        <td colSpan={5} style={{ padding: 0 }}>
                          <div style={{
                            padding: "1rem",
                            background: "#011428",
                            borderTop: "2px solid #059212",
                            borderBottom: "1px solid #02275b",
                          }}>
                            <AdminForm
                              title="Edit Tab"
                              onSubmit={handleSubmit}
                              loading={saving}
                              onCancel={cancel}
                            >
                              <FormRow>
                                <FormField label="Display Name">
                                  <AdminInput value={form.name} onChange={set("name")} required />
                                </FormField>
                                <FormField label="Slug">
                                  <AdminInput value={form.value} onChange={set("value")} />
                                </FormField>
                                <FormField label="Order">
                                  <AdminInput value={form.order} onChange={set("order")} type="number" />
                                </FormField>
                              </FormRow>
                            </AdminForm>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
          </AdminTable>

          <p style={{ color: "#bcc4ba", fontSize: "0.75rem", marginTop: "10px", lineHeight: 1.6 }}>
            💡 The tab with the <strong style={{ color: "white" }}>lowest order number</strong> is the default active tab on page load.
            Use an empty slug for an &quot;All&quot; tab. Changes reflect on the portfolio immediately.
          </p>
        </div>
      )}
    </div>
  );
}