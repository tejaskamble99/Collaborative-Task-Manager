import Task from "../models/Task";
import { CreateTaskDto, UpdateTaskDto } from "../dtos/TaskDto";

// Fixed spelling: TaskRepository (not Respository)
export class TaskRepository {
  async create(taskData: CreateTaskDto & { creatorId: string }) {
    return await Task.create(taskData as any);
  }

  async findAll(filter: any = {}, sort: any = {}) {
    return await Task.find(filter)
      .sort(sort)
      .populate("assignedToId", "name email")
      .populate("creatorId", "name");
  }

  // Fixed name: findById (matches what TaskService calls)
  async findById(id: string) {
    return await Task.findById(id);
  }

  async update(id: string, updateData: UpdateTaskDto) {
    return await Task.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id: string) {
    return await Task.findByIdAndDelete(id);
  }
}