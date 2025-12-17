import api from './api';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Review' | 'Completed';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
}

export const getAllTasks = async () => {
  const response = await api.get<Task[]>('/tasks');
  return response.data;
};

export const createTask = async (taskData: Omit<Task, '_id'>) => {
  const response = await api.post<Task>('/tasks', taskData);
  return response.data;
};

export const updateTask = async (id: string, taskData: Partial<Task>) => {
  const response = await api.put<Task>(`/tasks/${id}`, taskData);
  return response.data;
};

export const deleteTask = async (id: string) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};