# BugTutor AI 🧑‍🏫

**BugTutor AI** is a beginner-friendly, web-based AI programming tutor and bug explainer platform built for first-year programming students. It explains coding concepts, finds and fixes bugs, translates scary compiler errors into plain **Bangla + English**, reviews your code for improvements, and explains public GitHub repositories and uploaded documents — all patiently, like a human teacher. It can also **read explanations out loud** (Voice Tutor), free for everyone.

---

## 📌 Project Description

BugTutor AI is developed as a course project for **CSE 4104 — Software Development III** at the **Department of Computer Science & Engineering, Northern University of Business & Technology, Khulna**.

| Field | Details |
|---|---|
| **Project Title** | BugTutor AI — AI Programming Tutor & Bug Explainer |
| **Team Name** | CSE4104-7B-T04 |
| **Section** | 7B |
| **Members** | M.M. Asfy Or Rayhan, Alisha Rahman, Nadia Afrin, Fatima Tanjim Rafa |
| **Student IDs** | 11230121106, 11230121112, 11230121121, 11230321556 |
| **Supervised by** | Md. Riaz Mahmud, Assistant Professor, Dept. of CSE, NUBT Khulna |
| **Submission Date** | 08/06/2026 |

### Why BugTutor AI?

Most beginner programmers in Bangladesh face three recurring problems:

1. **Language barrier** — tutorials and error messages are in technical English, which adds confusion for students who think in Bangla.
2. **Compiler errors are intimidating** — messages like `Segmentation fault` or `NullPointerException` give no actionable guidance to a first-year student.
3. **No on-demand feedback** — in a classroom where one instructor serves dozens of students, getting code reviewed can mean waiting hours.

BugTutor AI solves all three with a single platform: AI explanations in Bangla and English, instant error translation, and personalized responses driven by a memory system that tracks each student's learning history.

### Key Features

- **Memory system** — for logged-in users, BugTutor AI keeps notes about what topics they have worked on and which errors they have hit. Every future response is personalized using this context.
- **Runs free** — set `AI_PROVIDER=groq` for a $0 budget using Groq's free API, or `AI_PROVIDER=mock` to run entirely offline with no API key.
- **Seven AI tools in one platform** — Tutor, Bug Explainer, Error Translator, Code Improver, GitHub Repo Explainer, Document Explainer, and Practice Problem Generator.
- **Voice Tutor** — any AI response can be read aloud using the browser's built-in speech engine. Free for all users.
- **Gamification** — XP points, levels, and daily streaks keep students engaged over time.

---

## ✅ What Works Right Now

- **Auth** — register / login, JWT, bcrypt-hashed passwords, student/admin roles, protected routes.
- **AI Tutor** — ask any concept in Bangla, English, or Banglish; get a definition + analogy + code example.
- **Bug Explainer** — paste code, get a line-by-line bug analysis and corrected version.
- **Compiler Error Translator** *(flagship)* — turns errors like `Segmentation fault` into plain Bangla + English with fix steps.
- **Code Improver** — suggestions for variable naming, cleaner syntax, and lower time complexity.
- **GitHub Repo Explainer** — paste any public GitHub URL → plain-language project overview + clickable file tree where each file is explained on demand.
- **PDF & Image Explainer** — upload a lecture PDF or photo of handwritten code → beginner-friendly explanation.
- **Memory & Personalization** — for logged-in users, the tutor remembers past topics and weak areas and personalizes every answer.
- **Admin Panel** — platform stats, tool-usage chart, full user list with promote/demote, recent activity log.
- **Dashboard** — XP, level, streak, activity chart (Recharts), last 50 interactions.
- **Voice Tutor** — listen to any AI explanation using the browser's built-in speech engine.
- **Runs with NO API key** — `AI_PROVIDER=mock` (default) demos everything offline with sample responses.

---

## 🏗️ Architecture

```
React (Vite + Tailwind + Monaco)  ──HTTP──►  Express API  ──►  MongoDB
        client/                                server/         (Atlas)
                                                  │
                                                  └─► aiService.js ──► Groq / Gemini / OpenAI / Mock
```

