import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const roadmaps = await prisma.roadmap.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: roadmaps });
  } catch (error) {
    console.error("[API] Failed to fetch roadmaps:", error);
    return NextResponse.json(
      { success: false, error: "Database unavailable" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const roadmap = await prisma.roadmap.create({
      data: {
        userId: session.user.id,
        title: body.title,
        description: body.description ?? "",
        estimatedDuration: body.estimatedDuration ?? "",
        phases: body.phases,
        prompt: body.prompt ?? "",
      },
    });

    return NextResponse.json({ success: true, data: roadmap });
  } catch (error) {
    console.error("[API] Failed to create roadmap:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save roadmap" },
      { status: 500 }
    );
  }
}

