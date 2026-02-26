import React, { useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { v4 as uuidv4 } from "uuid";
import { Form, FormField, ColumnType } from "../../types";
import FieldPalette from "./FieldPalette";
import FieldEditor from "./FieldEditor";
import FormSettings from "./FormSettings";

interface Props {
  form: Form;
  onChange: (form: Form) => void;
  onSave: () => void;
  saving: boolean;
}

const SortableField: React.FC<{
  field: FormField;
  allFields: FormField[];
  onChange: (f: FormField) => void;
  onDelete: () => void;
}> = ({ field, allFields, onChange, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, position: "relative" }}
    >
      <div style={dragHandleStyle} {...attributes} {...listeners} title="Drag to reorder">⠿</div>
      <FieldEditor field={field} allFields={allFields} onChange={onChange} onDelete={onDelete} />
    </div>
  );
};

const dragHandleStyle: React.CSSProperties = {
  position: "absolute",
  left: -22,
  top: 14,
  cursor: "grab",
  color: "#bbb",
  fontSize: "18px",
  userSelect: "none",
};

const FormBuilder: React.FC<Props> = ({ form, onChange, onSave, saving }) => {
  const [activeTab, setActiveTab] = useState<"fields" | "settings">("fields");

  const addField = (type: ColumnType) => {
    const newField: FormField = {
      id: uuidv4(),
      type,
      label: `New ${type.replace(/_/g, " ")} field`,
      required: false,
      options: ["dropdown", "status", "tags"].includes(type) ? ["Option 1", "Option 2"] : undefined,
    };
    onChange({ ...form, fields: [...form.fields, newField] });
  };

  const updateField = (index: number, updated: FormField) => {
    const fields = [...form.fields];
    fields[index] = updated;
    onChange({ ...form, fields });
  };

  const deleteField = (index: number) => {
    onChange({ ...form, fields: form.fields.filter((_, i) => i !== index) });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = form.fields.findIndex((f) => f.id === active.id);
      const newIndex = form.fields.findIndex((f) => f.id === over.id);
      onChange({ ...form, fields: arrayMove(form.fields, oldIndex, newIndex) });
    }
  };

  return (
    <div style={styles.wrapper}>
      <FieldPalette onAddField={addField} />

      <div style={styles.main}>
        <div style={styles.topBar}>
          <div>
            <input
              style={styles.titleInput}
              value={form.title}
              onChange={(e) => onChange({ ...form, title: e.target.value })}
              placeholder="Form title..."
            />
            <input
              style={styles.descInput}
              value={form.description}
              onChange={(e) => onChange({ ...form, description: e.target.value })}
              placeholder="Form description (optional)..."
            />
          </div>
          <div style={styles.actions}>
            <div style={styles.tabs}>
              <button
                style={{ ...styles.tab, ...(activeTab === "fields" ? styles.tabActive : {}) }}
                onClick={() => setActiveTab("fields")}
              >
                Fields
              </button>
              <button
                style={{ ...styles.tab, ...(activeTab === "settings" ? styles.tabActive : {}) }}
                onClick={() => setActiveTab("settings")}
              >
                Settings
              </button>
            </div>
            <button onClick={onSave} disabled={saving} style={styles.saveBtn}>
              {saving ? "Saving..." : "Save Form"}
            </button>
          </div>
        </div>

        <div style={styles.canvas}>
          {activeTab === "fields" ? (
            form.fields.length === 0 ? (
              <div style={styles.empty}>
                <p>👈 Click a field type from the left to add it to your form.</p>
              </div>
            ) : (
              <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={form.fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                  <div style={{ paddingLeft: 28 }}>
                    {form.fields.map((field, index) => (
                      <SortableField
                        key={field.id}
                        field={field}
                        allFields={form.fields}
                        onChange={(updated) => updateField(index, updated)}
                        onDelete={() => deleteField(index)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )
          ) : (
            <FormSettings
              settings={form.settings}
              onChange={(settings) => onChange({ ...form, settings })}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: { display: "flex", height: "calc(100vh - 60px)", overflow: "hidden" },
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "16px 24px",
    borderBottom: "1px solid #e0e0e0",
    background: "#fff",
    gap: 16,
    flexWrap: "wrap",
  },
  titleInput: {
    fontSize: "22px",
    fontWeight: 700,
    border: "none",
    outline: "none",
    color: "#1a1a1a",
    width: "100%",
    marginBottom: "4px",
  },
  descInput: {
    fontSize: "14px",
    border: "none",
    outline: "none",
    color: "#666",
    width: "100%",
  },
  actions: { display: "flex", alignItems: "center", gap: "12px" },
  tabs: { display: "flex", gap: "4px", background: "#f0f0f0", borderRadius: "8px", padding: "3px" },
  tab: {
    padding: "6px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    background: "transparent",
    color: "#666",
  },
  tabActive: { background: "#fff", color: "#0073ea", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  saveBtn: {
    padding: "8px 20px",
    background: "#0073ea",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
  },
  canvas: { flex: 1, overflowY: "auto", padding: "20px 24px", background: "#f8f9fa" },
  empty: {
    textAlign: "center",
    padding: "80px 20px",
    color: "#999",
    fontSize: "16px",
    background: "#fff",
    borderRadius: "12px",
    border: "2px dashed #ddd",
  },
};

export default FormBuilder;
