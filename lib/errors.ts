import { AppResult } from "@/domain/result";

export function handleError<T>(
  error: unknown,
  message = "Something went wrong",
  statusCode = 500
): AppResult<T> {
  console.error("[App Error]", error);

  if (error instanceof Error) {
    return {
      success: false,
      error: error.message || message,
      statusCode,
    };
  }

  return {
    success: false,
    error: message,
    statusCode,
  };
}