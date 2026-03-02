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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorBanner, setErrorBanner] = useState("");

  useEffect(() => {
    setValues(prefillData);
  }, [prefillData]);

  const theme = form.settings.customTheme;
  const primaryColor = theme?.primaryColor || "#0073ea";
  const bgColor = theme?.backgroundColor || "#f0f4ff";
  const fontFamily = theme?.fontFamily || "Roboto, sans-serif";

  const setValue = (fieldId: string, value: string) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
    if (fieldErrors[fieldId]) setFieldErrors((prev) => ({ ...prev, [fieldId]: "" }));
    if (errorBanner) setErrorBanner("");
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
    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBanner("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const result = await submitForm(form._id!, values, existingItemId);
      setSuccessMessage(result.message || form.settings.successMessage);
      setSubmitted(true);
      if (result.redirectUrl) {
        setTimeout(() => { window.location.href = result.redirectUrl!; }, 2500);
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Something went wrong. Please try again.";
      setErrorBanner(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{ ...styles.page, background: bgColor, fontFamily }}>
        <div style={styles.successCard}>
          <div style={{ ...styles.successStripe, background: primaryColor }} />
          <div style={styles.successBody}>
            <div style={styles.successIconCircle}>
              <span style={styles.successIconEmoji}>✓</span>
            </div>
            <h2 style={{ ...styles.successTitle, color: primaryColor }}>
              {successMessage}
            </h2>
            <p style={styles.successSubtext}>
              Your response has been recorded successfully.
            </p>
            <button
              style={{ ...styles.successBtn, background: primaryColor }}
              onClick={() => { setSubmitted(false); setValues(prefillData); }}
            >
              Submit another response
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────
  const visibleFields = form.fields.filter((f) => evaluateLogic(f, values));

  return (
    <div style={{ ...styles.page, background: bgColor, fontFamily }}>
      <div style={styles.card}>
        <div style={{ ...styles.cardHeader, background: primaryColor }}>
          <h1 style={styles.formTitle}>{form.title}</h1>
          {form.description && <p style={styles.formDesc}>{form.description}</p>}
        </div>

        <form onSubmit={handleSubmit} style={styles.formBody}>

          {/* Error banner */}
          {errorBanner && (
            <div style={styles.errorBanner}>
              <span style={styles.errorBannerIcon}>⚠️</span>
              <span>{errorBanner}</span>
              <button style={styles.errorBannerClose} onClick={() => setErrorBanner("")}>✕</button>
            </div>
          )}

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
              {fieldErrors[field.id] && (
                <span style={styles.fieldErrorMsg}>{fieldErrors[field.id]}</span>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
            style={{
              ...styles.submitBtn,
              background: submitting ? "#94a3b8" : primaryColor,
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? (
              <span style={styles.spinnerRow}>
                <span style={styles.spinner} /> Submitting...
              </span>
            ) : existingItemId ? "Update Item" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  // ── Page wrapper
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },

  // ── Form card
  card: {
    width: "100%",
    maxWidth: "640px",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
    overflow: "hidden",
  },
  cardHeader: { padding: "28px 32px", color: "#fff" },
  formTitle: { margin: 0, fontSize: "24px", fontWeight: 700 },
  formDesc: { margin: "8px 0 0", opacity: 0.9, fontSize: "15px" },
  formBody: { padding: "28px 32px" },
  fieldRow: { marginBottom: "20px" },
  fieldLabel: { display: "block", fontSize: "14px", fontWeight: 600, color: "#333", marginBottom: "6px" },
  fieldErrorMsg: { color: "#e53935", fontSize: "12px", marginTop: "4px", display: "block" },

  // ── Error banner
  errorBanner: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#fff5f5",
    border: "1px solid #feb2b2",
    borderRadius: "8px",
    padding: "12px 14px",
    marginBottom: "20px",
    fontSize: "14px",
    color: "#c53030",
  },
  errorBannerIcon: { fontSize: "18px", flexShrink: 0 },
  errorBannerClose: {
    marginLeft: "auto",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#c53030",
    fontSize: "16px",
    padding: "0 2px",
    flexShrink: 0,
  },

  // ── Submit button
  submitBtn: {
    width: "100%",
    padding: "13px",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: 700,
    marginTop: "8px",
    transition: "background 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  spinnerRow: { display: "flex", alignItems: "center", gap: 8 },
  spinner: {
    width: 16,
    height: 16,
    border: "2px solid rgba(255,255,255,0.4)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.7s linear infinite",
  },

  // ── Success screen
  successCard: {
    width: "100%",
    maxWidth: "480px",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
    overflow: "hidden",
  },
  successStripe: {
    height: 8,
    width: "100%",
  },
  successBody: {
    padding: "48px 40px 40px",
    textAlign: "center",
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: "#f0fdf4",
    border: "3px solid #86efac",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 24px",
  },
  successIconEmoji: {
    fontSize: 32,
    fontWeight: 700,
    color: "#16a34a",
  },
  successTitle: {
    fontSize: "20px",
    fontWeight: 700,
    margin: "0 0 10px",
    lineHeight: 1.4,
  },
  successSubtext: {
    fontSize: "14px",
    color: "#6b7280",
    margin: "0 0 28px",
  },
  successBtn: {
    padding: "11px 28px",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default FormRenderer;
