
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const STAGES = ["Todo", "In Progress", "Done"];
const BASE = "http://localhost:5000";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [userName, setUserName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", stage: "Todo" });
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const storedName = localStorage.getItem("user_name");
    if (!userId) { navigate("/"); return; }
    if (storedName) setUserName(storedName);
    else fetchUser(userId);
    fetchTasks(userId);
  }, []);

  const fetchUser = async (userId) => {
    try {
      const res = await axios.get(`${BASE}/user/${userId}`);
      setUserName(res.data.name);
    } catch { }
  };

  const fetchTasks = async (userId) => {
    try {
      const res = await axios.get(`${BASE}/task`, {
        params: { user_id: userId || localStorage.getItem("user_id") },
      });
      setTasks(res.data);
    } catch { }
  };

  const openAdd = () => {
    setEditTask(null);
    setForm({ title: "", description: "", stage: "Todo" });
    setShowModal(true);
  };

  const openEdit = (task) => {
    setEditTask(task);
    setForm({ title: task.title, description: task.description || "", stage: task.stage });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    const userId = localStorage.getItem("user_id");
    try {
      if (editTask) {
        await axios.put(`${BASE}/task/${editTask.id}`, form);
      } else {
        await axios.post(`${BASE}/task`, {
          ...form,
          user_id: userId,
        });
      }
      fetchTasks(userId);
      setShowModal(false);
    } catch {
      alert("Failed to save task");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    await axios.delete(`${BASE}/task/${id}`);
    fetchTasks(localStorage.getItem("user_id"));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const filterTasks = (stage) => tasks.filter((t) => t.stage === stage);
  const initials = userName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  const stageBadgeStyle = {
    "Todo": styles.badgeTodo,
    "In Progress": styles.badgeProg,
    "Done": styles.badgeDone,
  };

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}>✓</div>
          <span style={styles.brandName}>TaskFlow</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={styles.avatar}>{initials}</div>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div style={styles.welcomeBox}>
        <div>
          <h2 style={styles.welcomeH}>Hi, {userName}! 👋</h2>
          <p style={styles.welcomeSub}>Welcome back — here's your task board for today.</p>
        </div>
        <div style={styles.statsRow}>
          {STAGES.map((s) => (
            <div key={s} style={styles.statCard}>
              <div style={styles.statNum}>{filterTasks(s).length}</div>
              <div style={styles.statLbl}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
        <button style={styles.addBtn} onClick={openAdd}>+ Add task</button>
      </div>
      <div style={styles.board}>
        {STAGES.map((stage) => (
          <div key={stage} style={styles.col}>
            <div style={styles.colHeader}>
              <span style={styles.colTitle}>{stage}</span>
              <span style={{ ...styles.badge, ...stageBadgeStyle[stage] }}>
                {filterTasks(stage).length}
              </span>
            </div>

            {filterTasks(stage).length === 0 && (
              <p style={styles.empty}>No tasks</p>
            )}

            {filterTasks(stage).map((task) => (
              <div key={task.id} style={styles.taskCard}>
                <p style={styles.taskTitle}>{task.title}</p>
                {task.description && (
                  <p style={styles.taskDesc}>{task.description}</p>
                )}
                <div style={styles.taskActions}>
                  <button style={styles.iconBtn} onClick={() => openEdit(task)}>✏️</button>
                  <button style={styles.iconBtn} onClick={() => handleDelete(task.id)}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>{editTask ? "Edit task" : "Add task"}</h3>

            <label style={styles.label}>Title</label>
            <input
              style={styles.input}
              placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <label style={styles.label}>Description</label>
            <input
              style={styles.input}
              placeholder="Short description (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <label style={styles.label}>Stage</label>
            <select
              style={styles.input}
              value={form.stage}
              onChange={(e) => setForm({ ...form, stage: e.target.value })}
            >
              {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            <div style={styles.modalActions}>
              <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={styles.saveBtn} onClick={handleSave}>Save task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh", background: "#f1f5f9",
    fontFamily: "Arial, sans-serif", padding: "1.5rem 1rem",
  },
  topBar: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", marginBottom: "1.25rem",
  },
  brand: { display: "flex", alignItems: "center", gap: "10px" },
  brandIcon: {
    width: "34px", height: "34px", borderRadius: "8px", background: "#E6F1FB",
    color: "#185FA5", display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "18px", fontWeight: "bold",
  },
  brandName: { fontSize: "16px", fontWeight: "600", color: "#1e293b" },
  avatar: {
    width: "34px", height: "34px", borderRadius: "50%", background: "#E6F1FB",
    color: "#185FA5", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "13px", fontWeight: "600", border: "1px solid #B5D4F4",
  },
  logoutBtn: {
    padding: "6px 14px", background: "none", border: "1px solid #cbd5e1",
    borderRadius: "8px", fontSize: "13px", color: "#64748b", cursor: "pointer",
  },
  welcomeBox: {
    background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px",
    padding: "1rem 1.25rem", marginBottom: "1rem", display: "flex",
    alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px",
  },
  welcomeH: { fontSize: "20px", fontWeight: "600", color: "#1e293b", margin: 0 },
  welcomeSub: { fontSize: "13px", color: "#64748b", margin: "2px 0 0" },
  statsRow: { display: "flex", gap: "10px" },
  statCard: {
    background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px",
    padding: "8px 14px", textAlign: "center", minWidth: "60px",
  },
  statNum: { fontSize: "20px", fontWeight: "600", color: "#1e293b" },
  statLbl: { fontSize: "11px", color: "#94a3b8" },
  addBtn: {
    padding: "8px 16px", background: "#185FA5", color: "#fff", border: "none",
    borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer",
  },
  board: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" },
  col: {
    background: "#f8fafc", border: "1px solid #e2e8f0",
    borderRadius: "12px", padding: "12px",
  },
  colHeader: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", marginBottom: "12px",
  },
  colTitle: { fontSize: "14px", fontWeight: "600", color: "#1e293b" },
  badge: { fontSize: "11px", padding: "2px 8px", borderRadius: "20px", fontWeight: "600" },
  badgeTodo: { background: "#E6F1FB", color: "#0C447C" },
  badgeProg: { background: "#FAEEDA", color: "#633806" },
  badgeDone: { background: "#EAF3DE", color: "#27500A" },
  taskCard: {
    background: "#fff", border: "1px solid #e2e8f0",
    borderRadius: "8px", padding: "10px 12px", marginBottom: "8px",
  },
  taskTitle: { fontSize: "13px", fontWeight: "600", color: "#1e293b", margin: "0 0 3px" },
  taskDesc: { fontSize: "12px", color: "#64748b", margin: "0 0 8px", lineHeight: "1.5" },
  taskActions: { display: "flex", gap: "6px", justifyContent: "flex-end" },
  iconBtn: {
    background: "none", border: "1px solid #e2e8f0",
    borderRadius: "6px", padding: "3px 7px", cursor: "pointer", fontSize: "13px",
  },
  empty: { fontSize: "12px", color: "#94a3b8", textAlign: "center", padding: "16px 0" },
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
  },
  modal: {
    background: "#fff", borderRadius: "16px", padding: "1.5rem",
    width: "320px", border: "1px solid #e2e8f0",
  },
  modalTitle: { fontSize: "16px", fontWeight: "600", color: "#1e293b", marginBottom: "1rem" },
  label: { display: "block", fontSize: "12px", color: "#475569", marginBottom: "5px" },
  input: {
    width: "100%", padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "8px",
    fontSize: "13px", marginBottom: "12px", background: "#f8fafc",
    color: "#1e293b", outline: "none", boxSizing: "border-box",
  },
  modalActions: { display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "4px" },
  cancelBtn: {
    padding: "7px 14px", background: "none", border: "1px solid #cbd5e1",
    borderRadius: "8px", fontSize: "13px", color: "#64748b", cursor: "pointer",
  },
  saveBtn: {
    padding: "7px 14px", background: "#185FA5", color: "#fff",
    border: "none", borderRadius: "8px", fontSize: "13px",
    fontWeight: "600", cursor: "pointer",
  },
};

export default Dashboard;
