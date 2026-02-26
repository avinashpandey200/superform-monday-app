import React from "react";
import { FormField, FieldLogic } from "../../types";

interface Props {
  field: FormField;
  allFields: FormField[];
  onChange: (updated: FormField) => void;
  onDelete: () => void;
}

const FieldEditor: React.FC<Props> = ({ field, allFields, onChange, onDelete }) => {
  const update = (partial: Partial<FormField>) => onChange({ ...field, ...partial });

  const addOption = () => update({ options: [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`] });
  const removeOption = (i: number) => update({ options: field.options?.filter((_, idx) => idx !== i) });
  const updateOption = (i: number, val: string) =>
    update({ options: field.options?.map((o, idx) => (idx === i ? val : o)) });

  const updateLogic = (logic: FieldLogic | undefined) => update({ logic });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.typeTag}>{field.type}</span>
        <button onClick={onDelete} style={styles.deleteBtn} title="Remove field">✕</button>
      </div>

      <label style={styles.label}>Label</label>
      <input style={styles.input} value={field.label} onChange={(e) => update({ label: e.target.value })} />

      <label style={styles.label}>Placeholder</label>
      <input
        style={styles.input}
        value={field.placeholder || ""}
        onChange={(e) => update({ placeholder: e.target.value })}
      />

      <label style={styles.checkRow}>
        <input type="checkbox" checked={field.required} onChange={(e) => update({ required: e.target.checked })} />
        <span>Required</span>
      </label>

      {(field.type === "dropdown" || field.type === "status" || field.type === "tags") && (
        <div style={styles.section}>
          <label style={styles.label}>Options</label>
          {(field.options || []).map((opt, i) => (
            <div key={i} style={styles.optionRow}>
              <input
                style={{ ...styles.input, flex: 1, marginBottom: 0 }}
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
              />
              <button onClick={() => removeOption(i)} style={styles.removeBtn}>✕</button>
            </div>
          ))}
          <button onClick={addOption} style={styles.addBtn}>+ Add Option</button>
        </div>
      )}

      <div style={styles.section}>
        <label style={styles.label}>Conditional Logic</label>
        {field.logic ? (
          <div>
            <select
              style={styles.input}
              value={field.logic.action}
              onChange={(e) =>
                updateLogic({ ...field.logic!, action: e.target.value as "show" | "hide" })
              }
            >
              <option value="show">Show this field when...</option>
              <option value="hide">Hide this field when...</option>
            </select>
            {field.logic.conditions.map((cond, i) => (
              <div key={i} style={styles.conditionRow}>
                <select
                  style={{ ...styles.input, flex: 1, marginBottom: 0 }}
                  value={cond.fieldId}
                  onChange={(e) => {
                    const conditions = field.logic!.conditions.map((c, ci) =>
                      ci === i ? { ...c, fieldId: e.target.value } : c
                    );
                    updateLogic({ ...field.logic!, conditions });
                  }}
                >
                  <option value="">Select field</option>
                  {allFields
                    .filter((f) => f.id !== field.id)
                    .map((f) => (
                      <option key={f.id} value={f.id}>{f.label}</option>
                    ))}
                </select>
                <select
                  style={{ ...styles.input, flex: 1, marginBottom: 0 }}
                  value={cond.operator}
                  onChange={(e) => {
                    const conditions = field.logic!.conditions.map((c, ci) =>
                      ci === i ? { ...c, operator: e.target.value as LogicCondition["operator"] } : c
                    );
                    updateLogic({ ...field.logic!, conditions });
                  }}
                >
                  <option value="equals">equals</option>
                  <option value="not_equals">not equals</option>
                  <option value="contains">contains</option>
                  <option value="is_empty">is empty</option>
                  <option value="is_not_empty">is not empty</option>
                </select>
                <input
                  style={{ ...styles.input, flex: 1, marginBottom: 0 }}
                  value={cond.value}
                  placeholder="Value"
                  onChange={(e) => {
                    const conditions = field.logic!.conditions.map((c, ci) =>
                      ci === i ? { ...c, value: e.target.value } : c
                    );
                    updateLogic({ ...field.logic!, conditions });
                  }}
                />
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <button
                style={styles.addBtn}
                onClick={() =>
                  updateLogic({
                    ...field.logic!,
                    conditions: [
                      ...field.logic!.conditions,
                      { fieldId: "", operator: "equals", value: "" },
                    ],
                  })
                }
              >
                + Add Condition
              </button>
              <button style={{ ...styles.addBtn, background: "#fff0f0", color: "#e53935" }} onClick={() => updateLogic(undefined)}>
                Remove Logic
              </button>
            </div>
          </div>
        ) : (
          <button
            style={styles.addBtn}
            onClick={() => updateLogic({ conditions: [{ fieldId: "", operator: "equals", value: "" }], action: "show" })}
          >
            + Add Logic
          </button>
        )}
      </div>
    </div>
  );
};

type LogicCondition = import("../../types").LogicCondition;

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "14px",
    marginBottom: "10px",
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  typeTag: {
    fontSize: "11px",
    background: "#e3f2fd",
    color: "#1565c0",
    padding: "2px 8px",
    borderRadius: "12px",
    fontWeight: 600,
    textTransform: "uppercase",
  },
  deleteBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#999",
    fontSize: "16px",
    padding: "0 4px",
  },
  label: { display: "block", fontSize: "12px", fontWeight: 600, color: "#555", marginBottom: "4px" },
  input: {
    width: "100%",
    padding: "7px 10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "13px",
    marginBottom: "10px",
    boxSizing: "border-box",
  },
  checkRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    cursor: "pointer",
    marginBottom: "10px",
  },
  section: { borderTop: "1px solid #f0f0f0", paddingTop: "10px", marginTop: "4px" },
  optionRow: { display: "flex", gap: "6px", alignItems: "center", marginBottom: "6px" },
  removeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#e53935",
    fontSize: "14px",
    padding: "0 4px",
  },
  addBtn: {
    background: "#f0f4ff",
    border: "1px solid #c0d0ff",
    color: "#1a56db",
    borderRadius: "5px",
    padding: "5px 10px",
    fontSize: "12px",
    cursor: "pointer",
    fontWeight: 600,
  },
  conditionRow: { display: "flex", gap: "6px", marginBottom: "6px", flexWrap: "wrap" },
};

export default FieldEditor;
