export interface CreateTodoRequest {
  title: string;
  description?: string;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface TodoResponse {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface TodoListResponse {
  success: boolean;
  data: {
    todos: TodoResponse[];
    total: number;
    page: number;
    limit: number;
  };
}