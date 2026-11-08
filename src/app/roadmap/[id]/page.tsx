import { Suspense } from "react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { RoadmapDetailClient } from "./detail-client";

import type { Roadmap } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function RoadmapDetailContent({ params }: PageProps) {
  const { id } = await params;
  let roadmap: Roadmap | null = null;

  try {
    const session = await auth();
    if (session?.user?.id) {
      const record = await prisma.roadmap.findFirst({
        where: { id, userId: session.user.id },
      });
      if (record) {
        roadmap = {
          id: record.id,
          title: record.title,
          description: record.description,
          estimatedDuration: record.estimatedDuration,
          phases: record.phases as unknown as Roadmap["phases"],
          prompt: record.prompt,
          createdAt: record.createdAt.toISOString(),
        };
      }
    }
  } catch {
    // Falls back to client-side fetch in detail client
  }

  return <RoadmapDetailClient id={id} initialData={roadmap} />;
}

export default function RoadmapDetailPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <main className="flex-1 py-12 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
            <div className="h-8 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-800/60 rounded" />
            <div className="h-64 bg-white/70 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800" />
          </div>
        </main>
      }
    >
      <RoadmapDetailContent params={params} />
    </Suspense>
  );
}
