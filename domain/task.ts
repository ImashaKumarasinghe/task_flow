export type TaskStatus = "todo" | "in_progress" | "done";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  projectId: string;
  assignedTo: string | null;
  dueDate: string | null;
  createdAt: string;
}