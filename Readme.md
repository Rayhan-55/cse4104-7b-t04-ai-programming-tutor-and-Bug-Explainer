# AI Programming Tutor & Bug Explainer

> A beginner-friendly AI-powered programming education platform that explains concepts, detects bugs, translates compiler errors, and personalizes learning in simple language.

---

## Team Information

| Field | Details |
|---|---|
| **Team Name** | CSE4104 - 7B - T04 |
| **Section** | 7B |
| **Course** | CSE4104 |

### Team Members

| Name | Student ID |
|---|---|
| M.M. Asfy Or Rayhan | 11230121106 |
| Alisha Rahman | 11230121112 |
| Nadia Afrin | 11230121121 |
| Fatima Tanjim Rafa | 11230321556 |

### Team Leader
**M.M. Asfy Or Rayhan**

---

## Project Title

**AI Programming Tutor & Bug Explainer** — *BUGtutorAI*


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

## Objectives

1. **Lower the barrier to learning programming** — Provide instant, plain-language explanations of programming concepts so that absolute beginners never feel lost or discouraged.

2. **Help students debug faster** — Automatically analyze buggy code line by line, explain the root cause of each error, and provide corrected code with tips to avoid the same mistake.

3. **Demystify compiler and runtime errors** — Translate cryptic messages like `Segmentation fault`, `NullPointerException`, and `Time Limit Exceeded` into simple, human-readable explanations.

4. **Promote better coding habits** — Review working code and suggest improvements in naming, structure, time complexity, and best practices through the Code Improver tool.

5. **Support multi-format learning** — Allow students to upload lecture slides, handwritten notes, textbook pages, and PDF documents so the AI can explain content directly from their study materials.

6. **Enable codebase understanding** — Let students paste any public GitHub repository URL and instantly receive a structured explanation of what the project does and how it is organized.

7. **Personalize the learning experience** — Use a persistent memory system that tracks each student's past topics, recurring mistakes, and weak areas across sessions, so responses improve over time.

8. **Gamify and motivate learning** — Track XP points, learning streaks, levels, and activity charts to encourage consistent daily practice and reward progress.

9. **Provide accessible AI education** — Support multiple AI providers (Groq, Gemini, OpenAI) including a free Mock mode so the entire platform runs with zero API cost during development and testing.

10. **Empower administrators** — Offer a full admin panel for monitoring platform usage, managing users and roles, and reviewing individual learner activity and memory notes.

---

## Features

### 🎓 AI Coding Tutor
Ask any programming concept — arrays, recursion, OOP, binary search, and more — and receive a simple, beginner-friendly explanation with real-world analogies and code examples. Supports Bangla and English (Banglish).

### 🐛 Bug Explainer
Paste your code and the AI analyzes it line by line, explains exactly why the bug occurred, provides the corrected code, and offers tips to avoid the same mistake in the future. Supports C, C++, Java, Python, and JavaScript.

### ⚡ Compiler Error Translator *(Flagship Feature)*
Translates scary compiler and runtime errors into plain, easy-to-understand language.
- `Segmentation fault` → *"The program tried to access a memory location it is not allowed to use."*
- `NullPointerException` → *"An object was used before it was created."*
- `Time Limit Exceeded` → *"The algorithm is too slow and the program timed out."*

### ✨ Code Improver
Reviews working code and suggests improvements — better variable names, cleaner syntax, reduced time complexity, removal of unnecessary loops, and general best practices.

### 🗂 GitHub Repository Explainer
Paste any public GitHub repository link and the app reads the entire codebase, explains what the project does, how it is structured, and what each file is responsible for.

### 📄 PDF and Image Explainer
Upload lecture slides, class notes, textbook pages, or photos of handwritten code and problems. The AI reads the content and explains it in a beginner-friendly way.

### 🔊 Voice Tutor
Every AI explanation can be read aloud using the browser's built-in speech engine. This feature is free for all users with no premium restriction.

### 🧠 Memory System
The tutor remembers each student across sessions, tracking past topics, recurring mistakes, and weak areas so that answers become more personalized over time. This is the core differentiator from a plain chatbot.

### 📊 Skill Analytics Dashboard
Displays XP points, level, learning streak, activity by tool with charts, and recent history for each learner.

### 🛡 Admin Panel
Administrators can view platform statistics, tool usage charts, the full user list with role management and deletion, and each individual user's memory notes, weak topics, and activity history.

### 🔐 Authentication System
Secure registration and login using JWT tokens and bcrypt password hashing. Supports Student and Admin roles.

