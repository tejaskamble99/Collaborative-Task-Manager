import { z } from 'zod';
import { TaskPriority, TaskStatus } from '../models/Task'; // <--- FIXED TYPO (was TaskSatus)

const ObjectId = z.string().length(24, "Id must be 24 characters Hexadecimal String");

export const CreateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().datetime("Invalid Date/time format"),
  
  assignedToId: ObjectId.optional(),

  priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO), // <--- FIXED TYPO
});
export type CreateTaskDto = z.infer<typeof CreateTaskSchema>;

export const UpdateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  dueDate: z.string().datetime("Invalid Date/time format for dueDate").optional(),
  assignedToId: ObjectId.optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  status: z.nativeEnum(TaskStatus).optional(), // <--- FIXED TYPO
});
export type UpdateTaskDto = z.infer<typeof UpdateTaskSchema>;