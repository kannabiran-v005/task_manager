# TaskFlow — Task Manager App

A full-stack Task Manager application where users can manage tasks across three stages — Todo, In Progress, and Done.

## Features

### Authentication
- User registration with name, email and password
- Login with session-based authentication
- Protected routes — dashboard only accessible after login
- Logout clears session and redirects to login

### Tasks
- Create, update, and delete tasks
- Every task has a stage — Todo, In Progress, Done
- Tasks are scoped per user — each user sees only their own tasks
- Kanban-style board with live task counts per stage

### UI
- Clean and responsive design
- Welcome banner with user name and task summary
- Modal-based task creation and editing
- Loading and error states handled on all API calls

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React, Axios, React Router DOM    |
| Backend   | Python, Flask, Flask-CORS         |
| Database  | MySQL (FreeSQLDatabase)           |
| Hosting   | Vercel (Frontend), Render (Backend) |

## Live Demo
- Frontend: https://task-manager-amqs.vercel.app
- Backend: https://task-manager-s08q.onrender.com

---

## Local Setup

### Backend
```bash
pip install flask flask-cors mysql-connector-python
python app.py
```

### Database (MySQL)
```sql
CREATE TABLE `user` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE `task` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    stage ENUM('Todo', 'In Progress', 'Done') DEFAULT 'Todo',
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE
);
```

### Frontend
```bash
npm install
npm run dev
```

---

## API Endpoints

| Method | Endpoint          | Description           |
|--------|-------------------|-----------------------|
| POST   | /register         | Register a new user   |
| POST   | /login            | Login user            |
| POST   | /logout           | Logout user           |
| GET    | /user/:id         | Get user by ID        |
| GET    | /task?user_id=1   | Get all tasks by user |
| POST   | /task             | Create a task         |
| PUT    | /task/:id         | Update a task         |
| DELETE | /task/:id         | Delete a task         |

---

## Assumptions & Tradeoffs

- Passwords are stored as plain text — in production, bcrypt hashing would be used
- Session-based auth instead of JWT — simpler for this scope
- No pagination — task list is fetched all at once
- user_id stored in localStorage — acceptable for this scope, HttpOnly cookies would be more secure in production
- Free tier hosting — Render spins down after inactivity, first request may take 30-50 seconds to wake up

---

## Bonus Features Completed

-  Custom backend APIs (Flask)
-  Database integration (MySQL)
-  Session-based backend authentication
-  Per-user task scoping
-  Protected frontend routes
-  Backend live deployment (Render)
---

## Project Structure

```
task-manager/
├── src/
│   ├── pages/
│   │   ├── login.jsx        # Login page
│   │   ├── register.jsx     # Register page
│   │   └── dashboard.jsx    # Kanban board with task management
│   ├── app.jsx              # Routes configuration
│   └── main.jsx             # React entry point
├── app.py                   # Flask backend with all API endpoints
├── requirements.txt         # Python dependencies
├── index.html               # HTML entry point
├── package.json             # Node dependencies
├── vite.config.js           # Vite configuration
└── vercel.json              # Vercel routing configuration
```