---
## Repository Structure

```
AI Programming Tutor & Bug Explainer/
│
├── frontend/
│ ├── client/                             # React (Vite) Frontend
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   └── src/
│       ├── main.jsx                    # App entry point
│       ├── App.jsx                     # Routes and layout
│       ├── index.css                   # Global styles
│       │
│       ├── api/
│       │   └── client.js               # Axios instance with JWT interceptor
│       │
│       ├── context/
│       │   └── AuthContext.jsx         # Global auth state (JWT, user)
│       │
│       ├── components/
│       │   ├── Navbar.jsx              # Top navigation bar
│       │   ├── ProtectedRoute.jsx      # Route guard for auth
│       │   ├── CodeEditor.jsx          # Monaco VS Code-style editor
│       │   ├── VoiceButton.jsx         # Text-to-speech button
│       │   ├── AIResultCard.jsx        # AI response display card
│       │   └── Markdown.jsx            # Markdown renderer for AI output
│       │
│       └── pages/
│           ├── Landing.jsx             # Home / hero page
│           ├── Login.jsx               # Login form
│           ├── Register.jsx            # Registration form
│           ├── Dashboard.jsx           # XP, streak, charts, history
│           ├── Tutor.jsx               # AI Coding Tutor page
│           ├── BugExplainer.jsx        # Bug Explainer page
│           ├── CompilerTranslator.jsx  # Compiler Error Translator page
│           ├── CodeImprover.jsx        # Code Improver page
│           ├── RepoExplainer.jsx       # GitHub Repo Explainer page
│           ├── DocExplainer.jsx        # PDF / Image Explainer page
│           └── Admin.jsx               # Admin panel page
│
└──backend/
│  ├──server/                             # Node.js + Express Backend
│    ├── .env.example
│    └── src/
│        ├── server.js                   # Express app entry point
│        │
│        ├── config/
│        │   └── db.js                   # MongoDB Atlas connection
│        │
│        ├── models/
│        │   ├── User.js                 # User schema (xp, streak, role, bcrypt)
│        │   ├── ChatHistory.js          # Per-user AI conversation history
│        │   ├── Memory.js               # Persistent learner memory notes
│        │   └── WeakTopic.js            # Weak topic tracking per user
│        │
│        ├── middleware/
│        │   ├── auth.js                 # JWT protect / optionalProtect / adminOnly
│        │   └── errorHandler.js         # Global error handler
│        │
│        ├── controllers/
│        │   ├── authController.js       # register, login, getMe
│        │   ├── aiController.js         # tutor, bugExplainer, errorTranslator, codeImprover, problem
│        │   ├── repoController.js       # GitHub repo overview and file explanation
│        │   ├── docController.js        # PDF and image explanation (multer + vision)
│        │   └── adminController.js      # stats, users, delete, role management
│        │
│        ├── routes/
│        │   ├── authRoutes.js           # /api/auth/*
│        │   ├── aiRoutes.js             # /api/ai/*
│        │   ├── repoRoutes.js           # /api/repo/*
│        │   ├── docRoutes.js            # /api/doc/*
│        │   └── adminRoutes.js          # /api/admin/*
│        │
│        └── services/
│            ├── aiService.js            # askAI() and askAIVision() — provider abstraction
│            ├── prompts.js              # All system prompts and buildUserMessage()
│            ├── memoryService.js        # Read/write learner memory and weak topics
│            └── githubService.js        # GitHub REST API fetch for repo explainer
│
│
└──database/
│        ├── users.json                  # Sample user documents
│        ├── chathistories.json          # Sample chat history documents
│        ├── memories.json               # Sample memory documents
│        └── weaktopics.json             # Sample weak topic documents
│
└──documentation/
│            ├── database_documentation.md   # All 4 collections — fields,
│
└──diagrams/

```
---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React.js | 18.3.1 | UI framework |
| Vite | 5.3.4 | Build tool and dev server |
| Tailwind CSS | 3.4.7 | Styling and layout |
| React Router | 6.25.1 | Client-side routing |
| Axios | 1.7.2 | HTTP requests |
| Monaco Editor (`@monaco-editor/react`) | 4.6.0 | VS Code-style code editor |
| Framer Motion | 11.3.8 | Animations and transitions |
| Recharts | 2.12.7 | Analytics and data charts |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js + Express.js | 4.19.2 | REST API server |
| JSON Web Token (JWT) | 9.0.2 | Authentication |
| bcryptjs | 2.4.3 | Password hashing |
| Mongoose | 8.5.1 | MongoDB object modeling |
| Multer | 2.0.0 | File upload handling |
| unpdf | 1.6.2 | PDF text extraction |
| express-rate-limit | 7.4.0 | API rate limiting |
| dotenv | 16.4.5 | Environment variable management |

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


