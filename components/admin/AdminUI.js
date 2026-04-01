"use client";

// ── Reusable admin UI building blocks ──────────────────────────

export function AdminSection({ title, action, children }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h2 style={{ color: "white", fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

export function AddButton({ onClick, label = "+ Add New" }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "linear-gradient(135deg,#059212,#06D001)",
        color: "white", border: "none",
        padding: "7px 16px", borderRadius: "6px",
        fontSize: "0.813rem", fontWeight: 700,
        cursor: "pointer", fontFamily: "inherit",
        transition: "opacity 0.2s",
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
    >
      {label}
    </button>
  );
}

export function AdminTable({ headers, children, emptyMessage = "No items yet." }) {
  return (
    <div style={{ overflowX: "auto", borderRadius: "8px", border: "1px solid #02275b" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
        <thead>
          <tr style={{ background: "#011428" }}>
            {headers.map(h => (
              <th key={h} style={{ textAlign: "left", padding: "10px 14px", color: "#bcc4ba", fontWeight: 600, fontSize: "0.75rem", letterSpacing: "0.05em", textTransform: "uppercase", borderBottom: "1px solid #02275b", whiteSpace: "nowrap" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function AdminTr({ children }) {
  return (
    <tr
      style={{ borderBottom: "1px solid #02275b", transition: "background 0.15s" }}
      onMouseEnter={e => e.currentTarget.style.background = "#011428"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      {children}
    </tr>
  );
}

export function AdminTd({ children, muted }) {
  return (
    <td style={{ padding: "10px 14px", color: muted ? "#bcc4ba" : "white", verticalAlign: "middle" }}>
      {children}
    </td>
  );
}

export function EditBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{ background: "transparent", border: "none", color: "#06D001", fontSize: "0.813rem", cursor: "pointer", padding: "2px 8px", fontFamily: "inherit" }}>
      Edit
    </button>
  );
}

export function DeleteBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{ background: "transparent", border: "none", color: "#ef4444", fontSize: "0.813rem", cursor: "pointer", padding: "2px 8px", fontFamily: "inherit" }}>
      Del
    </button>
  );
}

export function AdminForm({ title, onSubmit, loading, onCancel, children }) {
  return (
    <div style={{ background: "#011428", border: "1px solid #02275b", borderRadius: "10px", padding: "1.25rem", marginTop: "1.25rem" }}>
      {title && <h3 style={{ color: "white", fontSize: "0.938rem", fontWeight: 700, margin: "0 0 1rem" }}>{title}</h3>}
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {children}
        <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
          <button
            type="submit"
            disabled={loading}
            style={{ background: "linear-gradient(135deg,#059212,#06D001)", color: "white", border: "none", padding: "9px 22px", borderRadius: "6px", fontSize: "0.875rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Saving…" : "Save"}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} style={{ background: "transparent", border: "1px solid #02275b", color: "#bcc4ba", padding: "9px 22px", borderRadius: "6px", fontSize: "0.875rem", cursor: "pointer", fontFamily: "inherit" }}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export function FormRow({ children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
      {children}
    </div>
  );
}

export function FormField({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label style={{ color: "#9BEC00", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function AdminInput({ value, onChange, placeholder, type = "text", required, disabled }) {
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      style={{ background: "#00193b", border: "1px solid #02275b", borderRadius: "6px", padding: "8px 12px", color: "white", fontSize: "0.875rem", fontFamily: "inherit", outline: "none", width: "100%", transition: "border-color 0.2s", opacity: disabled ? 0.5 : 1 }}
      onFocus={e => e.target.style.borderColor = "#059212"}
      onBlur={e => e.target.style.borderColor = "#02275b"}
    />
  );
}

export function AdminTextarea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      value={value ?? ""}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      style={{ background: "#00193b", border: "1px solid #02275b", borderRadius: "6px", padding: "8px 12px", color: "white", fontSize: "0.875rem", fontFamily: "inherit", outline: "none", width: "100%", resize: "vertical", transition: "border-color 0.2s" }}
      onFocus={e => e.target.style.borderColor = "#059212"}
      onBlur={e => e.target.style.borderColor = "#02275b"}
    />
  );
}

export function AdminSelect({ value, onChange, children }) {
  return (
    <select
      value={value ?? ""}
      onChange={onChange}
      style={{ background: "#00193b", border: "1px solid #02275b", borderRadius: "6px", padding: "8px 12px", color: "white", fontSize: "0.875rem", fontFamily: "inherit", outline: "none", width: "100%", cursor: "pointer" }}
    >
      {children}
    </select>
  );
}

export function StatusBadge({ label, type = "default" }) {
  const colors = {
    default:    { bg: "#02275b",  color: "#bcc4ba"  },
    salesforce: { bg: "#0c2a4a",  color: "#60a5fa"  },
    sqa:        { bg: "#0e3501",  color: "#9BEC00"  },
    web:        { bg: "#2d1b00",  color: "#fb923c"  },
    programming:{ bg: "#2d0045",  color: "#c084fc"  },
    current:    { bg: "#0e3501",  color: "#9BEC00"  },
    past:       { bg: "#02275b",  color: "#bcc4ba"  },
  };
  const c = colors[type] || colors.default;
  return (
    <span style={{ background: c.bg, color: c.color, fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

export function AlertBox({ type = "error", message }) {
  if (!message) return null;
  const colors = { error: { bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)", color: "#ef4444" }, success: { bg: "rgba(5,146,18,0.1)", border: "rgba(5,146,18,0.3)", color: "#06D001" } };
  const c = colors[type] || colors.error;
  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: "6px", padding: "10px 14px", color: c.color, fontSize: "0.813rem", marginBottom: "12px" }}>
      {message}
    </div>
  );
}