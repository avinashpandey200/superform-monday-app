import React from "react";
import TrustedBusinessBadge from "./TrustedBusinessBadge";

const TrustedBusinessDemo: React.FC = () => {
  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Razorpay Trusted Business Badge</h2>
      <p style={styles.sub}>Matches Image 2 (perfora) design</p>
      <div style={styles.preview}>
        <TrustedBusinessBadge businessName="perfora" />
      </div>
      <div style={styles.preview}>
        <TrustedBusinessBadge businessName="innovist" />
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f8f9fa",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    gap: 32,
    fontFamily: "'Inter', sans-serif",
  },
  heading: { fontSize: 24, fontWeight: 800, color: "#111", margin: 0 },
  sub: { color: "#888", margin: 0 },
  preview: {
    background: "#fff",
    padding: 32,
    borderRadius: 16,
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
};

export default TrustedBusinessDemo;
