import React from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../contexts/AuthContext';
import TaskStats from '../admin/TaskStats';
import TaskList from '../admin/TaskList';

const StaffTasksView = () => {
  const { loggedInUser } = useAuth();
  const { tasks } = useTasks();
  const [filter, setFilter] = React.useState('all');

  const { userTasks, userStats, filteredUserTasks } = React.useMemo(() => {
    const userFiltered = tasks.filter(task => task.assignedTo === loggedInUser?.id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let displayTasks = userFiltered;
    if (filter === 'pending') displayTasks = userFiltered.filter(t => t.status === 'Pending');
    else if (filter === 'inProgress') displayTasks = userFiltered.filter(t => t.status === 'In Progress');
    else if (filter === 'completed') displayTasks = userFiltered.filter(t => t.status === 'Completed');
    else if (filter === 'overdue') displayTasks = userFiltered.filter(t => t.status !== 'Completed' && new Date(t.dueDate) < today);
    
    return {
      userTasks: userFiltered,
      filteredUserTasks: displayTasks,
      userStats: {
        total: userFiltered.length,
        completed: userFiltered.filter(t => t.status === 'Completed').length,
        inProgress: userFiltered.filter(t => t.status === 'In Progress').length,
        pending: userFiltered.filter(t => t.status === 'Pending').length,
        overdue: userFiltered.filter(t => t.status !== 'Completed' && new Date(t.dueDate) < today).length
      }
    };
  }, [tasks, loggedInUser?.id, filter]);

  return (
    <div>
      <TaskStats stats={userStats} onFilterChange={setFilter} activeFilter={filter} />
      
      <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
        <h2 className="text-responsive-xl font-semibold mb-4 text-black dark:text-white">My Task List</h2>
        <TaskList isAdminView={false} filteredTasks={filteredUserTasks} />
      </div>
    </div>
  );
};

export default StaffTasksView;

