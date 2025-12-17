'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/services/authService';
import { getAllTasks, Task } from '@/services/taskService';
import Button from '@/components/Button';
import TaskCard from '@/components/TaskCard';
import NewTaskModal from '@/components/NewTaskModal'; // <--- Import Modal

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // <--- New State

  // Reuse this function to fetch tasks (we call it on load AND after creating a task)
  const fetchTasks = async () => {
    try {
      const data = await getAllTasks();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchTasks();
  }, [router]);

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">Task Manager</h1>
            <Button onClick={handleLogout} variant="secondary" className="text-sm">
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Tasks</h2>
          {/* 👇 Open Modal on Click */}
          <Button onClick={() => setIsModalOpen(true)}>+ New Task</Button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500">No tasks found. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        )}
      </main>

      {/* 👇 Render the Modal */}
      <NewTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onTaskCreated={fetchTasks} // Refresh list after create
      />
    </div>
  );
}