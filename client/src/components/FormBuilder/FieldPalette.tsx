import React from "react";
import { ColumnType } from "../../types";

interface FieldType {
  type: ColumnType;
  label: string;
  icon: string;
}

const FIELD_TYPES: FieldType[] = [
  { type: "text", label: "Short Text", icon: "✏️" },
  { type: "long_text", label: "Long Text", icon: "📝" },
  { type: "email", label: "Email", icon: "📧" },
  { type: "phone", label: "Phone", icon: "📞" },
  { type: "number", label: "Number", icon: "🔢" },
  { type: "date", label: "Date", icon: "📅" },
  { type: "dropdown", label: "Dropdown", icon: "⬇️" },
  { type: "checkbox", label: "Checkbox", icon: "☑️" },
  { type: "rating", label: "Rating", icon: "⭐" },
  { type: "status", label: "Status", icon: "🔵" },
  { type: "tags", label: "Tags", icon: "🏷️" },
  { type: "people", label: "People", icon: "👤" },
  { type: "hour", label: "Hour", icon: "⏰" },
  { type: "week", label: "Week", icon: "📆" },
  { type: "world_clock", label: "World Clock", icon: "🌍" },
  { type: "dependency", label: "Dependency", icon: "🔗" },
];

interface Props {
  onAddField: (type: ColumnType) => void;
}

const FieldPalette: React.FC<Props> = ({ onAddField }) => {
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Add Fields</h3>
      <div style={styles.grid}>
        {FIELD_TYPES.map((ft) => (
          <button key={ft.type} style={styles.fieldBtn} onClick={() => onAddField(ft.type)}>
            <span style={styles.icon}>{ft.icon}</span>
            <span style={styles.label}>{ft.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "16px",
    background: "#f8f9fa",
    borderRight: "1px solid #e0e0e0",
    width: "200px",
    overflowY: "auto",
    height: "100%",
  },
  title: {
    fontSize: "13px",
    fontWeight: 700,
    color: "#333",
    marginBottom: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  grid: { display: "flex", flexDirection: "column", gap: "6px" },
  fieldBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 10px",
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    textAlign: "left",
    transition: "all 0.15s",
    color: "#333",
  },
  icon: { fontSize: "16px" },
  label: { fontWeight: 500 },
};

export default FieldPalette;
