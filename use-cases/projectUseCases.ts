import { Project } from "@/domain/project";
import { AppResult } from "@/domain/result";
import { ProjectRepository } from "@/repositories/projectRepository";
import { getCache, setCache, deleteCache } from "@/lib/cache";

function projectCacheKey(userId: string) {
  return `projects:${userId}`;
}

export async function listProjectsUseCase(
  accessToken: string,
  userId: string
): Promise<AppResult<Project[]>> {
  const cached = getCache<Project[]>(projectCacheKey(userId));

  if (cached) {
    return { success: true, data: cached };
  }

  const repository = new ProjectRepository(accessToken);
  const result = await repository.listProjects(userId);

  if (result.success) {
    setCache(projectCacheKey(userId), result.data, 60);
  }

  return result;
}

export async function createProjectUseCase(
  accessToken: string,
  userId: string,
  name: string,
  description?: string
): Promise<AppResult<Project>> {
  const repository = new ProjectRepository(accessToken);
  const result = await repository.createProject(userId, name, description);

  if (result.success) {
    deleteCache(projectCacheKey(userId));
  }

  return result;
}

export async function getProjectUseCase(
  accessToken: string,
  userId: string,
  projectId: string
): Promise<AppResult<Project>> {
  const repository = new ProjectRepository(accessToken);
  return repository.getProjectById(projectId, userId);
}

export async function updateProjectUseCase(
  accessToken: string,
  userId: string,
  projectId: string,
  values: { name?: string; description?: string }
): Promise<AppResult<Project>> {
  const repository = new ProjectRepository(accessToken);
  const result = await repository.updateProject(projectId, userId, values);

  if (result.success) {
    deleteCache(projectCacheKey(userId));
  }

  return result;
}

export async function deleteProjectUseCase(
  accessToken: string,
  userId: string,
  projectId: string
): Promise<AppResult<{ message: string }>> {
  const repository = new ProjectRepository(accessToken);
  const result = await repository.deleteProject(projectId, userId);

  if (result.success) {
    deleteCache(projectCacheKey(userId));
  }

  return result;
}