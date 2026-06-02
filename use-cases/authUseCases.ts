import { createSupabaseClient } from "@/lib/supabase/server";
import { AppResult } from "@/domain/result";
import { AppUser } from "@/domain/user";
import { UserRepository } from "@/repositories/userRepository";
import { handleError } from "@/lib/errors";



export async function signUpUseCase(
  email: string,
  password: string,
  name: string
): Promise<AppResult<AppUser>> {
  try {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error || !data.user) {
      console.error("[signUpUseCase]", error);
      return {
        success: false,
        error: error?.message || "Signup failed",
        statusCode: 400,
      };
    }

    return {
      success: true,
      data: {
        id: data.user.id,
        email: data.user.email || email,
        name,
      },
    };
  } catch (error) {
    return handleError<AppUser>(error);
  }
}
export async function signInUseCase(
  email: string,
  password: string
): Promise<AppResult<{ accessToken: string; refreshToken: string }>> {
  try {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      console.error("[signInUseCase]", error);
      return {
        success: false,
        error: error?.message || "Signin failed",
        statusCode: 400,
      };
    }

    return {
      success: true,
      data: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
      },
    };
  } catch (error) {
    return handleError<{ accessToken: string; refreshToken: string }>(error);
  }
}

export async function signOutUseCase(
  accessToken: string
): Promise<AppResult<{ message: string }>> {
  try {
    const supabase = createSupabaseClient(accessToken);

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("[signOutUseCase]", error);
      return { success: false, error: error.message, statusCode: 400 };
    }

    return {
      success: true,
      data: { message: "Signed out successfully" },
    };
  } catch (error) {
    return handleError<{ message: string }>(error);
  }
}