// Simple localStorage-based database service
const DB_PREFIX = 'sms_db_';

class DatabaseService {
  constructor() {
    this.initializeDatabase();
  }

  initializeDatabase() {
    if (!this.get('users')) {
      this.set('users', [
        { 
          id: 1, 
          email: 'mdqamarahmed123@gmail.com', 
          phone: '8688941893',
          password: '123456', 
          role: 'admin', 
          username: 'Md Ahmed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]);
    }

    if (!this.get('tasks')) {
      this.set('tasks', []);
    }
  }

  get(key) {
    try {
      const data = localStorage.getItem(DB_PREFIX + key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      return null;
    }
  }

  set(key, value) {
    try {
      localStorage.setItem(DB_PREFIX + key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  getUsers() {
    return this.get('users') || [];
  }

  saveUsers(users) {
    return this.set('users', users);
  }

  addUser(user) {
    const users = this.getUsers();
    const newUser = {
      ...user,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  updateUser(userId, updates) {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveUsers(users);
      return users[userIndex];
    }
    return null;
  }

  deleteUser(userId) {
    const users = this.getUsers();
    const filteredUsers = users.filter(u => u.id !== userId);
    this.saveUsers(filteredUsers);
    return true;
  }

  getTasks() {
    return this.get('tasks') || [];
  }

  saveTasks(tasks) {
    return this.set('tasks', tasks);
  }

  addTask(task) {
    const tasks = this.getTasks();
    const newTask = {
      ...task,
      id: Date.now(),
      status: task.status || 'Pending',
      priority: task.priority || 'Medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    tasks.push(newTask);
    this.saveTasks(tasks);
    return newTask;
  }

  updateTask(taskId, updates) {
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex(t => t.id == taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex] = { ...tasks[taskIndex], ...updates, updatedAt: new Date().toISOString() };
      this.saveTasks(tasks);
      return tasks[taskIndex];
    }
    return null;
  }

  deleteTask(taskId) {
    const tasks = this.getTasks();
    const filteredTasks = tasks.filter(t => t.id != taskId);
    this.saveTasks(filteredTasks);
    return true;
  }

  getTasksForUser(userId) {
    const tasks = this.getTasks();
    return tasks.filter(task => task.assignedTo === userId);
  }
}

const database = new DatabaseService();
export default database;