import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("https://task-manager-s08q.onrender.com/login", {
        email,
        password,
      });
      if (res.data.message === "Login successful") {
        localStorage.setItem("user_id", res.data.user_id);
        localStorage.setItem("user_name", res.data.name);
        navigate("/dashboard");
      } else {
        alert("Login failed");
      }
    } catch (err) {
      alert("Invalid credentials");
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

        <h1 style={styles.heading}>Welcome back</h1>
        <p style={styles.subheading}>Sign in to your account</p>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Email address</label>
          <input
            type="email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button style={styles.button} onClick={handleLogin}>Sign in</button>
        <div style={styles.divider}>
          <hr style={styles.dividerLine} />
          <span style={styles.dividerText}>or</span>
          <hr style={styles.dividerLine} />
        </div>

        <p style={styles.registerRow}>
          Not a user?{" "}
          <Link to="/register" style={styles.registerLink}>Create an account</Link>
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
  forgotRow: { textAlign: "right", marginBottom: "20px" },
  forgotLink: { fontSize: "12px", color: "#185FA5", textDecoration: "none" },
  button: {
    width: "100%", padding: "11px", background: "#185FA5", color: "#fff",
    border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "600", cursor: "pointer",
  },
  divider: { display: "flex", alignItems: "center", gap: "10px", margin: "20px 0" },
  dividerLine: { flex: 1, border: "none", borderTop: "1px solid #e2e8f0", margin: 0 },
  dividerText: { fontSize: "12px", color: "#94a3b8" },
  registerRow: { textAlign: "center", fontSize: "13px", color: "#64748b", margin: 0 },
  registerLink: { color: "#185FA5", fontWeight: "600", textDecoration: "none" },
};

export default Login;
