import React from "react";
import { FormSettings as IFormSettings } from "../../types";

interface Props {
  settings: IFormSettings;
  onChange: (settings: IFormSettings) => void;
}

const FormSettings: React.FC<Props> = ({ settings, onChange }) => {
  const update = (partial: Partial<IFormSettings>) => onChange({ ...settings, ...partial });

  return (
    <div style={styles.container}>
      <h3 style={styles.sectionTitle}>Behavior</h3>

      <label style={styles.toggleRow}>
        <div>
          <div style={styles.toggleLabel}>Allow updating existing items</div>
          <div style={styles.toggleDesc}>Users can update a monday.com item instead of creating a new one</div>
        </div>
        <input
          type="checkbox"
          checked={settings.allowUpdate}
          onChange={(e) => update({ allowUpdate: e.target.checked })}
          style={styles.toggle}
        />
      </label>

      <label style={styles.toggleRow}>
        <div>
          <div style={styles.toggleLabel}>Allow adding sub-items</div>
          <div style={styles.toggleDesc}>Form responses can be added as sub-items to an existing item</div>
        </div>
        <input
          type="checkbox"
          checked={settings.allowSubItems}
          onChange={(e) => update({ allowSubItems: e.target.checked })}
          style={styles.toggle}
        />
      </label>

      <label style={styles.toggleRow}>
        <div>
          <div style={styles.toggleLabel}>Enable prefill</div>
          <div style={styles.toggleDesc}>Pre-populate form fields with data from an existing item via URL</div>
        </div>
        <input
          type="checkbox"
          checked={settings.prefillEnabled}
          onChange={(e) => update({ prefillEnabled: e.target.checked })}
          style={styles.toggle}
        />
      </label>

      <h3 style={styles.sectionTitle}>After Submission</h3>

      <label style={styles.label}>Success Message</label>
      <textarea
        style={styles.textarea}
        value={settings.successMessage}
        onChange={(e) => update({ successMessage: e.target.value })}
        rows={3}
      />

      <label style={styles.label}>Redirect URL (optional)</label>
      <input
        style={styles.input}
        type="url"
        value={settings.redirectUrl || ""}
        placeholder="https://example.com/thank-you"
        onChange={(e) => update({ redirectUrl: e.target.value })}
      />

      <h3 style={styles.sectionTitle}>Theme</h3>

      <div style={styles.colorRow}>
        <div>
          <label style={styles.label}>Primary Color</label>
          <input
            type="color"
            value={settings.customTheme?.primaryColor || "#0073ea"}
            onChange={(e) =>
              update({ customTheme: { ...settings.customTheme!, primaryColor: e.target.value } })
            }
          />
        </div>
        <div>
          <label style={styles.label}>Background Color</label>
          <input
            type="color"
            value={settings.customTheme?.backgroundColor || "#ffffff"}
            onChange={(e) =>
              update({ customTheme: { ...settings.customTheme!, backgroundColor: e.target.value } })
            }
          />
        </div>
      </div>

      <label style={styles.label}>Font Family</label>
      <select
        style={styles.input}
        value={settings.customTheme?.fontFamily || "Roboto, sans-serif"}
        onChange={(e) =>
          update({ customTheme: { ...settings.customTheme!, fontFamily: e.target.value } })
        }
      >
        <option value="Roboto, sans-serif">Roboto</option>
        <option value="Inter, sans-serif">Inter</option>
        <option value="Arial, sans-serif">Arial</option>
        <option value="Georgia, serif">Georgia</option>
        <option value="Poppins, sans-serif">Poppins</option>
      </select>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 600, background: "#fff", borderRadius: "12px", padding: "24px" },
  sectionTitle: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#333",
    borderBottom: "1px solid #f0f0f0",
    paddingBottom: "8px",
    marginBottom: "16px",
    marginTop: "20px",
  },
  toggleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #f9f9f9",
    cursor: "pointer",
    gap: 16,
  },
  toggleLabel: { fontSize: "14px", fontWeight: 600, color: "#222" },
  toggleDesc: { fontSize: "12px", color: "#888", marginTop: 2 },
  toggle: { width: 18, height: 18, cursor: "pointer", accentColor: "#0073ea" },
  label: { display: "block", fontSize: "12px", fontWeight: 600, color: "#555", marginBottom: 4, marginTop: 12 },
  input: {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "13px",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "13px",
    resize: "vertical",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  colorRow: { display: "flex", gap: 24 },
};

export default FormSettings;
