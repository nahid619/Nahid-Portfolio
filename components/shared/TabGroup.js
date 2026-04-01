"use client";

/**
 * TabGroup
 * Reusable tab switcher used in Skills and Projects sections.
 *
 * Props:
 *   tabs      — array of { label: string, value: string }
 *   active    — currently active tab value
 *   onChange  — (value: string) => void
 */
export default function TabGroup({ tabs = [], active, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        marginBottom: "1.5rem",
        justifyContent: "center",
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === active;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            style={{
              padding: "6px 18px",
              borderRadius: "4px",
              border: "none",
              borderBottom: isActive ? "3px solid #059212" : "3px solid transparent",
              background: "transparent",
              color: isActive ? "#ffffff" : "#bcc4ba",
              fontWeight: isActive ? 700 : 400,
              fontSize: "0.875rem",
              fontFamily: "var(--font-poppins), Poppins, sans-serif",
              cursor: "pointer",
              transition: "color 0.2s, border-color 0.2s",
              letterSpacing: "0.02em",
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.color = "#bcc4ba";
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}