import api from './api';


export interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  creatorId: string;
  assignedToId?: string;
  createdAt: string;     
  updatedAt?: string;
}


export type CreateTaskPayload = Omit<Task, '_id' | 'createdAt' | 'creatorId' | 'updatedAt' | 'assignedToId'>;

export const getAllTasks = async () => {
  const response = await api.get<Task[]>('/tasks');
  return response.data;
};

// Update this function to accept the Payload type, not the full Task
export const createTask = async (task: CreateTaskPayload) => {
  const response = await api.post<Task>('/tasks', task);
  return response.data;
};

export const updateTask = async (id: string, task: Partial<Task>) => {
  const response = await api.put<Task>(`/tasks/${id}`, task);
  return response.data;
};

export const deleteTask = async (id: string) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};