The frontend never talks to the AI provider directly — all AI calls go through the backend `aiService.js`, so API keys stay server-side and you can swap providers by changing one environment variable.

---

## 📁 Folder Structure

```
bugtutor-ai/
├── server/                         # Node.js + Express + MongoDB API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MongoDB Atlas connection
│   │   ├── models/
│   │   │   ├── User.js             # User schema (xp, level, streak, role)
│   │   │   ├── ChatHistory.js      # AI interaction logs
│   │   │   ├── Memory.js           # Per-user AI memory notes (capped at 40)
│   │   │   └── WeakTopic.js        # Topics the student struggles with
│   │   ├── middleware/
│   │   │   ├── auth.js             # protect, optionalProtect, adminOnly
│   │   │   └── errorHandler.js
│   │   ├── controllers/
│   │   │   ├── authController.js   # register, login, me
│   │   │   ├── aiController.js     # tutor, bugExplainer, errorTranslator, etc.
│   │   │   ├── repoController.js   # GitHub repo + file explainer
│   │   │   ├── docController.js    # PDF + image explainer
│   │   │   └── adminController.js  # stats, users, activity, setRole
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── aiRoutes.js
│   │   │   ├── repoRoutes.js
│   │   │   ├── docRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── services/
│   │   │   ├── aiService.js        # askAI() + askAIVision() — provider abstraction
│   │   │   ├── prompts.js          # All AI system prompts in one place
│   │   │   ├── memoryService.js    # addNote() + getContext()
│   │   │   └── githubService.js    # GitHub REST API calls
│   │   └── server.js               # Express app entry point
│   ├── .env.example
│   └── package.json
├── client/                         # React 18 + Vite
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js           # Axios instance with auth headers
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global login state
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── CodeEditor.jsx      # Monaco Editor wrapper
│   │   │   ├── VoiceButton.jsx     # Web Speech API TTS
│   │   │   ├── AIResultCard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Markdown.jsx
│   │   └── pages/
│   │       ├── Landing.jsx
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       ├── Dashboard.jsx
│   │       ├── Tutor.jsx
│   │       ├── BugExplainer.jsx
│   │       ├── CompilerTranslator.jsx
│   │       ├── CodeImprover.jsx
│   │       ├── RepoExplainer.jsx
│   │       ├── DocExplainer.jsx
│   │       └── Admin.jsx
│   ├── .env.example
│   └── package.json
├── database/                       # MongoDB collection schemas & seed data
│   ├── users.json                  # Sample user documents
│   ├── chathistories.json          # Sample chat history documents
│   ├── memories.json               # Sample memory documents
│   └── weaktopics.json             # Sample weak topic documents
├── documentation/                  # Project documentation files
│   ├── database_documentation.md   # All 4 collections — fields, types, indexes
│   ├── api_design.md               # All 17 API endpoints with request/response
│   └── srs.md                      # Software Requirement Specification
├── diagram/                        # Visual diagrams
│   ├── database_diagram.png        # ER diagram — 4 collections & relationships
│   ├── architecture_diagram.png    # System architecture — client, server, AI, DB
│   └── api_flow_diagram.png        # API request flow diagram
└── README.md                       # Project overview, setup, roadmap
```

---

## 🗄️ Database Documentation

BugTutor AI uses **MongoDB** with **Mongoose ODM**. There are four collections. All models include automatic `createdAt` and `updatedAt` timestamps via `{ timestamps: true }`.

---

### Collection 1 — `users`

