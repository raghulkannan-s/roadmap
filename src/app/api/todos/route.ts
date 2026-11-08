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

    const todos = await prisma.todoList.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: todos });
  } catch (error) {
    console.error("[API] Failed to fetch todos:", error);
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

    const todo = await prisma.todoList.create({
      data: {
        userId: session.user.id,
        title: body.title,
        description: body.description ?? "",
        categories: body.categories,
        prompt: body.prompt ?? "",
      },
    });

    return NextResponse.json({ success: true, data: todo });
  } catch (error) {
    console.error("[API] Failed to create todo:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save todo" },
      { status: 500 }
    );
  }
}
