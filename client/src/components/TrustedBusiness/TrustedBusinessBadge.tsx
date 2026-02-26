import React from "react";

interface Feature {
  title: string;
  description: string;
}

interface Props {
  businessName: string;
  businessLogo?: string;
}

const FEATURES: Feature[] = [
  {
    title: "Authentic business",
    description: "Background checks done and KYC verified",
  },
  {
    title: "Fraud proof transactions",
    description: "Excellent track record with Razorpay and regularly accepts online payments",
  },
  {
    title: "Fast dispute resolution",
    description: "Low dispute rate and has excellent track record of dispute resolution",
  },
];

const ShieldCheckIcon: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2L4 5.5V11C4 15.5 7.5 19.7 12 21C16.5 19.7 20 15.5 20 11V5.5L12 2Z"
      fill="#dcfce7"
      stroke="#16a34a"
      strokeWidth="1.5"
    />
    <path
      d="M8.5 12L10.5 14.5L15.5 9.5"
      stroke="#16a34a"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RazorpayShield: React.FC = () => (
  <div style={styles.shieldWrapper}>
    {/* Geometric decorative lines */}
    <svg
      style={styles.geometricLines}
      width="110"
      height="110"
      viewBox="0 0 110 110"
      fill="none"
    >
      <line x1="20" y1="0" x2="0" y2="30" stroke="#a7f3d0" strokeWidth="1" opacity="0.6" />
      <line x1="35" y1="0" x2="5" y2="45" stroke="#a7f3d0" strokeWidth="1" opacity="0.5" />
      <line x1="90" y1="0" x2="110" y2="30" stroke="#a7f3d0" strokeWidth="1" opacity="0.6" />
      <line x1="75" y1="0" x2="105" y2="45" stroke="#a7f3d0" strokeWidth="1" opacity="0.5" />
      <line x1="0" y1="70" x2="30" y2="110" stroke="#a7f3d0" strokeWidth="1" opacity="0.4" />
      <line x1="110" y1="70" x2="80" y2="110" stroke="#a7f3d0" strokeWidth="1" opacity="0.4" />
    </svg>

    {/* Glow effect */}
    <div style={styles.shieldGlow} />

    {/* Shield icon */}
    <div style={styles.shieldIcon}>
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
        </defs>
        <path
          d="M32 4L8 14V30C8 42 18.5 53 32 57C45.5 53 56 42 56 30V14L32 4Z"
          fill="url(#shieldGrad)"
        />
        {/* Razorpay-style "R" bolt */}
        <path
          d="M26 20H36C39 20 41 22 41 25C41 27.5 39.5 29.5 37 30L41 40H36L32.5 31H30V40H26V20Z"
          fill="white"
          opacity="0.9"
        />
        <rect x="30" y="24" width="5" height="6" rx="1" fill="white" opacity="0.7" />
      </svg>
    </div>
  </div>
);

const TrustedBusinessBadge: React.FC<Props> = ({ businessName }) => {
  return (
    <div style={styles.outerWrapper}>
      {/* Top pill badge */}
      <div style={styles.topBadge}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginRight: 5 }}>
          <path d="M12 2L4 5.5V11C4 15.5 7.5 19.7 12 21C16.5 19.7 20 15.5 20 11V5.5L12 2Z" fill="#16a34a" />
          <path d="M8.5 12L10.5 14.5L15.5 9.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Razorpay Trusted Business
      </div>

      {/* Main card */}
      <div style={styles.card}>
        {/* Header: shield + name */}
        <div style={styles.header}>
          <RazorpayShield />
          <div style={styles.businessInfo}>
            <span style={styles.businessName}>{businessName}</span>
            <div style={styles.trustedBadge}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ marginRight: 4 }}>
                <path d="M12 2L4 5.5V11C4 15.5 7.5 19.7 12 21C16.5 19.7 20 15.5 20 11V5.5L12 2Z" fill="#16a34a" />
                <path d="M8.5 12L10.5 14.5L15.5 9.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Razorpay Trusted Business
            </div>
          </div>
        </div>

        <div style={styles.divider} />

        {/* Feature list */}
        <div style={styles.featureList}>
          {FEATURES.map((feature, i) => (
            <div key={i} style={styles.featureItem}>
              <ShieldCheckIcon size={26} />
              <div>
                <div style={styles.featureTitle}>{feature.title}</div>
                <div style={styles.featureDesc}>{feature.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  outerWrapper: {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "flex-start",
    fontFamily: "'Inter', 'Roboto', sans-serif",
    maxWidth: 380,
  },

  // Top pill badge
  topBadge: {
    display: "inline-flex",
    alignItems: "center",
    background: "#ffffff",
    border: "1.5px solid #d1fae5",
    borderRadius: "20px 20px 0 0",
    padding: "6px 14px",
    fontSize: 13,
    fontWeight: 600,
    color: "#065f46",
    marginBottom: -1,
    zIndex: 1,
    position: "relative",
  },

  // Main card — white bg, dashed purple border
  card: {
    background: "#ffffff",
    border: "1.5px dashed #7c3aed",
    borderRadius: "0 12px 12px 12px",
    padding: "22px 22px 18px",
    width: "100%",
    boxSizing: "border-box",
    boxShadow: "0 4px 20px rgba(124, 58, 237, 0.06)",
  },

  // Header row
  header: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },

  // Shield
  shieldWrapper: {
    position: "relative",
    width: 72,
    height: 72,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  geometricLines: {
    position: "absolute",
    top: -18,
    left: -18,
    pointerEvents: "none",
  },
  shieldGlow: {
    position: "absolute",
    width: 52,
    height: 52,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(34,197,94,0.25) 0%, rgba(34,197,94,0) 70%)",
    filter: "blur(6px)",
  },
  shieldIcon: {
    position: "relative",
    zIndex: 1,
  },

  // Business info
  businessInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  businessName: {
    fontSize: 22,
    fontWeight: 700,
    color: "#111827",
    letterSpacing: "-0.3px",
    lineHeight: 1.2,
  },

  // Outline-style "Razorpay Trusted Business" badge
  trustedBadge: {
    display: "inline-flex",
    alignItems: "center",
    background: "transparent",
    border: "1px solid #86efac",
    borderRadius: "20px",
    padding: "4px 10px",
    fontSize: 12,
    fontWeight: 500,
    color: "#374151",
  },

  divider: {
    height: 1,
    background: "#f3f4f6",
    marginBottom: 18,
  },

  // Feature list
  featureList: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  featureItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 3,
  },
  featureDesc: {
    fontSize: 13,
    color: "#9ca3af",
    lineHeight: 1.5,
  },
};

export default TrustedBusinessBadge;
