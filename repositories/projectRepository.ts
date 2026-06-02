import { Project } from "@/domain/project";
import { AppResult } from "@/domain/result";
import { createSupabaseClient } from "@/lib/supabase/server";
import { handleError } from "@/lib/errors";

type ProjectRow = {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  created_at: string;
};

function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    ownerId: row.owner_id,
    createdAt: row.created_at,
  };
}

export class ProjectRepository {
  private supabase;

  constructor(accessToken: string) {
    this.supabase = createSupabaseClient(accessToken);
  }

  async listProjects(ownerId: string): Promise<AppResult<Project[]>> {
    try {
      const { data, error } = await this.supabase
        .from("projects")
        .select("*")
        .eq("owner_id", ownerId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[ProjectRepository.listProjects]", error);
        return { success: false, error: error.message, statusCode: 400 };
      }

      return {
        success: true,
        data: (data || []).map(mapProject),
      };
    } catch (error) {
      return handleError<Project[]>(error);
    }
  }

  async createProject(
    ownerId: string,
    name: string,
    description?: string
  ): Promise<AppResult<Project>> {
    try {
      const { data, error } = await this.supabase
        .from("projects")
        .insert({
  name,
  description: description || null,
  owner_id: ownerId,
})
        .select("*")
        .single();

      if (error) {
        console.error("[ProjectRepository.createProject]", error);
        return { success: false, error: error.message, statusCode: 400 };
      }

      return { success: true, data: mapProject(data) };
    } catch (error) {
      return handleError<Project>(error);
    }
  }

  async getProjectById(
    projectId: string,
    ownerId: string
  ): Promise<AppResult<Project>> {
    try {
      const { data, error } = await this.supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .eq("owner_id", ownerId)
        .single();

      if (error) {
        console.error("[ProjectRepository.getProjectById]", error);
        return { success: false, error: "Project not found", statusCode: 404 };
      }

      return { success: true, data: mapProject(data) };
    } catch (error) {
      return handleError<Project>(error);
    }
  }

  async updateProject(
    projectId: string,
    ownerId: string,
    values: { name?: string; description?: string }
  ): Promise<AppResult<Project>> {
    try {
      const { data, error } = await this.supabase
        .from("projects")
        .update(values)
        .eq("id", projectId)
        .eq("owner_id", ownerId)
        .select("*")
        .single();

      if (error) {
        console.error("[ProjectRepository.updateProject]", error);
        return { success: false, error: error.message, statusCode: 400 };
      }

      return { success: true, data: mapProject(data) };
    } catch (error) {
      return handleError<Project>(error);
    }
  }

  async deleteProject(
    projectId: string,
    ownerId: string
  ): Promise<AppResult<{ message: string }>> {
    try {
      const { error } = await this.supabase
        .from("projects")
        .delete()
        .eq("id", projectId)
        .eq("owner_id", ownerId);

      if (error) {
        console.error("[ProjectRepository.deleteProject]", error);
        return { success: false, error: error.message, statusCode: 400 };
      }

      return {
        success: true,
        data: { message: "Project deleted successfully" },
      };
    } catch (error) {
      return handleError<{ message: string }>(error);
    }
  }
}