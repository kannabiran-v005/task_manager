import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:5000/register", {
        name,
        email,
        password,
      });
      alert(res.data.message);
      navigate("/");
    } catch (err) {
      if (err.response?.status === 409) {
        alert("Email already exists");
      } else {
        alert("Registration failed");
      }
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brandRow}>
          <div style={styles.brandIcon}>✓</div>
          <div>
            <p style={styles.brandName}>TaskFlow</p>
            <p style={styles.brandTagline}>Stay organized, stay ahead</p>
          </div>
        </div>

        <h1 style={styles.heading}>Create an account</h1>
        <p style={styles.subheading}>Get started for free</p>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Full name</label>
          <input
            type="text"
            placeholder="Jane Doe"
            style={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p style={styles.hint}>At least 8 characters</p>
        </div>

        <button style={styles.button} onClick={handleRegister}>Create account</button>

        <div style={styles.divider}>
          <hr style={styles.dividerLine} />
          <span style={styles.dividerText}>or</span>
          <hr style={styles.dividerLine} />
        </div>

        <p style={styles.loginRow}>
          Already have an account?{" "}
          <Link to="/" style={styles.loginLink}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh", display: "flex", alignItems: "center",
    justifyContent: "center", background: "#f1f5f9", fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "#ffffff", borderRadius: "16px", padding: "40px 32px",
    width: "360px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0",
  },
  brandRow: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" },
  brandIcon: {
    width: "38px", height: "38px", borderRadius: "8px", background: "#E6F1FB",
    color: "#185FA5", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "20px", fontWeight: "bold",
  },
  brandName: { margin: 0, fontSize: "17px", fontWeight: "600", color: "#1e293b" },
  brandTagline: { margin: 0, fontSize: "12px", color: "#64748b" },
  heading: { margin: "0 0 4px", fontSize: "24px", fontWeight: "600", color: "#1e293b" },
  subheading: { margin: "0 0 24px", fontSize: "14px", color: "#64748b" },
  fieldGroup: { marginBottom: "14px" },
  label: { display: "block", fontSize: "13px", color: "#475569", marginBottom: "6px" },
  input: {
    width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1",
    borderRadius: "8px", fontSize: "14px", color: "#1e293b",
    background: "#f8fafc", boxSizing: "border-box", outline: "none",
  },
  hint: { margin: "5px 0 0", fontSize: "12px", color: "#94a3b8" },
  button: {
    width: "100%", padding: "11px", marginTop: "4px", background: "#185FA5",
    color: "#fff", border: "none", borderRadius: "8px",
    fontSize: "15px", fontWeight: "600", cursor: "pointer",
  },
  divider: { display: "flex", alignItems: "center", gap: "10px", margin: "20px 0" },
  dividerLine: { flex: 1, border: "none", borderTop: "1px solid #e2e8f0", margin: 0 },
  dividerText: { fontSize: "12px", color: "#94a3b8" },
  loginRow: { textAlign: "center", fontSize: "13px", color: "#64748b", margin: 0 },
  loginLink: { color: "#185FA5", fontWeight: "600", textDecoration: "none" },
};

export default Register;
