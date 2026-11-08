import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const todo = await prisma.todoList.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!todo) {
      return NextResponse.json(
        { success: false, error: "Todo not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: todo });
  } catch (error) {
    console.error("[API] Failed to get todo:", error);
    return NextResponse.json(
      { success: false, error: "Database unavailable" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.todoList.updateMany({
      where: { id, userId: session.user.id },
      data: {
        ...(body.categories !== undefined && { categories: body.categories }),
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
      },
    });

    if (updated.count === 0) {
      return NextResponse.json(
        { success: false, error: "Todo not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] Failed to update todo:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    await prisma.todoList.deleteMany({
      where: { id, userId: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] Failed to delete todo:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}

