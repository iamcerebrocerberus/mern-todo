import prisma from '../config/database';
import { CreateTodoRequest, UpdateTodoRequest } from '../types/todo';

class TodoService {
  // Get all todos for a user with pagination
  async getUserTodos(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [todos, total] = await Promise.all([
      prisma.todo.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.todo.count({
        where: { userId }
      })
    ]);

    return {
      todos,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  // Get a specific todo by ID
  async getTodoById(todoId: string, userId: string) {
    const todo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId // Ensure user can only access their own todos
      }
    });

    if (!todo) {
      throw new Error('Todo not found or access denied');
    }

    return todo;
  }

  // Create a new todo
  async createTodo(userId: string, data: CreateTodoRequest) {
    const { title, description } = data;

    // Business logic validation
    if (!title || title.trim().length === 0) {
      throw new Error('Todo title is required');
    }

    if (title.length > 200) {
      throw new Error('Todo title must be less than 200 characters');
    }

    const todo = await prisma.todo.create({
      data: {
        title: title.trim(),
        description: description?.trim(),
        userId
      }
    });

    return todo;
  }

  // Update a todo
  async updateTodo(todoId: string, userId: string, data: UpdateTodoRequest) {
    // First check if todo exists and belongs to user
    await this.getTodoById(todoId, userId);

    // Prepare update data
    const updateData: any = {};
    
    if (data.title !== undefined) {
      if (!data.title || data.title.trim().length === 0) {
        throw new Error('Todo title cannot be empty');
      }
      if (data.title.length > 200) {
        throw new Error('Todo title must be less than 200 characters');
      }
      updateData.title = data.title.trim();
    }

    if (data.description !== undefined) {
      updateData.description = data.description?.trim() || null;
    }

    if (data.completed !== undefined) {
      updateData.completed = data.completed;
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: todoId },
      data: updateData
    });

    return updatedTodo;
  }

  // Delete a todo
  async deleteTodo(todoId: string, userId: string) {
    // First check if todo exists and belongs to user
    await this.getTodoById(todoId, userId);

    await prisma.todo.delete({
      where: { id: todoId }
    });

    return { message: 'Todo deleted successfully' };
  }

  // Get todo statistics for user
  async getTodoStats(userId: string) {
    const [total, completed, pending] = await Promise.all([
      prisma.todo.count({ where: { userId } }),
      prisma.todo.count({ where: { userId, completed: true } }),
      prisma.todo.count({ where: { userId, completed: false } })
    ]);

    return {
      total,
      completed,
      pending,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      pendingRate: total > 0 ? Math.round((pending / total) * 100) : 0
    };
  }
}

export default new TodoService();