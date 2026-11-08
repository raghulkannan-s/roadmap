# 🗺️ RoadmapAI — AI Roadmap & Todo Generator

An intelligent planning application built with **Next.js 16**, **React 19**, **Tailwind CSS**, and the **Google Gemini API**. Type your goal, idea, or learning path, and generate structured, actionable roadmaps or prioritized todo lists in seconds. Everything is stored locally in your browser.

---

## ✨ Features

- 🧠 **AI-Powered Generation**: Uses Google's `gemini-2.0-flash` with structured system instructions to return typed JSON plans.
- 🗺️ **Roadmap Mode**: Breaks complex goals into sequential phases with actionable milestones and time estimates.
- ✅ **Todo Mode**: Generates categorized, prioritized task lists (High / Medium / Low).
- 📊 **Dynamic Progress Tracking**: Interactive checkboxes with instant completion calculation and visual progress bars.
- 💾 **Local Storage Persistence**: Save, load, and manage your plans directly in the browser — zero database setup required.
- 📱 **Clean & Responsive UI**: Built with Tailwind CSS, clean typography, accessible controls, and loading skeletons.

---

## 🏗️ Folder Structure

```
roadmap/
├── CONTEXT.md                    # Coding standards & architectural guidelines
├── .env.example                  # Environment variables template
├── public/                       # Static assets
└── src/
    ├── app/
    │   ├── api/
    │   │   └── generate/
    │   │       └── route.ts      # Server-side Gemini AI generation endpoint
    │   ├── roadmap/
    │   │   └── [id]/
    │   │       └── page.tsx      # Saved roadmap detail viewer
    │   ├── todo/
    │   │   └── [id]/
    │   │       └── page.tsx      # Saved todo detail viewer
    │   ├── layout.tsx            # Root layout with Header & Context Provider
    │   ├── page.tsx              # Main dashboard (Generator & Saved Plans)
    │   └── globals.css           # Global Tailwind CSS styles
    ├── components/
    │   ├── header.tsx            # Sticky navigation bar
    │   ├── prompt-input.tsx      # Textarea with mode selector & shortcuts
    │   ├── mode-toggle.tsx       # Roadmap / Todo toggle button
    │   ├── roadmap-view.tsx      # Interactive roadmap viewer
    │   ├── phase-card.tsx        # Milestone phase card
    │   ├── milestone-item.tsx    # Single milestone checkbox item
    │   ├── todo-view.tsx         # Interactive todo viewer
    │   ├── category-group.tsx    # Categorized task container
    │   ├── task-item.tsx         # Priority badge & checkbox task item
    │   ├── progress-bar.tsx      # Progress percentage indicator
    │   ├── saved-items-list.tsx  # Filterable grid of saved plans
    │   ├── saved-item-card.tsx   # Card representation for saved items
    │   └── loading-skeleton.tsx  # Pulse skeleton during AI generation
    ├── context/
    │   └── generation-context.tsx# Global state for prompt and generation
    └── lib/
        ├── constants.ts          # Storage keys and priority color maps
        ├── prompts.ts            # System instructions and JSON schemas
        ├── storage.ts            # Browser localStorage helper methods
        ├── types.ts              # Strict TypeScript definitions
        └── utils.ts              # Utility functions (cn, generateId, calculateProgress)
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.17+ or later
- npm or yarn

### 2. Installation
```bash
git clone <repository-url>
cd roadmap
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
> Obtain a free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey).

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS
- **AI Engine**: `@google/generative-ai` (`gemini-2.0-flash`)
- **Icons**: Lucide React
- **Language**: TypeScript (Strict Mode)
