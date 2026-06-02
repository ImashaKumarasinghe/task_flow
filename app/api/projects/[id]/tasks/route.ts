import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  createTaskUseCase,
  listTasksUseCase,
} from "@/use-cases/taskUseCases";

function getToken(request: NextRequest): string {
  return request.headers.get("authorization")?.replace("Bearer ", "") || "";
}

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: Params) {
  const { id } = await context.params;

  const userResult = await getCurrentUser(request);

  if (!userResult.success) {
    return NextResponse.json(
      { error: userResult.error },
      { status: userResult.statusCode || 401 }
    );
  }

  const result = await listTasksUseCase(
    getToken(request),
    userResult.data.id,
    id
  );

  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: result.statusCode || 500 }
    );
  }

  return NextResponse.json(result.data);
}

export async function POST(request: NextRequest, context: Params) {
  const { id } = await context.params;

  const userResult = await getCurrentUser(request);

  if (!userResult.success) {
    return NextResponse.json(
      { error: userResult.error },
      { status: userResult.statusCode || 401 }
    );
  }

  const body = await request.json();

  if (!body.title) {
    return NextResponse.json(
      { error: "Task title is required" },
      { status: 400 }
    );
  }

  const result = await createTaskUseCase(
    getToken(request),
    userResult.data.id,
    id,
    {
      title: body.title,
      status: body.status,
      assignedTo: body.assignedTo,
      dueDate: body.dueDate,
    }
  );

  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: result.statusCode || 500 }
    );
  }

  return NextResponse.json(result.data, { status: 201 });
}