import { createSupabaseClient } from "@/lib/supabase/server";
import { AppResult } from "@/domain/result";
import { AppUser } from "@/domain/user";
import { handleError } from "@/lib/errors";

export class UserRepository {
  private supabase;

  constructor(accessToken: string) {
    this.supabase = createSupabaseClient(accessToken);
  }

  async createUserProfile(user: AppUser): Promise<AppResult<AppUser>> {
    try {
      const { error } = await this.supabase.from("users").insert({
        id: user.id,
        email: user.email,
        name: user.name,
      });

      if (error) {
        console.error("[UserRepository.createUserProfile]", error);
        return { success: false, error: error.message, statusCode: 400 };
      }

      return { success: true, data: user };
    } catch (error) {
      return handleError<AppUser>(error);
    }
  }
}