Stores registered user accounts with authentication credentials, role, and gamification progress.

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | MongoDB auto-generated primary key |
| `name` | String | ✅ | — | Full name, trimmed |
| `email` | String | ✅ | — | Unique, lowercase, trimmed. Used as login identifier |
| `password` | String | ✅ | — | bcrypt hash (cost 10). `select: false` — excluded from all queries by default |
| `role` | String | ✅ | `"student"` | Enum: `"student"` or `"admin"` |
| `xp` | Number | — | `0` | Experience points earned from AI tool usage |
| `level` | Number | — | `1` | Calculated as `Math.floor(xp / 100) + 1` |
| `streak` | Number | — | `0` | Daily activity streak count |
| `lastActiveDate` | Date | — | `null` | Timestamp of last activity — used for streak tracking |
| `subscription` | String | — | `"free"` | Enum: `"free"` or `"pro"` — reserved for future billing |
| `createdAt` | Date | auto | — | Account registration timestamp |
| `updatedAt` | Date | auto | — | Last modification timestamp |

**Methods defined on the schema:**
- `matchPassword(plain)` — runs `bcrypt.compare(plain, this.password)` and returns a boolean
- `toSafeJSON()` — returns `this.toObject()` with the `password` field deleted, safe to send to the client

**Pre-save hook:** automatically hashes the password whenever `this.isModified('password')` is true, so the plain password never reaches the database.

---

### Collection 2 — `chathistories`

Logs every AI interaction for history display, admin activity monitoring, and platform statistics aggregation.

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | MongoDB auto-generated primary key |
| `userId` | ObjectId | ✅ | — | Reference to `users._id`. Indexed for efficient per-user queries |
| `feature` | String | ✅ | — | Enum: `"tutor"` `"bugExplainer"` `"errorTranslator"` `"codeImprover"` `"problemGenerator"` |
| `message` | String | ✅ | — | The user's input — question, code, or error message |
| `response` | String | ✅ | — | The AI-generated response |
| `language` | String | — | `"en"` | Programming language or UI language of the interaction |
| `topic` | String | — | `null` | Short topic label (used for tutor interactions) |
| `createdAt` | Date | auto | — | When the interaction happened |
| `updatedAt` | Date | auto | — | Last modification timestamp |

**Index:** `userId` is indexed (`index: true`) for fast per-user history queries.

**Used for:**
- `GET /api/ai/history` — returns last 50 records filtered by `userId`
- `GET /api/admin/activity` — returns last 100 records across all users, populated with user name and email
- `GET /api/admin/stats` — aggregated by `feature` field to produce the tool usage breakdown chart

---

### Collection 3 — `memories`

Stores a rolling list of short notes about each logged-in student's learning activity. Used by the AI memory personalization system.

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | MongoDB auto-generated primary key |
| `userId` | ObjectId | ✅ | — | Reference to `users._id`. Unique — one Memory document per user |
| `notes` | Array | — | `[]` | Array of subdocuments, each with `text` (String) and `createdAt` (Date). Capped at 40 entries |
| `createdAt` | Date | auto | — | When the memory document was first created |
| `updatedAt` | Date | auto | — | Last time a note was added |

**How notes are capped at 40:** the `addNote()` function in `memoryService.js` uses a MongoDB `$push` with a `$slice: -40` modifier in a single atomic operation — MongoDB automatically discards entries older than the 40 most recent ones without needing a separate cleanup job.

**How memory is used:**
- `addNote(userId, text)` — called after every AI interaction with a short summary like `"Asked the tutor about: recursion"`
- `getContext(userId)` — retrieves the last 6 notes and combines them with the user's top 5 WeakTopics into a compact context paragraph that is prepended to every AI prompt for personalization

---

### Collection 4 — `weaktopics`

Tracks which programming topics a specific student consistently struggles with, used alongside Memory for AI personalization.

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | MongoDB auto-generated primary key |
| `userId` | ObjectId | ✅ | — | Reference to `users._id`. Indexed |
| `topic` | String | ✅ | — | Topic name, e.g. `"recursion"`, `"pointers"`, `"array indexing"` |
| `mistakeCount` | Number | — | `1` | How many times this topic produced a bug or error |
| `confidenceLevel` | Number | — | `0` | Range 0–100. `0` = weak, `100` = confident |
| `createdAt` | Date | auto | — | When this weak topic was first recorded |
| `updatedAt` | Date | auto | — | Last time mistakeCount was incremented |

