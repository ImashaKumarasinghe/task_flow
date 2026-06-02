import { AppResult } from "@/domain/result";
import { Task, TaskStatus } from "@/domain/task";
import { ProjectRepository } from "@/repositories/projectRepository";
import { TaskRepository } from "@/repositories/taskRepository";

async function verifyProjectOwnership(
  accessToken: string,
  userId: string,
  projectId: string
): Promise<AppResult<{ valid: true }>> {
  const projectRepository = new ProjectRepository(accessToken);
  const projectResult = await projectRepository.getProjectById(projectId, userId);

  if (!projectResult.success) {
    return {
      success: false,
      error: "Project not found or access denied",
      statusCode: 404,
    };
  }

  return { success: true, data: { valid: true } };
}

export async function listTasksUseCase(
  accessToken: string,
  userId: string,
  projectId: string
): Promise<AppResult<Task[]>> {
  const ownership = await verifyProjectOwnership(accessToken, userId, projectId);

  if (!ownership.success) return ownership;

  const repository = new TaskRepository(accessToken);
  return repository.listTasks(projectId);
}

export async function createTaskUseCase(
  accessToken: string,
  userId: string,
  projectId: string,
  values: {
    title: string;
    status?: TaskStatus;
    assignedTo?: string;
    dueDate?: string;
  }
): Promise<AppResult<Task>> {
  const ownership = await verifyProjectOwnership(accessToken, userId, projectId);

  if (!ownership.success) return ownership;

  const repository = new TaskRepository(accessToken);
  return repository.createTask(projectId, values);
}

export async function updateTaskUseCase(
  accessToken: string,
  userId: string,
  projectId: string,
  taskId: string,
  values: {
    title?: string;
    status?: TaskStatus;
    assignedTo?: string | null;
    dueDate?: string | null;
  }
): Promise<AppResult<Task>> {
  const ownership = await verifyProjectOwnership(accessToken, userId, projectId);

  if (!ownership.success) return ownership;

  const repository = new TaskRepository(accessToken);
  return repository.updateTask(projectId, taskId, values);
}

export async function deleteTaskUseCase(
  accessToken: string,
  userId: string,
  projectId: string,
  taskId: string
): Promise<AppResult<{ message: string }>> {
  const ownership = await verifyProjectOwnership(accessToken, userId, projectId);

  if (!ownership.success) return ownership;

  const repository = new TaskRepository(accessToken);
  return repository.deleteTask(projectId, taskId);
}