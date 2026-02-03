Nexus Task Manager 🚀
A high-performance, full-stack task management application built with React, FastAPI, and SQLite. This project features a workspace-based organization system, real-time UI updates, and a sleek "Cyber-Tech" aesthetic.

✨ Features
* User Authentication: Secure registration and login system using hashed passwords.

* Workspace System: Create, manage, and delete independent workspaces for different projects.

Task Management:

* Add tasks with a specialized "Quick-Add" input.

* Toggle task completion status.

* Inline Editing: Double-click any task to update its content instantly.

* Delete tasks with automatic database cleanup.

* Data Integrity: Built on SQLite with ON DELETE CASCADE to ensure that deleting a workspace or user cleanly removes all associated data.

* Responsive UI: Modern, dark-themed interface built with Tailwind CSS and Lucide Icons.

🛠️ Tech Stack
* Frontend: React (Hooks, Context), Tailwind CSS, Lucide React icons, Axios.

* Backend: Python, FastAPI, SQLite3.

* Security: SHA-256 Password Hashing, CORS Middleware.

🚀 Getting Started
1. Backend Setup
cd app
# Install dependencies
pip install -r requirements.txt
# Start the server
uvicorn main:app --reload

2. Frontend Setup
cd frontend
# Install dependencies
npm install
# Start the application
npm run dev