**Compound index:** `{ userId: 1, topic: 1 }` with `unique: true` — ensures one row per student per topic, preventing duplicate records for the same weakness.

**Used in:** `getContext(userId)` retrieves `WeakTopic.find({ userId }).sort({ mistakeCount: -1 }).limit(5)` — the top 5 most-struggled topics, included in the AI memory context.

---

### Database Diagram

```
┌─────────────────────────────────┐
│            users                │
│─────────────────────────────────│
│ _id          ObjectId  PK       │
│ name         String             │
│ email        String   UNIQUE    │
│ password     String   (hidden)  │
│ role         String             │
│ xp           Number             │
│ level        Number             │
│ streak       Number             │
│ lastActiveDate Date             │
│ subscription String             │
│ createdAt    Date               │
│ updatedAt    Date               │
└──────────────┬──────────────────┘
               │ 1
               │
      ┌────────┼──────────────────────────┐
      │        │                          │
      │ N      │ 1                        │ N
      ▼        ▼                          ▼
┌──────────────────┐   ┌──────────────┐   ┌──────────────────┐
│  chathistories   │   │   memories   │   │   weaktopics     │
│──────────────────│   │──────────────│   │──────────────────│
│ _id    ObjectId  │   │ _id ObjectId │   │ _id   ObjectId   │
│ userId ObjectId ►├──►│ userId  ►   ├──►│ userId ObjectId► │
│ feature  String  │   │ notes[]      │   │ topic   String   │
│ message  String  │   │  └text String│   │ mistakeCount Num │
│ response String  │   │  └createdAt  │   │ confidenceLevel  │
│ language String  │   │ createdAt    │   │ createdAt        │
│ topic    String  │   │ updatedAt    │   │ updatedAt        │
│ createdAt Date   │   └──────────────┘   └──────────────────┘
│ updatedAt Date   │
└──────────────────┘

Relationships:
  users 1 ──► N chathistories   (one user has many chat records)
  users 1 ──► 1 memories        (one memory document per user)
  users 1 ──► N weaktopics      (one user has many weak topic records)
```

---

## 🚀 Project Setup Instructions

### Prerequisites

