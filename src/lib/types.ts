// ===== TODO =====

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  isCompleted: boolean;
}

export interface Category {
  id: string;
  name: string;
  tasks: Task[];
}

export interface TodoList {
  id: string;
  title: string;
  description: string;
  categories: Category[];
  createdAt: string;
  prompt: string;
}

export interface GenerationFallback {
  status: "fallback";
  message: string;
  title: string;
  description: string;
  categories: [];
}

export type GeneratedTodo = (TodoList & { status: "success"; message: string }) | GenerationFallback;

// ===== API =====

export interface GenerateRequest {
  prompt: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
