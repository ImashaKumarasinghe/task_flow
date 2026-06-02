import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  deleteTaskUseCase,
  updateTaskUseCase,
} from "@/use-cases/taskUseCases";

function getToken(request: NextRequest): string {
  return request.headers.get("authorization")?.replace("Bearer ", "") || "";
}

type Params = {
  params: Promise<{ id: string; taskId: string }>;
};

export async function PATCH(request: NextRequest, context: Params) {
  const { id, taskId } = await context.params;
  const userResult = await getCurrentUser(request);

  if (!userResult.success) {
    return NextResponse.json(
      { error: userResult.error },
      { status: userResult.statusCode || 401 }
    );
  }

  const body = await request.json();

  const result = await updateTaskUseCase(
    getToken(request),
    userResult.data.id,
    id,
    taskId,
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

  return NextResponse.json(result.data);
}

export async function DELETE(request: NextRequest, context: Params) {
  const { id, taskId } = await context.params;
  const userResult = await getCurrentUser(request);

  if (!userResult.success) {
    return NextResponse.json(
      { error: userResult.error },
      { status: userResult.statusCode || 401 }
    );
  }

  const result = await deleteTaskUseCase(
    getToken(request),
    userResult.data.id,
    id,
    taskId
  );

  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: result.statusCode || 500 }
    );
  }

  return NextResponse.json(result.data);
}