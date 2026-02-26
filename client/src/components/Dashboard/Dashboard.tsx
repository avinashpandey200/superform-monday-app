import React, { useEffect, useState } from "react";
import { Form } from "../../types";
import { getForms, deleteForm } from "../../api";
import { useNavigate } from "react-router-dom";

interface Props {
  boardId: string;
}

const Dashboard: React.FC<Props> = ({ boardId }) => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!boardId) return;
    setLoading(true);
    getForms(boardId)
      .then(setForms)
      .finally(() => setLoading(false));
  }, [boardId]);

  const handleDelete = async (formId: string) => {
    if (!window.confirm("Delete this form? This cannot be undone.")) return;
    await deleteForm(formId);
    setForms((prev) => prev.filter((f) => f._id !== formId));
  };

  const copyLink = (formId: string) => {
    const url = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(url);
    alert("Form link copied to clipboard!");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>SuperForm</h1>
          <p style={styles.subtitle}>Create and manage forms for your monday.com boards</p>
        </div>
        <button style={styles.newBtn} onClick={() => navigate(`/builder?boardId=${boardId}`)}>
          + New Form
        </button>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading forms...</div>
      ) : forms.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📋</div>
          <h3>No forms yet</h3>
          <p>Create your first form to start collecting data</p>
          <button style={styles.newBtn} onClick={() => navigate(`/builder?boardId=${boardId}`)}>
            Create Form
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {forms.map((form) => (
            <div key={form._id} style={styles.card}>
              <div style={styles.cardTop}>
                <h3 style={styles.formTitle}>{form.title}</h3>
                <span style={{ ...styles.badge, ...(form.isActive ? styles.activeBadge : styles.inactiveBadge) }}>
                  {form.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              {form.description && <p style={styles.formDesc}>{form.description}</p>}
              <div style={styles.stats}>
                <span>📊 {form.submissionCount} submissions</span>
                <span>📅 {new Date(form.createdAt!).toLocaleDateString()}</span>
              </div>
              <div style={styles.cardActions}>
                <button style={styles.actionBtn} onClick={() => navigate(`/builder/${form._id}`)}>
                  ✏️ Edit
                </button>
                <button style={styles.actionBtn} onClick={() => navigate(`/form/${form._id}`)}>
                  👁 Preview
                </button>
                <button style={styles.actionBtn} onClick={() => copyLink(form._id!)}>
                  🔗 Copy Link
                </button>
                <button style={styles.actionBtn} onClick={() => navigate(`/submissions/${form._id}`)}>
                  📊 Submissions
                </button>
                <button style={{ ...styles.actionBtn, color: "#e53935" }} onClick={() => handleDelete(form._id!)}>
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { padding: "32px", maxWidth: "1200px", margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 },
  title: { fontSize: 28, fontWeight: 800, margin: 0, color: "#1a1a1a" },
  subtitle: { color: "#888", margin: "4px 0 0", fontSize: 14 },
  newBtn: {
    padding: "10px 20px",
    background: "#0073ea",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "14px",
  },
  loading: { textAlign: "center", padding: "60px", color: "#888" },
  emptyState: {
    textAlign: "center",
    padding: "80px 24px",
    background: "#f8f9fa",
    borderRadius: "16px",
    border: "2px dashed #ddd",
    color: "#666",
  },
  emptyIcon: { fontSize: 56, marginBottom: 12 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 },
  card: {
    background: "#fff",
    border: "1px solid #e8e8e8",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    transition: "box-shadow 0.2s",
  },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  formTitle: { fontSize: 16, fontWeight: 700, margin: 0, color: "#1a1a1a" },
  badge: { fontSize: 11, padding: "2px 8px", borderRadius: 12, fontWeight: 600 },
  activeBadge: { background: "#e8f5e9", color: "#2e7d32" },
  inactiveBadge: { background: "#f5f5f5", color: "#9e9e9e" },
  formDesc: { fontSize: 13, color: "#777", margin: "0 0 12px" },
  stats: { display: "flex", gap: 16, fontSize: 12, color: "#999", marginBottom: 14 },
  cardActions: { display: "flex", flexWrap: "wrap", gap: 6, borderTop: "1px solid #f0f0f0", paddingTop: 12 },
  actionBtn: {
    padding: "5px 10px",
    background: "#f5f5f5",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 500,
    color: "#333",
  },
};

export default Dashboard;
