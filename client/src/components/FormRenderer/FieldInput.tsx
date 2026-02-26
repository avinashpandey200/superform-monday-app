import React from "react";
import { FormField } from "../../types";

interface Props {
  field: FormField;
  value: string;
  onChange: (val: string) => void;
  primaryColor?: string;
}

const inputStyle = (primaryColor = "#0073ea"): React.CSSProperties => ({
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #ddd",
  borderRadius: "7px",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  transition: "border-color 0.15s",
});

const FieldInput: React.FC<Props> = ({ field, value, onChange, primaryColor }) => {
  const base = inputStyle(primaryColor);

  switch (field.type) {
    case "long_text":
      return (
        <textarea
          style={{ ...base, resize: "vertical", minHeight: 100 }}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
        />
      );

    case "email":
      return (
        <input type="email" style={base} value={value} placeholder={field.placeholder || "email@example.com"} onChange={(e) => onChange(e.target.value)} />
      );

    case "phone":
      return (
        <input type="tel" style={base} value={value} placeholder={field.placeholder || "+1 (555) 000-0000"} onChange={(e) => onChange(e.target.value)} />
      );

    case "number":
      return (
        <input type="number" style={base} value={value} placeholder={field.placeholder || "0"} onChange={(e) => onChange(e.target.value)} />
      );

    case "date":
      return <input type="date" style={base} value={value} onChange={(e) => onChange(e.target.value)} />;

    case "hour":
      return <input type="time" style={base} value={value} onChange={(e) => onChange(e.target.value)} />;

    case "week":
      return <input type="week" style={base} value={value} onChange={(e) => onChange(e.target.value)} />;

    case "checkbox":
      return (
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={value === "true"}
            onChange={(e) => onChange(e.target.checked ? "true" : "false")}
            style={{ width: 18, height: 18, accentColor: primaryColor, cursor: "pointer" }}
          />
          <span style={{ fontSize: 14, color: "#333" }}>{field.label}</span>
        </label>
      );

    case "dropdown":
    case "status":
      return (
        <select style={base} value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">-- Select --</option>
          {(field.options || []).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );

    case "tags":
      return (
        <div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
            {(field.options || []).map((opt) => {
              const selected = value.split(",").filter(Boolean).includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    const current = value.split(",").filter(Boolean);
                    const updated = selected ? current.filter((t) => t !== opt) : [...current, opt];
                    onChange(updated.join(","));
                  }}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 20,
                    border: `2px solid ${selected ? primaryColor : "#ddd"}`,
                    background: selected ? primaryColor : "#fff",
                    color: selected ? "#fff" : "#333",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                    transition: "all 0.15s",
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      );

    case "rating":
      return (
        <div style={{ display: "flex", gap: 6 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => onChange(String(star))}
              style={{
                fontSize: 28,
                cursor: "pointer",
                color: Number(value) >= star ? "#ffc107" : "#ddd",
                transition: "color 0.1s",
              }}
            >
              ★
            </span>
          ))}
        </div>
      );

    case "world_clock":
      return (
        <select style={base} value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">-- Select Timezone --</option>
          {(Intl as unknown as { supportedValuesOf: (key: string) => string[] }).supportedValuesOf("timeZone").map((tz: string) => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
      );

    case "people":
      return (
        <input type="text" style={base} value={value} placeholder="Search people..." onChange={(e) => onChange(e.target.value)} />
      );

    default:
      return (
        <input type="text" style={base} value={value} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />
      );
  }
};

export default FieldInput;
