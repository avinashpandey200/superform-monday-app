import React, { useState, useEffect } from "react";
import { Form, FormField } from "../../types";
import FieldInput from "./FieldInput";
import { submitForm } from "../../api";

interface Props {
  form: Form;
  prefillData?: Record<string, string>;
  existingItemId?: string;
}

const evaluateLogic = (field: FormField, values: Record<string, string>): boolean => {
  if (!field.logic || field.logic.conditions.length === 0) return true;

  const allMet = field.logic.conditions.every((cond) => {
    const val = values[cond.fieldId] || "";
    switch (cond.operator) {
      case "equals": return val === cond.value;
      case "not_equals": return val !== cond.value;
      case "contains": return val.includes(cond.value);
      case "is_empty": return val === "";
      case "is_not_empty": return val !== "";
      default: return true;
    }
  });

  return field.logic.action === "show" ? allMet : !allMet;
};

const FormRenderer: React.FC<Props> = ({ form, prefillData = {}, existingItemId }) => {
  const [values, setValues] = useState<Record<string, string>>(prefillData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setValues(prefillData);
  }, [prefillData]);

  const theme = form.settings.customTheme;
  const primaryColor = theme?.primaryColor || "#0073ea";
  const bgColor = theme?.backgroundColor || "#ffffff";
  const fontFamily = theme?.fontFamily || "Roboto, sans-serif";

  const setValue = (fieldId: string, value: string) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) setErrors((prev) => ({ ...prev, [fieldId]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    form.fields.forEach((field) => {
      if (!evaluateLogic(field, values)) return;
      if (field.required && !values[field.id]) {
        newErrors[field.id] = `${field.label} is required`;
      }
      if (field.type === "email" && values[field.id] && !/\S+@\S+\.\S+/.test(values[field.id])) {
        newErrors[field.id] = "Please enter a valid email address";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const result = await submitForm(form._id!, values, existingItemId);
      setMessage(result.message);
      setSubmitted(true);
      if (result.redirectUrl) setTimeout(() => { window.location.href = result.redirectUrl!; }, 2000);
    } catch {
      setMessage("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ ...styles.page, background: bgColor, fontFamily }}>
        <div style={styles.successBox}>
          <div style={styles.successIcon}>✅</div>
          <h2 style={{ ...styles.successTitle, color: primaryColor }}>{message}</h2>
        </div>
      </div>
    );
  }

  const visibleFields = form.fields.filter((f) => evaluateLogic(f, values));

  return (
    <div style={{ ...styles.page, background: bgColor, fontFamily }}>
      <div style={styles.card}>
        <div style={{ ...styles.cardHeader, background: primaryColor }}>
          <h1 style={styles.formTitle}>{form.title}</h1>
          {form.description && <p style={styles.formDesc}>{form.description}</p>}
        </div>

        <form onSubmit={handleSubmit} style={styles.formBody}>
          {visibleFields.map((field) => (
            <div key={field.id} style={styles.fieldRow}>
              <label style={styles.fieldLabel}>
                {field.label}
                {field.required && <span style={{ color: "#e53935" }}> *</span>}
              </label>
              <FieldInput
                field={field}
                value={values[field.id] || ""}
                onChange={(val) => setValue(field.id, val)}
                primaryColor={primaryColor}
              />
              {errors[field.id] && <span style={styles.errorMsg}>{errors[field.id]}</span>}
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
            style={{ ...styles.submitBtn, background: primaryColor }}
          >
            {submitting ? "Submitting..." : existingItemId ? "Update Item" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },
  card: {
    width: "100%",
    maxWidth: "640px",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  cardHeader: {
    padding: "28px 32px",
    color: "#fff",
  },
  formTitle: { margin: 0, fontSize: "24px", fontWeight: 700 },
  formDesc: { margin: "8px 0 0", opacity: 0.9, fontSize: "15px" },
  formBody: { padding: "28px 32px" },
  fieldRow: { marginBottom: "20px" },
  fieldLabel: { display: "block", fontSize: "14px", fontWeight: 600, color: "#333", marginBottom: "6px" },
  errorMsg: { color: "#e53935", fontSize: "12px", marginTop: "4px", display: "block" },
  submitBtn: {
    width: "100%",
    padding: "13px",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "8px",
    transition: "opacity 0.15s",
  },
  successBox: {
    background: "#fff",
    borderRadius: "16px",
    padding: "60px 40px",
    textAlign: "center",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    maxWidth: 480,
    width: "100%",
  },
  successIcon: { fontSize: "56px", marginBottom: "16px" },
  successTitle: { fontSize: "22px", fontWeight: 700 },
};

export default FormRenderer;
