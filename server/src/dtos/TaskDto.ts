import {z} from "zod";
import { TaskPriority, TaskSatus } from "../models/Task";


const ObjectId = z.string().length(24,"Id must be 24 characters Hexadecimal String");

export const CreateTaskSchema =z.object({
    title:z.string().min(1,"Title is required").max(100,"Title is to long"),
    descreption :z.string().min(1,"Descreption is required"),
    dueDate : z.string().datetime("Invalid Date/time format"),

    assignedToId: ObjectId.optional(),

    priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
    status: z.nativeEnum(TaskSatus).default(TaskSatus.TODO),
});
export type CreateTaskDto = z.infer<typeof CreateTaskSchema>;