import { NextRequest, NextResponse } from "next/server";
import { signUpUseCase } from "@/use-cases/authUseCases";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password, name } = body;

  if (!email || !password || !name) {
    return NextResponse.json(
      { error: "email, password and name are required" },
      { status: 400 }
    );
  }

  const result = await signUpUseCase(email, password, name);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: result.statusCode || 500 }
    );
  }

  return NextResponse.json(result.data, { status: 201 });
}