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

    const roadmap = await prisma.roadmap.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!roadmap) {
      return NextResponse.json(
        { success: false, error: "Roadmap not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: roadmap });
  } catch (error) {
    console.error("[API] Failed to get roadmap:", error);
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

    const updated = await prisma.roadmap.updateMany({
      where: { id, userId: session.user.id },
      data: {
        ...(body.phases !== undefined && { phases: body.phases }),
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
      },
    });

    if (updated.count === 0) {
      return NextResponse.json(
        { success: false, error: "Roadmap not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] Failed to update roadmap:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update roadmap" },
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

    await prisma.roadmap.deleteMany({
      where: { id, userId: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] Failed to delete roadmap:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete roadmap" },
      { status: 500 }
    );
  }
}
