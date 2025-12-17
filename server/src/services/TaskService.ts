import { TaskRepository } from "../repositories/TaskRepository";
import { CreateTaskDto, UpdateTaskDto } from "../dtos/TaskDto";


export class TaskService {
    private taskRepo : TaskRepository;

    constructor(){
        this.taskRepo =new TaskRepository();
    }

    async createTask(userId : string , data : CreateTaskDto){
        const assignedToId = data.assignedToId  || userId;
        return await this.taskRepo.create({
            ...data,
            creatorId : userId,
            assignedToId
        });

    }
    async getAllTasks(filters: any) {
    return await this.taskRepo.findAll(filters);
  }

    async updateTask(taskId: string, userId: string, data: UpdateTaskDto){
        return await this.taskRepo.update(taskId, data)
    }

    async deleteTask(taskId: string){
        return await this.taskRepo.delete(taskId);
    }
}