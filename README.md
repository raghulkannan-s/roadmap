<div align="center">

# 🗺️ RoadmapAI

**Transform high-level goals into phased roadmaps and prioritized task lists using AI.**

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-2563eb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2d3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Neon Database](https://img.shields.io/badge/Neon-PostgreSQL-00e599?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![Auth.js](https://img.shields.io/badge/Auth.js-v5_Beta-9333ea?style=for-the-badge&logo=auth0)](https://authjs.dev/)

<br />

[Features](#-key-features) • [Architecture](#-system-architecture) • [Data Model](#-database-schema) • [Getting Started](#-getting-started) • [Environment Variables](#-environment-variables) • [Tech Stack](#-tech-stack)

</div>

---

## 📖 About the Project

**RoadmapAI** is an AI-powered project planning and task orchestration platform. When planning complex ventures — whether learning a new technical stack, launching a software product, or preparing for interviews — developers and planners often struggle with breaking monolithic goals into structured, actionable phases.

RoadmapAI solves this by pairing Google's **Gemini AI Engine** with strict structured JSON schemas:
1. **Interactive Phased Roadmaps**: Groups goals into sequential phases, milestones, and estimated durations.
2. **Prioritized Todo Workspaces**: Generates categorized task lists with High, Medium, and Low priorities.
3. **Cloud Native Storage**: Connects directly to **PostgreSQL / Neon Serverless DB** with Google OAuth 2.0.
4. **Solid Classy Palette & Theming**: Polished executive blue design with full **Dark & Light Mode** support.

---

## ✨ Key Features

- 🧠 **AI Plan Generation**: Converts natural language prompts into fully typed, structured plans using `gemini-2.0-flash`.
- 🔐 **Google OAuth 2.0 Guard**: Authentication via **Auth.js (NextAuth v5)** required before generation, ensuring your plans are tied to your account.
- 🐘 **Serverless Cloud Storage (Neon / PostgreSQL)**: Plans, milestone statuses, and task completions sync directly to the database via Prisma ORM.
- 🌓 **Classy Dark & Light Modes**: System-aware theme toggle with zero hydration flicker using `next-themes` and a tailored solid blue palette.
- 📊 **Real-time Progress Calculation**: Dynamic percentage indicators that update instantly across milestones and categories.
- ⚡ **Zero-Latency Interactions**: Optimistic client updates with automatic server synchronization.
- 📱 **Mobile & Desktop Responsive**: Built with Tailwind CSS, clean typography, accessible controls, and loading skeletons.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Client["🖥️ Next.js 16 Client (React 19)"]
        UI["User Interface (Home / Dashboard / Detail)"]
        Theme["next-themes (Dark / Light Mode)"]
        AuthUI["Google Sign-In Button (Auth.js)"]
        State["Generation Context & Hooks"]
    end

    subgraph Server["⚡ Next.js App Router (Server-Side)"]
        AuthRoute["/api/auth/[...nextauth]"]
        GenRoute["/api/generate (Protected via auth)"]
        RoadmapRoute["/api/roadmaps & /api/roadmaps/[id]"]
        TodoRoute["/api/todos & /api/todos/[id]"]
        PrismaClient["Prisma ORM Client Singleton"]
    end

    subgraph External["🌐 Cloud & AI Services"]
        GoogleAuth["Google OAuth 2.0 Provider"]
        GeminiAI["Google Gemini API (gemini-2.0-flash)"]
        NeonDB[("🐘 Neon Serverless PostgreSQL / Local Postgres")]
    end

    UI --> State
    AuthUI --> GoogleAuth
    GoogleAuth --> AuthRoute
    State --> GenRoute
    GenRoute --> GeminiAI
    GeminiAI --> GenRoute
    GenRoute --> State

    UI --> RoadmapRoute
    UI --> TodoRoute
    RoadmapRoute --> PrismaClient
    TodoRoute --> PrismaClient
    AuthRoute --> PrismaClient
    PrismaClient --> NeonDB
```

### Request Flow
1. **Authentication Check**: User connects via Google OAuth. Session token is verified with Auth.js JWT strategy.
2. **Prompt Dispatch**: The user inputs a prompt and selects a mode (`roadmap` or `todo`).
3. **Structured System Instruction**: Server formats prompt with schema rules and forwards to Gemini AI.
4. **JSON Parsing & Validation**: Cleaned, typed JSON response is returned to the client.
5. **Database Persistence**: The user saves or checks items; the application calls `/api/roadmaps` or `/api/todos` to persist in PostgreSQL.

---

## 🗄️ Database Schema

```mermaid
erDiagram
    User ||--o{ Account : "has many"
    User ||--o{ Session : "has many"
    User ||--o{ Roadmap : "owns"
    User ||--o{ TodoList : "owns"

    User {
        String id PK
        String name
        String email UK
        DateTime emailVerified
        String image
        DateTime createdAt
        DateTime updatedAt
    }

    Account {
        String id PK
        String userId FK
        String type
        String provider
        String providerAccountId
        String refresh_token
        String access_token
        Int expires_at
    }

    Session {
        String id PK
        String sessionToken UK
        String userId FK
        DateTime expires
    }

    Roadmap {
        String id PK
        String userId FK
        String title
        String description
        String estimatedDuration
        Json phases
        String prompt
        DateTime createdAt
        DateTime updatedAt
    }

    TodoList {
        String id PK
        String userId FK
        String title
        String description
        Json categories
        String prompt
        DateTime createdAt
        DateTime updatedAt
    }
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `18.17+` or `20+`
- **npm** or **yarn** or **pnpm**
- A **Google Cloud Console** account (for OAuth)
- A **Google AI Studio** account (for Gemini API)
- A **Neon PostgreSQL** database (or local PostgreSQL)

### 2. Clone and Install
```bash
git clone https://github.com/your-username/roadmap.git
cd roadmap
npm install
```

### 3. Environment Variables
Copy `.env.example` to create your `.env.local`:
```bash
cp .env.example .env.local
```

Populate the required credentials in `.env.local`:
```env
# 1. Google Gemini AI API Key
GEMINI_API_KEY="your-gemini-api-key"

# 2. Database Connection URL (Local Postgres or Neon Serverless)
# Local: postgresql://postgres:password@localhost:5432/roadmap
# Neon:  postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require
DATABASE_URL="postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require"

# 3. NextAuth / Auth.js Secret
AUTH_SECRET="your-random-32-char-secret"

# 4. Google OAuth 2.0 Credentials (from Google Cloud Console)
AUTH_GOOGLE_ID="your-client-id.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="your-client-secret"
```

> **Google OAuth Configuration**:
> Set your **Authorized Redirect URI** in Google Cloud Console to:
> `http://localhost:3000/api/auth/callback/google`

### 4. Push Database Schema
Sync your database with Prisma schema:
```bash
npx prisma db push
```

### 5. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
roadmap/
├── prisma/
│   └── schema.prisma             # PostgreSQL & NextAuth schema definitions
├── CONTEXT.md                    # Architecture rules & coding standards
├── .env.example                  # Environment variables guide
├── public/                       # Static public assets
└── src/
    ├── app/
    │   ├── api/
    │   │   ├── auth/[...nextauth]/route.ts  # NextAuth OAuth handler
    │   │   ├── generate/route.ts            # Protected Gemini AI generation endpoint
    │   │   ├── roadmaps/route.ts            # Roadmaps collection CRUD
    │   │   ├── roadmaps/[id]/route.ts       # Single roadmap operations
    │   │   ├── todos/route.ts               # Todos collection CRUD
    │   │   └── todos/[id]/route.ts          # Single todo operations
    │   ├── roadmap/[id]/page.tsx            # Server-streamed roadmap detail view
    │   ├── todo/[id]/page.tsx               # Server-streamed todo detail view
    │   ├── layout.tsx                       # Root layout with Theme & Auth providers
    │   ├── page.tsx                         # Main Dashboard
    │   └── globals.css                      # Tailwind CSS v4 styling & dark mode rules
    ├── components/
    │   ├── auth-button.tsx       # Google Sign In / User Avatar / Sign Out
    │   ├── auth-provider.tsx     # SessionProvider wrapper
    │   ├── theme-provider.tsx    # next-themes Provider wrapper
    │   ├── theme-toggle.tsx      # Dark / Light mode toggle
    │   ├── header.tsx            # Sticky navigation bar
    │   ├── prompt-input.tsx      # Generation input with auth lock
    │   ├── mode-toggle.tsx       # Roadmap / Todo segmented control
    │   ├── roadmap-view.tsx      # Interactive roadmap with Cloud Save
    │   ├── todo-view.tsx         # Interactive todo with Cloud Save
    │   ├── saved-items-list.tsx  # Cloud-synced plans dashboard
    │   └── saved-item-card.tsx   # Plan summary card
    ├── context/
    │   └── generation-context.tsx# Generation state management
    ├── auth.ts                   # NextAuth v5 configuration
    └── lib/
        ├── prisma.ts             # Prisma Client singleton
        ├── prompts.ts            # System prompts & JSON schemas
        ├── types.ts              # Strict TypeScript definitions
        └── utils.ts              # Utility helpers
```

---

## 🛠️ Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 16.4 (App Router) | Partial Prerendering (PPR), Server Components, streaming |
| **UI Library** | React 19.3 | Latest React features, modern hooks |
| **Styling** | Tailwind CSS v4 | Zero-runtime CSS, modern `@variant dark` system |
| **Theming** | next-themes | SSR-safe, flicker-free Light & Dark theme switching |
| **AI Model** | Google Gemini (`gemini-2.0-flash`) | Fast inference, structured JSON output |
| **Authentication** | Auth.js (NextAuth v5) | Secure OAuth 2.0 integration with JWT sessions |
| **ORM** | Prisma 6.19 | Fully typed database client with PostgreSQL adapter |
| **Database** | Neon Serverless PostgreSQL | Autoscaling serverless database with instant branching |
| **Icons** | Lucide React | Clean, tree-shakeable icon set |

---

## 🔒 Security Best Practices

- **API Keys Protected**: `GEMINI_API_KEY` and `AUTH_GOOGLE_SECRET` are strictly server-side and never exposed to the client.
- **Protected Endpoints**: The AI generation route and database mutation endpoints verify authenticated sessions via `auth()` before execution.
- **SQL Injection Prevention**: Prisma ORM uses parameterized queries for all operations.

---

## 📄 License

This project is licensed under the MIT License.
