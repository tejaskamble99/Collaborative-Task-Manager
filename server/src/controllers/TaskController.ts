import { Request, Response } from 'express';
import { TaskService } from '../services/TaskService';
import { CreateTaskSchema, UpdateTaskSchema } from '../dtos/TaskDto';
import {io} from '../app';

interface AuthRequest extends Request {
  user?: { _id: string };
}

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  create = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      const validatedData = CreateTaskSchema.parse(req.body);
      const task = await this.taskService.createTask(req.user._id, validatedData);
      io.emit('taskCreated', task); // Notify everyone that a new task exists
      res.status(201).json(task);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const tasks = await this.taskService.getAllTasks({});
      res.status(200).json(tasks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  update = async (req: AuthRequest, res: Response) => {
    try {
      const validatedData = UpdateTaskSchema.parse(req.body);
      const updatedTask = await this.taskService.updateTask(req.params.id, req.user?._id || '', validatedData);
      io.emit('taskUpdated', updatedTask);// Notify everyone that this task changed
      res.status(200).json(updatedTask);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.taskService.deleteTask(req.params.id);
      res.status(200).json({ message: 'Task deleted' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}