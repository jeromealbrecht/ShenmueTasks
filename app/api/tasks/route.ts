import { NextRequest, NextResponse } from "next/server";
import { getTasks, setTasks } from "@/lib/utils";

export async function GET() {
  try {
    const tasks = await getTasks();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const tasks = await req.json();
    await setTasks(tasks);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    return NextResponse.json(
      { error: "Failed to save tasks", details: String(error) },
      { status: 500 }
    );
  }
}
