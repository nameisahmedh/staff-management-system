export const STATUSES = ['Pending', 'In Progress', 'Completed'];
export const PRIORITIES = ['Low', 'Medium', 'High'];

export const getTaskStatusWithOverdue = (task) => {
  if (task.status === 'Completed') return 'Completed';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (new Date(task.dueDate) < today) return 'Overdue';
  return task.status;
};

export const getStatusBadgeColor = (status) => {
  const colors = {
    'Completed': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    'Pending': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'Overdue': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getPriorityBadgeColor = (priority) => {
  const colors = {
    'High': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    'Medium': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    'Low': 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300'
  };
  return colors[priority] || 'bg-gray-100 text-gray-800';
};
