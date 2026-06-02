import { NextRequest, NextResponse } from "next/server";
import { signInUseCase } from "@/use-cases/authUseCases";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "email and password are required" },
      { status: 400 }
    );
  }

  const result = await signInUseCase(email, password);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: result.statusCode || 500 }
    );
  }

  return NextResponse.json(result.data);
}