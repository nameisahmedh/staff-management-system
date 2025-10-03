import { useState, useEffect } from 'react';
import * as taskService from '../services/taskService';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = () => {
    setLoading(true);
    const allTasks = taskService.getAllTasks();
    setTasks(allTasks);
    setLoading(false);
  };

  const addTask = async (taskData) => {
    const result = taskService.addTask(taskData);
    if (result.success) {
      setTasks(prev => [...prev, result.task]);
    }
    return result;
  };

  const updateTask = async (taskId, updates) => {
    const result = taskService.updateTask(taskId, updates);
    if (result.success) {
      setTasks(prev => prev.map(task => 
        task.id == taskId ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
      ));
    }
    return result;
  };

  const deleteTask = (taskId) => {
    const result = taskService.deleteTask(taskId);
    if (result.success) {
      setTasks(prev => {
        console.log('Deleting task ID:', taskId, 'Type:', typeof taskId);
        console.log('Current tasks:', prev.map(t => ({ id: t.id, type: typeof t.id })));
        const newTasks = prev.filter(task => String(task.id) !== String(taskId));
        console.log('Tasks after delete:', newTasks.length);
        return newTasks;
      });
    }
    return result;
  };

  const getTasksForUser = (userId) => {
    return tasks.filter(task => task.assignedTo === userId);
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const getOverdueTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tasks.filter(task => {
      if (task.status === 'Completed') return false;
      return new Date(task.dueDate) < today;
    });
  };

  const getTaskStats = () => {
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const pending = tasks.filter(t => t.status === 'Pending').length;
    const overdue = getOverdueTasks().length;

    return {
      total: tasks.length,
      completed,
      inProgress,
      pending,
      overdue
    };
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    getTasksForUser,
    getTasksByStatus,
    getOverdueTasks,
    getTaskStats,
    refreshTasks: loadTasks
  };
};

