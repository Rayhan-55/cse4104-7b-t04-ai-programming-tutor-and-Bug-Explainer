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

**AI Programming Tutor & Bug Explainer** — *CodeMentor AI*

---

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

### Database

| Technology | Purpose |
|---|---|
| MongoDB Atlas | Cloud-hosted NoSQL database |

### AI Providers

| Provider | Model | Notes |
|---|---|---|
| Groq | `llama-3.3-70b-versatile` | **Recommended** — free tier, OpenAI-compatible API |
| Google Gemini | `gemini-1.5-flash` | Free tier available, vision support |
| OpenAI | `gpt-4o-mini` | Paid tier, vision support |
| Mock | — | Runs without any API key, useful for testing |

---

## Installation Instructions

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
│
└──documentation/
│
└──diagrams/

```

---

## License

This project was developed for academic purposes as part of the **CSE4104** course.

> Team CSE4104 - 7B - T04 | Section 7B
