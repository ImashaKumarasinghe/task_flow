import { NextRequest } from "next/server";
import { createSupabaseClient } from "./supabase/server";
import { AppResult } from "@/domain/result";
import { AppUser } from "@/domain/user";

export async function getCurrentUser(
  request: NextRequest
): Promise<AppResult<AppUser>> {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      success: false,
      error: "Unauthorized. Missing token.",
      statusCode: 401,
    };
  }

  const token = authHeader.replace("Bearer ", "");
  const supabase = createSupabaseClient(token);

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    console.error("[Auth Error]", error);
    return {
      success: false,
      error: "Invalid or expired token.",
      statusCode: 401,
    };
  }

  return {
    success: true,
    data: {
      id: data.user.id,
      email: data.user.email || "",
    },
  };
}