- [Node.js 18+](https://nodejs.org) — required for ESM module support
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster — optional for first run
- A free [Groq API key](https://console.groq.com/keys) — optional; use `mock` mode without one

### Step 1 — Clone the repository

```bash
git clone https://github.com/Rayhan-55/cse4104-7b-t04-ai-programming-tutor-and-Bug-Explainer.git
cd cse4104-7b-t04-ai-programming-tutor-and-Bug-Explainer
```

### Step 2 — Set up the backend

```bash
cd server
npm install
cp .env.example .env
```

Open `server/.env` and fill in your values:

```env
# AI provider — pick one
AI_PROVIDER=groq            # groq | gemini | openai | mock
GROQ_API_KEY=               # free at https://console.groq.com/keys
GEMINI_API_KEY=             # free at https://aistudio.google.com/app/apikey
OPENAI_API_KEY=             # paid — optional

# Database — optional for first run
MONGO_URI=                  # free cluster at https://www.mongodb.com/cloud/atlas

# Auth
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d

# Admin
ADMIN_EMAILS=your@email.com  # comma-separated; these accounts get admin role automatically

# CORS
CLIENT_URL=http://localhost:5173

# GitHub (optional — raises rate limit from 60 to 5000 req/hr)
GITHUB_TOKEN=
```

Start the backend server:

```bash
npm run dev       # starts on http://localhost:5000
```

### Step 3 — Set up the frontend

Open a **second terminal** in the project root:

```bash
cd client
npm install
cp .env.example .env
```

The only required variable for local development:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev       # starts on http://localhost:5173
```

### Step 4 — Open the app

Visit **http://localhost:5173** in your browser.

- With `AI_PROVIDER=mock` (the default), every AI tool works immediately with sample responses — no API key needed.
- To enable user accounts and saved history, add a `MONGO_URI` from MongoDB Atlas.
- To get real AI answers, set `AI_PROVIDER=groq` and add your free `GROQ_API_KEY`.

### Step 5 — Create an admin account

Add your email to `ADMIN_EMAILS` in `server/.env`, then register or log in with that email. You will automatically receive admin access and see the Admin Panel link in the navbar. No manual database editing needed.

---

## 🔌 API Routes

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| POST | `/api/auth/register` | Public | Create a new account |
| POST | `/api/auth/login` | Public | Log in, returns JWT token |
| GET | `/api/auth/me` | Bearer JWT | Get current user profile |
| POST | `/api/ai/tutor` | Optional | AI concept explanation |
| POST | `/api/ai/bug-explainer` | Optional | Bug detection and fix |
| POST | `/api/ai/error-translator` | Optional | Compiler error translation |
| POST | `/api/ai/code-improver` | Optional | Code improvement suggestions |
| POST | `/api/ai/problem` | Optional | Generate a practice problem |
| GET | `/api/ai/history` | Bearer JWT | Last 50 user interactions |
| POST | `/api/repo/overview` | Optional | Explain a public GitHub repo |
| POST | `/api/repo/file` | Optional | Explain one file from a repo |
| POST | `/api/doc/explain` | Optional | Explain a PDF or image file |
| GET | `/api/admin/stats` | Admin JWT | Platform-wide statistics |
| GET | `/api/admin/users` | Admin JWT | All registered users |
| GET | `/api/admin/activity` | Admin JWT | Recent activity (all users) |
| PATCH | `/api/admin/users/:id/role` | Admin JWT | Promote or demote a user |
| GET | `/api/health` | Public | Server health check |

*"Optional" = works as a guest; saves history and awards XP when logged in.*

---

## ☁️ Deployment

### Backend → Render or Railway

1. Push the repository to GitHub.
2. Create a New Web Service → root directory `server` → build `npm install` → start `npm start`.
3. Add all environment variables from `server/.env`. Set `CLIENT_URL` to your Vercel frontend URL.

### Frontend → Vercel

1. Create a New Project → root directory `client` → framework **Vite**.
2. Add environment variable: `VITE_API_URL = https://your-backend-url/api`.
3. Deploy.

---

## 🗺️ Development Planning

The project is developed over **8 weeks** following an iterative build approach. Each week produces a runnable, integrated increment.

| Week | Phase | Key Tasks | Deliverable |
|------|-------|-----------|-------------|
| Week 1 | Project Setup | Initialize Express + React + Vite + Tailwind, configure MongoDB, set up GitHub repo | Running skeleton — `npm run dev` works |
| Week 2 | Authentication | User model, register/login endpoints, JWT middleware, login/register pages | Working auth with protected routes |
| Week 3 | Core AI Tools I | Groq integration, tutor + bugExplainer prompts and endpoints, Monaco Editor | AI Tutor and Bug Explainer live |
| Week 4 | Core AI Tools II | errorTranslator, codeImprover, problemGenerator endpoints and pages | All 5 text AI tools working |
| Week 5 | UI/UX Design | Wireframes, responsive layout, Dashboard, Voice Tutor, Recharts | Wireframes, screenshots, roadmap |
| Week 6 | Extended AI Features | GitHub REST API, repo explainer, unpdf PDF extraction, vision AI for images | GitHub Repo + Doc Explainer live |
| Week 7 | Memory + Admin | Memory model, getContext() in all prompts, WeakTopic model, Admin Panel | Memory personalization + Admin Panel |
| Week 8 | Testing + Deployment | API tests, rate-limit, CORS, deploy to Render + Vercel, final report | Live deployed app + final report |

### Future Features

- Practice Arena UI page for the existing `/api/ai/problem` endpoint
- Personalized learning roadmap using the `WeakTopic` model
- Daily challenge + leaderboard (`DailyChallenge` model)
- AI mock interview (stateful `/api/ai/interview` route)
- Redis cache for repeated AI prompts (Upstash free tier)

---

## 📄 License

Developed for academic purposes at Northern University of Business & Technology, Khulna — CSE 4104 Software Development III.