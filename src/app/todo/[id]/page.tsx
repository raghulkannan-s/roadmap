import { Suspense } from "react";

import { TodoDetailClient } from "./detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function TodoDetailContent({ params }: PageProps) {
  const { id } = await params;
  return <TodoDetailClient id={id} />;
}

export default function TodoDetailPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <main className="flex-1 py-12 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
            <div className="h-8 w-1/2 bg-gray-200 rounded-lg" />
            <div className="h-4 w-3/4 bg-gray-100 rounded" />
            <div className="h-64 bg-gray-50 rounded-xl border border-gray-100" />
          </div>
        </main>
      }
    >
      <TodoDetailContent params={params} />
    </Suspense>
  );
}
