'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import { logoutUser } from '@/services/authService';
import { getAllTasks, Task } from '@/services/taskService';
import Button from '@/components/Button';
import TaskCard from '@/components/TaskCard';
import NewTaskModal from '@/components/NewTaskModal';

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔍 Filter & Sort States
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');

  // Check Auth
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, [router]);

  // Fetch Tasks (React Query)
  const { data: tasks = [], isLoading, isError } = useQuery({
    queryKey: ['tasks'],
    queryFn: getAllTasks,
    staleTime: 1000 * 60 * 5,
  });

  // ⚡ Socket.io Real-time Updates
  useEffect( () => {
    // 👇 Use the same variable
    const socketUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const socket = io(socketUrl); 

    socket.on('taskCreated', (newTask: Task) => {
      queryClient.setQueryData(['tasks'], (oldTasks: Task[] | undefined) => {
        if (!oldTasks) return [newTask];
        if (oldTasks.find(t => t._id === newTask._id)) return oldTasks;
        return [newTask, ...oldTasks];
      });
    });
    return () => { socket.disconnect(); }; // Fix: remove implicit return issue
  }, [queryClient]);

  // 🧠 Smart Filtering & Sorting Logic
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // 1. Filter by Status
    if (statusFilter !== 'ALL') {
      result = result.filter(t => t.status === statusFilter);
    }

    // 2. Filter by Priority
    if (priorityFilter !== 'ALL') {
      result = result.filter(t => t.priority === priorityFilter);
    }

    // 3. Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'dueDate') {
         // Handle missing due dates (put them last)
         if (!a.dueDate) return 1;
         if (!b.dueDate) return -1;
         return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });

    return result;
  }, [tasks, statusFilter, priorityFilter, sortBy]);

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
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Your Tasks</h2>
          
          <div className="flex flex-wrap gap-2">
            {/* Filter Status */}
            <select 
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            {/* Filter Priority */}
            <select 
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="ALL">All Priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>

            {/* Sort */}
            <select 
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="dueDate">Due Date (Soonest)</option>
            </select>

            <Button onClick={() => setIsModalOpen(true)}>+ New Task</Button>
          </div>
        </div>

        {/* Task List */}
        {isLoading ? (
          <div className="space-y-4">
             {[1, 2, 3].map((i) => (
               <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
             ))}
          </div>
        ) : isError ? (
          <p className="text-red-500">Error loading tasks.</p>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500">No tasks found matching your filters.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        )}
      </main>

      <NewTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onTaskCreated={() => queryClient.invalidateQueries({ queryKey: ['tasks'] })} 
      />
    </div>
  );
}