"use client";

import Link from "next/link";
import { Sparkles, Map } from "lucide-react";

import { AuthButton } from "./auth-button";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/75 backdrop-blur-md transition-colors dark:border-slate-800/80 dark:bg-slate-950/75">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white shadow-xs shadow-indigo-500/20">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              RoadmapAI
            </span>
            <span className="hidden sm:inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 border border-indigo-100 dark:bg-indigo-950/50 dark:border-indigo-800/60 dark:text-indigo-400">
              Studio
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Generate</span>
          </Link>
          <a
            href="#saved-items"
            className="hidden sm:flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <Map className="h-3.5 w-3.5" />
            <span>Saved Plans</span>
          </a>

          <ThemeToggle />
          <AuthButton />
        </nav>
      </div>
    </header>
  );
}
