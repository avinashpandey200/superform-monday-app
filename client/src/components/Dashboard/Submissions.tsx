import React, { useEffect, useState } from "react";
import { Submission } from "../../types";
import { getSubmissions } from "../../api";
import { useNavigate } from "react-router-dom";

interface Props {
  formId: string;
}

const Submissions: React.FC<Props> = ({ formId }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getSubmissions(formId)
      .then(setSubmissions)
      .finally(() => setLoading(false));
  }, [formId]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
        <h2 style={styles.title}>Form Submissions</h2>
      </div>

      {loading ? (
        <p style={{ color: "#888" }}>Loading submissions...</p>
      ) : submissions.length === 0 ? (
        <div style={styles.empty}>No submissions yet.</div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Submitted At</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>monday Item ID</th>
                <th style={styles.th}>Data</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub, i) => (
                <tr key={sub._id} style={i % 2 === 0 ? styles.rowEven : {}}>
                  <td style={styles.td}>{i + 1}</td>
                  <td style={styles.td}>{new Date(sub.submittedAt).toLocaleString()}</td>
                  <td style={styles.td}>
                    <span style={sub.isUpdate ? styles.updateBadge : styles.newBadge}>
                      {sub.isUpdate ? "Update" : "New"}
                    </span>
                  </td>
                  <td style={styles.td}>{sub.mondayItemId || "—"}</td>
                  <td style={styles.td}>
                    <code style={styles.code}>{JSON.stringify(sub.data)}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { padding: "32px", maxWidth: "1200px", margin: "0 auto" },
  header: { display: "flex", alignItems: "center", gap: 16, marginBottom: 24 },
  backBtn: {
    background: "none",
    border: "1px solid #ddd",
    borderRadius: "6px",
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: "13px",
    color: "#555",
  },
  title: { fontSize: 22, fontWeight: 700, margin: 0 },
  empty: { textAlign: "center", padding: 60, color: "#888" },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 10, overflow: "hidden" },
  th: {
    padding: "12px 16px",
    background: "#f8f9fa",
    textAlign: "left",
    fontSize: 12,
    fontWeight: 700,
    color: "#555",
    borderBottom: "1px solid #e0e0e0",
  },
  td: { padding: "12px 16px", fontSize: 13, color: "#333", borderBottom: "1px solid #f5f5f5" },
  rowEven: { background: "#fafafa" },
  code: { fontSize: 11, background: "#f5f5f5", padding: "2px 6px", borderRadius: 4, maxWidth: 300, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  newBadge: { background: "#e8f5e9", color: "#2e7d32", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600 },
  updateBadge: { background: "#e3f2fd", color: "#1565c0", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600 },
};

export default Submissions;
