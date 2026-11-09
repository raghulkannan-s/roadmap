"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Sparkles, Loader2, CornerDownLeft, Lock } from "lucide-react";

import { MAX_PROMPT_LENGTH } from "@/lib/constants";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

const PLACEHOLDER = "e.g., Comprehensive checklist to launch an MVP on Vercel...";

const SUGGESTIONS: { label: string; prompt: string }[] = [
  {
    label: "🚀 Launch MVP in 4 Weeks",
    prompt: "Launch a production-ready SaaS MVP in 4 weeks including auth, billing, and landing page",
  },
  {
    label: "💻 Master React 19 & Next.js",
    prompt: "Master modern React 19, Next.js App Router, Server Actions, and Tailwind CSS in 6 weeks",
  },
  {
    label: "📋 Launch Day Checklist",
    prompt: "Comprehensive launch day checklist for a web app: SEO, performance, analytics, legal, and social",
  },
];

export function PromptInput({ onSubmit, isLoading }: PromptInputProps) {
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState("");

  const handleSubmit = () => {
    if (!session?.user) {
      signIn("google");
      return;
    }

    if (!prompt.trim() || isLoading) return;
    onSubmit(prompt.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const charCount = prompt.length;
  const isOverLimit = charCount > MAX_PROMPT_LENGTH;
  const isAuthenticated = Boolean(session?.user);

  return (
    <section className="w-full max-w-2xl mx-auto space-y-4">
      <div className="relative rounded-2xl border border-slate-200 bg-white p-2 shadow-xs transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15 dark:border-slate-800 dark:bg-slate-900/90 dark:focus-within:border-blue-500">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDER}
          rows={3}
          disabled={isLoading}
          className="w-full resize-none bg-transparent px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500 disabled:opacity-50"
        />

        <div className="flex items-center justify-between border-t border-slate-100 pt-2 px-2 dark:border-slate-800/80">
          <span
            className={`text-[11px] font-mono ${
              isOverLimit ? "text-rose-500 font-semibold" : "text-slate-400 dark:text-slate-500"
            }`}
          >
            {charCount}/{MAX_PROMPT_LENGTH}
          </span>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !prompt.trim() || isOverLimit}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs shadow-blue-600/20 transition-all hover:bg-blue-700 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Generate Todo List</span>
                  <CornerDownLeft className="h-3 w-3 opacity-70 ml-0.5 hidden sm:inline" />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => signIn("google")}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs shadow-blue-600/20 transition-all hover:bg-blue-700"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Sign in with Google to Generate</span>
            </button>
          )}
        </div>
      </div>

      {!isAuthenticated && (
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Sign in required to generate and save plans directly to your cloud database.
        </p>
      )}

      {/* Quick suggestions */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Try:</span>
        {SUGGESTIONS.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setPrompt(item.prompt);
            }}
            className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-medium text-slate-600 transition-all hover:border-blue-400 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:border-blue-600 dark:hover:text-blue-400"
          >
            {item.label}
          </button>
        ))}
      </div>
    </section>
  );
}
