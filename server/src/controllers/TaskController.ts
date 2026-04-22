import { Request, Response } from 'express';
import { TaskService } from '../services/TaskService';
import { CreateTaskSchema, UpdateTaskSchema } from '../dtos/TaskDto';
import { io } from '../app';

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

      io.emit('taskCreated', task);
      return res.status(201).json(task);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const tasks = await this.taskService.getAllTasks({});
      return res.status(200).json(tasks);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  };

  update = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

      const taskId = String(req.params.id);
      const validatedData = UpdateTaskSchema.parse(req.body);
      const updatedTask = await this.taskService.updateTask(
        taskId,
        req.user._id,
        validatedData
      );

      io.emit('taskUpdated', updatedTask);
      return res.status(200).json(updatedTask);
    } catch (error: any) {
      const status = error.message.includes('Not authorized') ? 403 : 400;
      return res.status(status).json({ message: error.message });
    }
  };

  delete = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

      const taskId = String(req.params.id);
      await this.taskService.deleteTask(taskId, req.user._id);

      io.emit('taskDeleted', taskId);
      return res.status(200).json({ message: 'Task deleted' });
    } catch (error: any) {
      const status = error.message.includes('Not authorized') ? 403 : 500;
      return res.status(status).json({ message: error.message });
    }
  };
}