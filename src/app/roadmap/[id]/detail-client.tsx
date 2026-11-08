"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

import { RoadmapView } from "@/components/roadmap-view";
import { useRoadmap } from "@/hooks/use-local-storage";

interface RoadmapDetailClientProps {
  id: string;
}

export function RoadmapDetailClient({ id }: RoadmapDetailClientProps) {
  const router = useRouter();
  const roadmap = useRoadmap(id);

  if (!roadmap) {
    return (
      <main className="flex-1 py-16 px-4 text-center">
        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 dark:bg-rose-950/50 dark:text-rose-400">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Roadmap Not Found</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            This roadmap could not be found in your local storage. It may have been deleted.
          </p>
          <Link
            href="/"
            className="mt-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:opacity-95"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 py-8 px-4 sm:px-6">
      <RoadmapView
        data={roadmap}
        prompt={roadmap.prompt}
        onBack={() => router.push("/")}
      />
    </main>
  );
}