### AI Providers

| Provider | Model | Notes |
|---|---|---|
| Groq | `llama-3.3-70b-versatile` | **Recommended** — free tier, OpenAI-compatible API |
| Google Gemini | `gemini-1.5-flash` | Free tier available, vision support |
| OpenAI | `gpt-4o-mini` | Paid tier, vision support |
| Mock | — | Runs without any API key, useful for testing |

---

## ProjectInstallation Instructions

### Prerequisites
- Node.js version 18 or higher
- A free MongoDB Atlas account — [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- A free Groq API key — [console.groq.com/keys](https://console.groq.com/keys)

### Step 1 — Extract the Project

```bash
cd codementor-ai
```

### Step 2 — Set Up the Backend

```bash
cd server
npm install
cp .env.example .env
```

Open `server/.env` and fill in the following values:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/codementor
JWT_SECRET=your_long_random_secret_key
ADMIN_EMAILS=your@email.com
AI_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key
```

Start the development server:

```bash
npm run dev
```

If the database connects successfully, you will see:
```
[db] MongoDB connected
```

### Step 3 — Set Up the Frontend

Open a second terminal window:

```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

### Step 4 — Access the Admin Panel

1. Add your email address to `ADMIN_EMAILS` in `server/.env`
2. Save the file and restart the server (`Ctrl+C` then `npm run dev`)
3. Register or log in using that email address
4. The **Admin** link will appear in the navigation bar
5. Click it or go to `/admin` to access the admin panel

---
## API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create a new account |
| POST | `/api/auth/login` | — | Log in and receive a JWT |
| GET | `/api/auth/me` | Bearer | Get the current user |
| POST | `/api/ai/tutor` | Optional | Explain a programming concept |
| POST | `/api/ai/bug-explainer` | Optional | Detect and explain bugs |
| POST | `/api/ai/error-translator` | Optional | Translate a compiler error |
| POST | `/api/ai/code-improver` | Optional | Suggest code improvements |
| POST | `/api/ai/problem` | Optional | Generate a practice problem |
| GET | `/api/ai/history` | Bearer | Get personal activity history |
| POST | `/api/repo/overview` | Optional | Explain a GitHub repository |
| POST | `/api/repo/file` | Optional | Explain a single file |
| POST | `/api/doc/explain` | Optional | Explain a PDF or image |
| GET | `/api/admin/stats` | Admin | View platform statistics |
| GET | `/api/admin/users` | Admin | List all users |
| GET | `/api/admin/users/:id` | Admin | View one user in detail |
| DELETE | `/api/admin/users/:id` | Admin | Delete a user and their data |
| PATCH | `/api/admin/users/:id/role` | Admin | Promote or demote a user |

---

## Deployment

| Part | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render or Railway |

### Deploy the Frontend on Vercel

1. Push the project to a GitHub repository
2. Import the project on [vercel.com](https://vercel.com), setting the root directory to `client`
3. Add the environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
4. Click Deploy

### Deploy the Backend on Render

1. Create a new Web Service on [render.com](https://render.com), setting the root directory to `server`
2. Set the build command to `npm install` and the start command to `npm start`
3. Add all environment variables from your `.env` file
4. Click Deploy

**Live Deployment Link:** *(Add your URL here after deploying)*

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

---

### Future Features

- Practice Arena UI page for the existing `/api/ai/problem` endpoint
- Personalized learning roadmap using the `WeakTopic` model
- Daily challenge + leaderboard (`DailyChallenge` model)
- AI mock interview (stateful `/api/ai/interview` route)
- Redis cache for repeated AI prompts (Upstash free tier)

---

## Screenshots

| Page | Description |
|---|---|
| Landing Page | Hero section with feature highlights |
| AI Tutor | Chat interface for concept questions |
| Bug Explainer | Monaco editor with AI bug analysis |
| Error Translator | Compiler error to plain language |
| PDF and Image Explainer | File upload with AI explanation |
| Dashboard | XP, level, streak, and activity chart |
| Admin Panel | User management and platform statistics |


---

## License

This project was developed for academic purposes as part of the **CSE4104** course.

> Team CSE4104 - 7B - T04 | Section 7B
