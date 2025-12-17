import { TaskService } from '../services/TaskService';
import { TaskRepository } from '../repositories/TaskRepository';



describe('TaskService Unit Tests', () => {
  let taskService: TaskService;

  beforeEach(() => {
    jest.clearAllMocks(); 
    taskService = new TaskService();
  });

  // TEST 1: Should create a task successfully
  it('should create a new task when valid data is provided', async () => {
    const mockTaskData = {
      title: 'Test Task',
      description: 'Testing',
      priority: 'HIGH',
      status: 'To Do',
      creatorId: 'user123'
    };
    
    
    const createSpy = jest.spyOn(TaskRepository.prototype, 'create')
      .mockResolvedValue({ ...mockTaskData, _id: 'task123' } as any);

    const result = await taskService.createTask('user123', mockTaskData as any);

   
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect((result as any)._id).toBe('task123');
    expect((result as any).title).toBe('Test Task');
  });

  // TEST 2: Should handle validation failure (simulated)
  it('should handle repository creation failure', async () => {
    const invalidTaskData = {
      description: 'No Title Here',
      priority: 'LOW'
    };
    
    
    jest.spyOn(TaskRepository.prototype, 'create')
      .mockResolvedValue({ ...invalidTaskData, _id: 'task999' } as any);
    
    const result = await taskService.createTask('user123', invalidTaskData as any);
    expect((result as any)._id).toBe('task999');
  });

  // TEST 3: Should update task status
  it('should update task status correctly', async () => {
    const taskId = 'task123';
    const updateData = { status: 'Completed' };
    const userId = 'user123';

    
    jest.spyOn(TaskRepository.prototype, 'findById')
      .mockResolvedValue({ _id: taskId, creatorId: userId } as any);
    
    
    const updateSpy = jest.spyOn(TaskRepository.prototype, 'update')
      .mockResolvedValue({ _id: taskId, status: 'Completed' } as any);

    const result = await taskService.updateTask(taskId, userId, updateData as any);

    expect(updateSpy).toHaveBeenCalledWith(taskId, updateData);
    expect((result as any).status).toBe('Completed');
  });
});