import React, { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useModal } from '../../contexts/ModalContext';
import { STATUSES, getTaskStatusWithOverdue, getStatusBadgeColor, getPriorityBadgeColor } from '../../utils/constants';


const RemarkForm = ({ task, onRemarkSubmit }) => {
  const [remark, setRemark] = useState(task.moodRemark || '');
  const [selectedMood, setSelectedMood] = useState(task.mood || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!remark.trim() || !selectedMood) {
      return;
    }
    
    setIsSubmitting(true);
    await onRemarkSubmit(task.id, remark.trim(), selectedMood);
    setIsSubmitting(false);
    
    // Reset form after successful submission
    setRemark('');
    setSelectedMood('');
  };

  const getMoodLabel = (mood) => {
    const moodLabels = {
      '😊': 'Happy', '😐': 'Neutral', '😤': 'Frustrated', '🤔': 'Thinking', '💪': 'Motivated'
    };
    return moodLabels[mood] || '';
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1.5 sm:gap-2">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-slate-600 dark:text-slate-400">Add Remark:</span>
        <textarea
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder="How do you feel about this task?"
          className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full bg-white dark:bg-gray-700 text-black dark:text-white resize-none"
          rows={2}
          maxLength={200}
          required
        />
      </div>
      
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-xs text-slate-600 dark:text-slate-400 mr-1">Mood:</span>
        {['😊', '😐', '😤', '🤔', '💪'].map(mood => (
          <button
            key={mood}
            type="button"
            onClick={() => setSelectedMood(mood)}
            className={`text-base sm:text-lg hover:scale-110 transition-transform ${
              selectedMood === mood ? 'bg-blue-100 dark:bg-blue-900 rounded-full p-1' : 'p-1'
            }`}
            title={getMoodLabel(mood)}
          >
            {mood}
          </button>
        ))}
      </div>
      
      <button
        type="submit"
        disabled={!remark.trim() || !selectedMood || isSubmitting}
        className="bg-blue-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded text-xs font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed self-start"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
};

const TaskList = ({ isAdminView = false, filteredTasks = null }) => {
  const { tasks, deleteTask, updateTask } = useTasks();
  const { users } = useAuth();
  const { showToast } = useToast();
  const { openModal } = useModal();

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const result = deleteTask(taskId);
      showToast(result.success ? 'Task deleted' : 'Delete failed', result.success ? 'success' : 'error');
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    const result = await updateTask(taskId, { status: newStatus });
    showToast(result.success ? 'Status updated' : 'Update failed', result.success ? 'success' : 'error');
  };

  const handleMoodUpdate = async (taskId, mood) => {
    const result = await updateTask(taskId, { mood, moodUpdatedAt: new Date().toISOString() });
    showToast(result.success ? `Mood updated to ${getMoodLabel(mood)}` : 'Mood update failed', result.success ? 'success' : 'error');
  };

  const handleRemarkSubmit = async (taskId, remark, mood) => {
    const result = await updateTask(taskId, { moodRemark: remark, mood, moodUpdatedAt: new Date().toISOString() });
    if (result.success) {
      showToast('Feedback submitted successfully!', 'success');
    } else {
      showToast('Failed to submit feedback', 'error');
    }
  };



  const getMoodLabel = (mood) => {
    const moodLabels = {
      '😊': 'Happy',
      '😐': 'Neutral', 
      '😤': 'Frustrated',
      '🤔': 'Thinking',
      '💪': 'Motivated'
    };
    return moodLabels[mood] || 'Unknown';
  };

  const tasksToShow = filteredTasks || tasks;
  const sortedTasks = [...tasksToShow].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  if (!sortedTasks.length) {
    return (
      <div className={`${isAdminView ? 'bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-600' : ''}`}>
        {isAdminView && <h2 className="text-responsive-xl font-semibold mb-4 text-black dark:text-white">Task Overview</h2>}
        <p className="text-center text-slate-500 dark:text-slate-400 py-4 text-responsive-base">No tasks to display.</p>
      </div>
    );
  }

  return (
    <div className={`${isAdminView ? 'bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-600' : ''}`}>
      {isAdminView && <h2 className="text-responsive-xl font-semibold mb-4 sm:mb-6 text-black dark:text-white">Task Overview</h2>}
      
      <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto scrollbar-hide">
        {sortedTasks.map(task => {
          const finalStatus = getTaskStatusWithOverdue(task);
          // Handle both string and number types for assignedTo
          const assignedUser = users.find(u => u.id === task.assignedTo || u.id === parseInt(task.assignedTo));
          const assignedToText = assignedUser ? assignedUser.username : 'Unassigned';

          return (
            <div
              key={task.id}
              className="bg-white dark:bg-gray-800 p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-md sm:rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
            >
              <div className="flex flex-col sm:flex-row lg:flex-row gap-3 sm:gap-4">
                <div className="flex-grow min-w-0">
                  <p className="font-medium text-responsive-base text-black dark:text-white break-words leading-tight">{task.text}</p>
                  <p className="text-responsive-sm text-slate-500 dark:text-slate-400 mt-1 sm:mt-2">
                    Due: <strong>{new Date(task.dueDate).toLocaleDateString()}</strong>
                    {task.dueTime && <span> at <strong>{task.dueTime}</strong></span>}
                    {isAdminView && (
                      <>
                        <span className="hidden sm:inline"> | Assigned to: <strong>{assignedToText}</strong></span>
                        <span className="block sm:hidden text-xs mt-1">Assigned: <strong>{assignedToText}</strong></span>
                      </>
                    )}
                  </p>
                </div>
              
                <div className="flex flex-col gap-2 sm:gap-3 sm:items-end flex-shrink-0">
                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                    <span className={`text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full ${getPriorityBadgeColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    
                    <span className={`text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full ${getStatusBadgeColor(finalStatus)}`}>
                      {finalStatus}
                    </span>
                  </div>
                  
                  {!isAdminView ? (
                    <div className="flex flex-col gap-2 sm:min-w-[280px] lg:min-w-[300px]">
                      <div className="flex gap-1 sm:gap-2 flex-wrap">
                        <button
                          onClick={() => handleStatusUpdate(task.id, 'In Progress')}
                          className="bg-black dark:bg-gray-700 text-white px-2 py-1 sm:px-4 sm:py-2 rounded text-xs sm:text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                        >
                          <span className="hidden sm:inline">Start Task</span>
                          <span className="sm:hidden">Start</span>
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(task.id, 'Completed')}
                          className="bg-black dark:bg-gray-700 text-white px-2 py-1 sm:px-4 sm:py-2 rounded text-xs sm:text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-600 flex items-center gap-1 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                        >
                          ✓ <span className="hidden sm:inline">Mark Complete</span>
                          <span className="sm:hidden">Complete</span>
                        </button>
                      </div>
                      
                      <div className="flex flex-col gap-2 min-h-[50px] sm:min-h-[60px]">
                        {task.status !== 'Completed' && (
                          <RemarkForm task={task} onRemarkSubmit={handleRemarkSubmit} />
                        )}
                        
                        {task.mood && task.moodRemark && (
                          <div className="bg-blue-50 dark:bg-blue-900/30 border dark:border-blue-700 p-2 rounded text-xs">
                            <span className="text-blue-700 dark:text-blue-200">
                              <strong>Your feedback:</strong> "{task.moodRemark}" - {task.mood} {getMoodLabel(task.mood)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="bg-black dark:bg-gray-700 text-white px-2 py-1 sm:px-3 sm:py-2 rounded text-xs sm:text-sm font-medium hover:bg-red-600 dark:hover:bg-red-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg self-start sm:self-end"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskList;
