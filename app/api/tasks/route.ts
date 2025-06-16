import { NextRequest, NextResponse } from "next/server";
import { getTasks, setTasks } from "@/lib/utils";

export async function GET() {
  const tasks = await getTasks();
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const tasks = await req.json();
  await setTasks(tasks);
  return NextResponse.json({ success: true });
}
