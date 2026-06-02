import { Task, TaskStatus } from "@/domain/task";
import { AppResult } from "@/domain/result";
import { createSupabaseClient } from "@/lib/supabase/server";
import { handleError } from "@/lib/errors";

type TaskRow = {
  id: string;
  title: string;
  status: TaskStatus;
  project_id: string;
  assigned_to: string | null;
  due_date: string | null;
  created_at: string;
};

function mapTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    status: row.status,
    projectId: row.project_id,
    assignedTo: row.assigned_to,
    dueDate: row.due_date,
    createdAt: row.created_at,
  };
}

export class TaskRepository {
  private supabase;

  constructor(accessToken: string) {
    this.supabase = createSupabaseClient(accessToken);
  }

  async listTasks(projectId: string): Promise<AppResult<Task[]>> {
    try {
      const { data, error } = await this.supabase
        .from("tasks")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[TaskRepository.listTasks]", error);
        return { success: false, error: error.message, statusCode: 400 };
      }

      return {
        success: true,
        data: (data || []).map(mapTask),
      };
    } catch (error) {
      return handleError<Task[]>(error);
    }
  }

  async createTask(
    projectId: string,
    values: {
      title: string;
      status?: TaskStatus;
      assignedTo?: string;
      dueDate?: string;
    }
  ): Promise<AppResult<Task>> {
    try {
      const { data, error } = await this.supabase
        .from("tasks")
        .insert({
          title: values.title,
          status: values.status || "todo",
          project_id: projectId,
          assigned_to: values.assignedTo || null,
          due_date: values.dueDate || null,
        })
        .select("*")
        .single();

      if (error) {
        console.error("[TaskRepository.createTask]", error);
        return { success: false, error: error.message, statusCode: 400 };
      }

      return { success: true, data: mapTask(data) };
    } catch (error) {
      return handleError<Task>(error);
    }
  }

  async updateTask(
    projectId: string,
    taskId: string,
    values: {
      title?: string;
      status?: TaskStatus;
      assignedTo?: string | null;
      dueDate?: string | null;
    }
  ): Promise<AppResult<Task>> {
    try {
      const updateData = {
        ...(values.title !== undefined && { title: values.title }),
        ...(values.status !== undefined && { status: values.status }),
        ...(values.assignedTo !== undefined && {
          assigned_to: values.assignedTo,
        }),
        ...(values.dueDate !== undefined && { due_date: values.dueDate }),
      };

      const { data, error } = await this.supabase
        .from("tasks")
        .update(updateData)
        .eq("id", taskId)
        .eq("project_id", projectId)
        .select("*")
        .single();

      if (error) {
        console.error("[TaskRepository.updateTask]", error);
        return { success: false, error: error.message, statusCode: 400 };
      }

      return { success: true, data: mapTask(data) };
    } catch (error) {
      return handleError<Task>(error);
    }
  }

  async deleteTask(
    projectId: string,
    taskId: string
  ): Promise<AppResult<{ message: string }>> {
    try {
      const { error } = await this.supabase
        .from("tasks")
        .delete()
        .eq("id", taskId)
        .eq("project_id", projectId);

      if (error) {
        console.error("[TaskRepository.deleteTask]", error);
        return { success: false, error: error.message, statusCode: 400 };
      }

      return {
        success: true,
        data: { message: "Task deleted successfully" },
      };
    } catch (error) {
      return handleError<{ message: string }>(error);
    }
  }
}