import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Task, updateTask, deleteTask } from '@/services/taskService';

interface TaskCardProps {
  task: Task;
}

const STATUS_OPTIONS = ['To Do', 'In Progress', 'Review', 'Completed'];

export default function TaskCard({ task }: TaskCardProps) {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'HIGH':   return 'bg-red-100 text-red-800';
      case 'URGENT': return 'bg-purple-100 text-purple-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      default:       return 'bg-green-100 text-green-800';
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await updateTask(task._id, { status: newStatus });
      // Optimistically update local cache — socket will sync other clients
      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) =>
        old?.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t)) ?? []
      );
      toast.success('Status updated');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${task.title}"?`)) return;
    setIsDeleting(true);
    try {
      await deleteTask(task._id);
      // Optimistically remove from cache — socket will sync other clients
      queryClient.setQueryData(['tasks'], (old: Task[] | undefined) =>
        old?.filter((t) => t._id !== task._id) ?? []
      );
      toast.success('Task deleted');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete task');
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4">
      {/* Title row */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 truncate">{task.title}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}
          >
            {task.priority}
          </span>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete task"
            className="ml-1 p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer row */}
      <div className="mt-4 flex items-center justify-between gap-2">
        {/* Status dropdown */}
        <select
          value={task.status}
          disabled={isUpdating}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="text-xs border border-gray-200 rounded px-2 py-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 cursor-pointer"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {task.dueDate && (
          <span className="text-xs text-gray-400">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}