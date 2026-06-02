import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  createProjectUseCase,
  listProjectsUseCase,
} from "@/use-cases/projectUseCases";

function getToken(request: NextRequest): string {
  return request.headers.get("authorization")?.replace("Bearer ", "") || "";
}

export async function GET(request: NextRequest) {
  const userResult = await getCurrentUser(request);

  if (!userResult.success) {
    return NextResponse.json(
      { error: userResult.error },
      { status: userResult.statusCode || 401 }
    );
  }

  const result = await listProjectsUseCase(getToken(request), userResult.data.id);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: result.statusCode || 500 }
    );
  }

  return NextResponse.json(result.data);
}

export async function POST(request: NextRequest) {
  const userResult = await getCurrentUser(request);

  if (!userResult.success) {
    return NextResponse.json(
      { error: userResult.error },
      { status: userResult.statusCode || 401 }
    );
  }

  const body = await request.json();
  const { name, description } = body;

  if (!name) {
    return NextResponse.json(
      { error: "Project name is required" },
      { status: 400 }
    );
  }

  const result = await createProjectUseCase(
    getToken(request),
    userResult.data.id,
    name,
    description
  );

  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: result.statusCode || 500 }
    );
  }

  return NextResponse.json(result.data, { status: 201 });
}