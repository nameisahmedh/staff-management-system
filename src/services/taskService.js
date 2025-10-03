import database from './databaseService';

export const loadTasks = () => {
  return database.getTasks();
};

export const saveTasks = (tasks) => {
  return database.saveTasks(tasks);
};

export const addTask = (task) => {
  try {
    const newTask = database.addTask(task);
    return { success: true, task: newTask };
  } catch (error) {
    console.error('Error adding task:', error);
    return { success: false, error: 'Failed to add task' };
  }
};

export const updateTask = (taskId, updates) => {
  try {
    const updatedTask = database.updateTask(taskId, updates);
    return { success: updatedTask !== null, task: updatedTask };
  } catch (error) {
    console.error('Error updating task:', error);
    return { success: false, error: 'Failed to update task' };
  }
};

export const deleteTask = (taskId) => {
  try {
    const success = database.deleteTask(taskId);
    return { success };
  } catch (error) {
    console.error('Error deleting task:', error);
    return { success: false, error: 'Failed to delete task' };
  }
};

export const getTasksForUser = (userId) => {
  return database.getTasksForUser(userId);
};

export const getAllTasks = () => {
  return database.getTasks();
};

export const updateTaskAssignment = (oldUserId, newUserId) => {
  try {
    const tasks = loadTasks();
    const updatedTasks = tasks.map(task => {
      if (task.assignedTo === oldUserId) {
        return { ...task, assignedTo: newUserId, updatedAt: new Date().toISOString() };
      }
      return task;
    });
    saveTasks(updatedTasks);
    return { success: true };
  } catch (error) {
    console.error('Error updating task assignment:', error);
    return { success: false, error: 'Failed to update task assignment' };
  }
};

