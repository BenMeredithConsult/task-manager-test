import { NextResponse } from "next/server";

let tasks: { id: number; title: string; completed: boolean }[] = [];

export async function GET() {
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const newTask = await req.json();
  tasks.push(newTask);
  return NextResponse.json(newTask, { status: 201 });
}
