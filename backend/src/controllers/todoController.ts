import { Request, Response } from 'express';
import todoService from '../services/todoService';
import { CreateTodoRequest, UpdateTodoRequest } from '../types/todo';

class TodoController {
  // GET /api/todos
  async getTodos(req: Request, res: Response) {
    try {
      const userId = req.user!.id; // From auth middleware
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await todoService.getUserTodos(userId, page, limit);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/todos/:id
  async getTodoById(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const todoId = req.params.id;

      const todo = await todoService.getTodoById(todoId, userId);

      res.status(200).json({
        success: true,
        data: todo
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // POST /api/todos
  async createTodo(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { title, description }: CreateTodoRequest = req.body;

      const todo = await todoService.createTodo(userId, { title, description });

      res.status(201).json({
        success: true,
        message: 'Todo created successfully',
        data: todo
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // PUT /api/todos/:id
  async updateTodo(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const todoId = req.params.id;
      const updateData: UpdateTodoRequest = req.body;

      const todo = await todoService.updateTodo(todoId, userId, updateData);

      res.status(200).json({
        success: true,
        message: 'Todo updated successfully',
        data: todo
      });
    } catch (error: any) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // DELETE /api/todos/:id
  async deleteTodo(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const todoId = req.params.id;

      const result = await todoService.deleteTodo(todoId, userId);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/todos/stats
  async getTodoStats(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const stats = await todoService.getTodoStats(userId);

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new TodoController();