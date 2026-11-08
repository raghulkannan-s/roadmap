// ===== GENERATION MODES =====

export type GenerationMode = "roadmap" | "todo";

// ===== ROADMAP =====

export interface Milestone {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
}

export interface Phase {
  id: string;
  title: string;
  description: string;
  duration: string;
  order: number;
  milestones: Milestone[];
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  estimatedDuration: string;
  phases: Phase[];
  createdAt: string;
  prompt: string;
}

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

// ===== API =====

export interface GenerateRequest {
  prompt: string;
  mode: GenerationMode;
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

