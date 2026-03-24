# 📋 TodoApp — Full-Stack Web Application

A full-stack **To-Do List & Note-Taking** web application built as a practical exercise in modern web programming. Features complete CRUD operations, a RESTful JSON API backend, and an interactive data table rendered from live API responses.

---

## ✨ Features

- **Create** new tasks with title, description, priority level, and status
- **Read** all tasks displayed in an interactive, searchable DataTable
- **Update** existing tasks via a pre-filled edit form
- **Delete** tasks with a confirmation dialog (SweetAlert2)
- Live statistics dashboard on the home page (done / in-progress / pending counts)
- Fully responsive UI across desktop and mobile devices

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, Bootstrap 5, Bootstrap Icons |
| **Interactivity** | jQuery 3.7, jQuery DataTables 1.13, SweetAlert2 |
| **Backend** | Node.js, Express.js |
| **Database** | Supabase (PostgreSQL) |
| **API Style** | RESTful JSON API |
| **Auth / Config** | dotenv, CORS middleware |

---

## 📁 Project Structure

```
todo-app/
├── public/                  # Static frontend files
│   ├── index.html           # Home page — dashboard & statistics
│   ├── form.html            # Form page — create & edit tasks
│   ├── data.html            # Data page — interactive DataTable
│   └── js/
│       ├── form.js          # jQuery logic: AJAX form submit (POST/PUT)
│       └── main.js          # jQuery logic: DataTables init, edit & delete
├── .env                     # Environment variables (not committed)
├── .gitignore
├── package.json
└── server.js                # Express.js server — all API routes
```

---

## 📄 Pages

| Page | File | Description |
|---|---|---|
| **Home** | `index.html` | Landing dashboard with live task statistics fetched via AJAX |
| **Form** | `form.html` | Create a new task or edit an existing one (mode detected via URL `?id=`) |
| **Data** | `data.html` | Full task list rendered by jQuery DataTables from the backend JSON API |

---

## 🔌 API Endpoints

Base URL: `http://localhost:3000/api`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/todos` | Retrieve all todos, ordered by newest first |
| `GET` | `/todos/:id` | Retrieve a single todo by ID |
| `POST` | `/todos` | Create a new todo |
| `PUT` | `/todos/:id` | Update an existing todo by ID |
| `DELETE` | `/todos/:id` | Delete a todo by ID |

### Request Body (POST / PUT)

```json
{
  "title": "Learn Express.js",
  "description": "Study routing and middleware concepts",
  "priority": "high",
  "status": "in-progress"
}
```

### Response Format

```json
{
  "success": true,
  "message": "Todo created successfully!",
  "data": {
    "id": 1,
    "title": "Learn Express.js",
    "description": "Study routing and middleware concepts",
    "priority": "high",
    "status": "in-progress",
    "created_at": "2025-01-01T10:00:00.000Z"
  }
}
```

---

## 🗄️ Database Schema

Table name: `todos`

| Column | Type | Default | Notes |
|---|---|---|---|
| `id` | `BIGSERIAL` | Auto-increment | Primary Key |
| `title` | `TEXT` | — | Required |
| `description` | `TEXT` | `NULL` | Optional |
| `priority` | `TEXT` | `'medium'` | `low` / `medium` / `high` |
| `status` | `TEXT` | `'pending'` | `pending` / `in-progress` / `done` |
| `created_at` | `TIMESTAMPTZ` | `NOW()` | Auto-set on insert |

**SQL to create the table:**

```sql
CREATE TABLE todos (
  id          BIGSERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT,
  priority    TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status      TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'done')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) (included with Node.js)
- A [Supabase](https://supabase.com/) account and project

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/lauraneval/TDLS-2303.git
cd TDLS-2303
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file in the root directory:

```bash
touch .env
```

Then fill in your Supabase credentials:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key-here
PORT=3000
```

> Your credentials can be found in your Supabase project under **Settings → API**.

**4. Set up the database**

Run the SQL above in your Supabase **SQL Editor** to create the `todos` table.

**5. Start the development server**

```bash
npm run dev
```

The server will start at `http://localhost:3000`.  
Open `http://localhost:3000` in your browser to view the app.

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase public anon key |
| `PORT` | Port for the Express server (default: `3000`) |

**Never commit your `.env` file.**

---

## 📦 NPM Scripts

| Script | Command | Description |
|---|---|---|
| `start` | `node server.js` | Run in production mode |
| `dev` | `nodemon server.js` | Run in development mode with auto-restart |

---

## 🧩 Key Implementation Notes

- **AJAX over full-page reload** — all form submissions and delete actions use `$.ajax()`, keeping the user on the current page and updating the UI without a full reload.
- **Event delegation for dynamic elements** — DataTables renders Edit and Delete buttons dynamically, so click handlers are attached via `$('#todosTable').on('click', '.btn-edit', ...)` rather than directly.
- **Dual-mode form** — `form.html` detects a `?id=` query parameter on load. If present, it fetches the existing record and switches to edit (PUT) mode automatically.
- **Static file serving** — Express serves the `public/` folder directly, so no separate frontend server is needed during development.

---

## 📌 Dependencies

```json
{
  "express": "^4.18.0",
  "@supabase/supabase-js": "^2.0.0",
  "cors": "^2.8.5",
  "dotenv": "^16.0.0"
}
```

```json
{
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

---

## 📜 License

This project is created for academic purposes as part of a Web Programming course assignment.

---

<p align="center">Built with Node.js · Express · Bootstrap 5 · jQuery · Supabase</p>
