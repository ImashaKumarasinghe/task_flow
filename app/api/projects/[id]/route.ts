import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  deleteProjectUseCase,
  getProjectUseCase,
  updateProjectUseCase,
} from "@/use-cases/projectUseCases";

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

  const result = await getProjectUseCase(
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

export async function PATCH(request: NextRequest, context: Params) {
  const { id } = await context.params;
  const userResult = await getCurrentUser(request);

  if (!userResult.success) {
    return NextResponse.json(
      { error: userResult.error },
      { status: userResult.statusCode || 401 }
    );
  }

  const body = await request.json();

  const result = await updateProjectUseCase(
    getToken(request),
    userResult.data.id,
    id,
    {
      name: body.name,
      description: body.description,
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
  const { id } = await context.params;
  const userResult = await getCurrentUser(request);

  if (!userResult.success) {
    return NextResponse.json(
      { error: userResult.error },
      { status: userResult.statusCode || 401 }
    );
  }

  const result = await deleteProjectUseCase(
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