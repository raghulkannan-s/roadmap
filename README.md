# 🗺️ RoadmapAI — AI Roadmap & Todo Generator

An intelligent planning application built with **Next.js 16**, **React 19**, **Tailwind CSS**, **Google Gemini AI**, **NextAuth.js (Auth.js v5)**, and **Prisma ORM** with **PostgreSQL / Neon Database**.

---

## ✨ Features

- 🧠 **AI-Powered Generation**: Uses `gemini-2.0-flash` with structured system instructions to return typed JSON plans.
- 🗺️ **Roadmap Mode**: Breaks complex goals into sequential phases with actionable milestones and time estimates.
- ✅ **Todo Mode**: Generates categorized, prioritized task lists (High / Medium / Low).
- 🔐 **Google OAuth 2.0**: Secure authentication via Auth.js (NextAuth v5).
- 🐘 **PostgreSQL & Neon DB**: Plug in your local PostgreSQL or online serverless Neon DB via Prisma ORM with zero code changes.
- ☁️ **Dual Storage (Local + Cloud)**:
  - **Guests**: Stored locally in the browser with `localStorage`.
  - **Signed-in users**: Synced to PostgreSQL / Neon with local offline caching.
- 📊 **Dynamic Progress Tracking**: Interactive checkboxes with instant completion calculation and visual progress bars.
- 📱 **Clean & Responsive UI**: Built with Tailwind CSS, clean typography, accessible controls, and loading skeletons.

---

## 🏗️ Folder Structure

```
roadmap/
├── prisma/
│   └── schema.prisma             # PostgreSQL & NextAuth database schema
├── CONTEXT.md                    # Project coding standards & architectural guidelines
├── .env.example                  # Environment variables template
├── public/                       # Static assets
└── src/
    ├── app/
    │   ├── api/
    │   │   ├── auth/[...nextauth]/route.ts  # NextAuth route handler
    │   │   ├── generate/route.ts            # Gemini AI generation endpoint
    │   │   ├── roadmaps/route.ts            # Roadmaps CRUD (Database)
    │   │   ├── roadmaps/[id]/route.ts
    │   │   ├── todos/route.ts               # Todos CRUD (Database)
    │   │   └── todos/[id]/route.ts
    │   ├── roadmap/[id]/page.tsx            # Saved roadmap detail viewer
    │   ├── todo/[id]/page.tsx               # Saved todo detail viewer
    │   ├── layout.tsx                       # Root layout with Auth & Generation providers
    │   └── page.tsx                         # Main dashboard
    ├── components/
    │   ├── auth-button.tsx       # Google Sign In / User Avatar / Sign Out
    │   ├── auth-provider.tsx     # NextAuth SessionProvider wrapper
    │   ├── header.tsx            # Sticky navigation bar
    │   ├── prompt-input.tsx      # Textarea with mode selector & shortcuts
    │   ├── mode-toggle.tsx       # Roadmap / Todo toggle button
    │   ├── roadmap-view.tsx      # Phased roadmap with progress & Cloud Save
    │   ├── todo-view.tsx         # Interactive todo with progress & Cloud Save
    │   ├── saved-items-list.tsx  # Filterable grid of saved plans
    │   └── saved-item-card.tsx   # Card representation for saved items
    ├── context/
    │   └── generation-context.tsx# Global state for prompt and generation
    ├── hooks/
    │   └── use-local-storage.ts  # React 19 useSyncExternalStore hooks
    ├── auth.ts                   # NextAuth v5 configuration & Google Provider
    └── lib/
        ├── prisma.ts             # Prisma Client singleton
        ├── storage.ts            # Local storage persistence
        ├── types.ts              # Strict TypeScript definitions
        └── utils.ts              # Utility functions
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.17+ or later
- npm or yarn
- A PostgreSQL database (local or [Neon Serverless](https://neon.tech))

### 2. Installation
```bash
git clone <repository-url>
cd roadmap
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```env
# Gemini API Key (https://aistudio.google.com/apikey)
GEMINI_API_KEY=your_gemini_api_key_here

# PostgreSQL / Neon Database URL
# Local: postgresql://postgres:password@localhost:5432/roadmap
# Neon:  postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require
DATABASE_URL="postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require"

# NextAuth / Auth.js Secret
AUTH_SECRET="a-random-32-char-secret"

# Google Cloud OAuth 2.0 Credentials
AUTH_GOOGLE_ID="your-client-id.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="your-client-secret"
```

### 4. Database Setup
Push the schema to your database (local or Neon):
```bash
npx prisma db push
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
