import React, { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useModal } from '../../contexts/ModalContext';
import { STATUSES, PRIORITIES, getTaskStatusWithOverdue, getStatusBadgeColor, getPriorityBadgeColor } from '../../utils/constants';
import { enhanceTaskDescription, generateEmailNotification } from '../../services/geminiService';
import { generateEnhancedEmailContent, sendTaskEmail } from '../../services/emailService';
import TaskList from './TaskList';
import TaskStats from './TaskStats';

const AdminTasksView = ({ showFormOnly = false }) => {
  const { tasks, addTask, getTaskStats, refreshTasks } = useTasks();
  const { users } = useAuth();
  const { showToast } = useToast();
  const { openModal } = useModal();

  const [formData, setFormData] = useState({
    text: '',
    dueDate: '',
    dueTime: '',
    priority: 'Medium',
    assignedTo: ''
  });
  const [filter, setFilter] = useState('all');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.text.trim() || !formData.dueDate) {
      showToast('Please fill out task description and due date.', 'error');
      return;
    }

    // Convert assignedTo to number if it's provided
    const taskData = {
      ...formData,
      assignedTo: formData.assignedTo ? parseInt(formData.assignedTo) : null
    };

    const result = await addTask(taskData);
    
    if (result.success) {
      const newTask = result.task;
      
      // Refresh tasks to ensure UI is updated
      await refreshTasks();
      
      setFormData({
        text: '',
        dueDate: '',
        dueTime: '',
        priority: 'Medium',
        assignedTo: ''
      });
      
      if (newTask.assignedTo) {
        await generateEmailForTask(newTask);
      } else {
        showToast('Unassigned task created.');
      }
    } else {
      showToast(result.error || 'Failed to create task', 'error');
    }
  };

  const generateEmailForTask = async (task) => {
    const staffUser = users.find(u => u.id === task.assignedTo);
    if (!staffUser) return;

    openModal("📧 Generating Email...", '<div class="text-center p-8">AI is drafting the notification...</div>');

    try {
      const adminUser = users.find(u => u.role === 'admin');
      
      let emailContent;
      try {
        const emailText = await generateEmailNotification(task, staffUser, adminUser?.username || 'Admin');
        const lines = emailText.split('\n');
        const subjectLine = lines.find(line => line.toLowerCase().includes('subject:')) || lines[0];
        const bodyLines = lines.filter(line => !line.toLowerCase().includes('subject:'));
        emailContent = {
          subject: subjectLine.replace(/subject:\s*/i, '').trim(),
          body: bodyLines.join('\n').trim()
        };
      } catch (geminiError) {
        console.log('Gemini API failed, using enhanced template');
        emailContent = await generateEnhancedEmailContent(task, staffUser, adminUser);
      }

      window.sendEmailHandler = () => {
        const subject = document.getElementById('emailSubject')?.value || emailContent.subject;
        const body = document.getElementById('emailBody')?.value || emailContent.body;
        sendTaskEmail(staffUser.email, subject, body);
        showToast(`📧 Email opened for ${staffUser.username} - Check Gmail to send!`, 'success');
        document.querySelector('[data-modal-close]')?.click();
      };
      
      openModal(
        "📧 Task Assignment & Email Notification",
        `<div class="space-y-4">
          <div class="bg-green-50 p-4 rounded border">
            <p class="text-green-700">
              <strong>✅ Task assigned to ${staffUser.username}</strong>
            </p>
          </div>
          
          <div class="bg-blue-50 p-4 rounded border">
            <div class="flex justify-between items-center mb-2">
              <h4 class="font-semibold">Email Details</h4>
            </div>
            <p><strong>To:</strong> ${staffUser.email}</p>
            <p><strong>Subject:</strong> <input id="emailSubject" type="text" value="${emailContent.subject}" class="border rounded px-2 py-1 w-full mt-1" /></p>
          </div>
          
          <div class="bg-gray-50 p-4 rounded border">
            <div class="flex justify-between items-center mb-2">
              <h4 class="font-semibold">Email Content</h4>
            </div>
            <textarea id="emailBody" class="text-sm bg-white p-3 rounded border w-full h-40 resize-none">${emailContent.body}</textarea>
          </div>
        </div>`,
        `<div class="flex gap-3">
          <button onclick="window.sendEmailHandler()" class="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
            📧 Send Email
          </button>
        </div>`
      );
      
      showToast("Task created and email ready to send!");
    } catch (error) {
      console.error('Email generation error:', error);
      openModal(
        "Email Generation Error",
        `<p class="text-red-500">Sorry, there was an issue generating the email. The task has been created successfully.</p>
        <p class="text-gray-600 dark:text-gray-400 mt-2">You can manually notify ${staffUser.username} about this task.</p>`
      );
    }
  };



  const handleEnhanceDescription = async () => {
    const briefDescription = formData.text.trim();
    if (!briefDescription) {
      showToast("Please enter a brief task description first.", 'warning');
      return;
    }

    openModal("✨ Enhancing Task...", '<div className="text-center p-8">AI is working its magic...</div>');

    try {
      const enhancedText = await enhanceTaskDescription(briefDescription);
      setFormData(prev => ({
        ...prev,
        text: enhancedText.trim()
      }));
      openModal("Enhanced Task Description", `<div className="p-4"><p>The task description has been enhanced!</p></div>`);
      showToast("Task description enhanced!");
    } catch (error) {
      openModal(
        "Enhancement Failed",
        '<p className="text-red-500">Sorry, the AI assistant failed. Please try again.</p>'
      );
    }
  };

  const { staffUsers, stats, filteredTasks } = React.useMemo(() => {
    const allStats = getTaskStats();
    let filtered = tasks;
    
    if (filter === 'pending') filtered = tasks.filter(t => t.status === 'Pending');
    else if (filter === 'inProgress') filtered = tasks.filter(t => t.status === 'In Progress');
    else if (filter === 'completed') filtered = tasks.filter(t => t.status === 'Completed');
    else if (filter === 'overdue') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = tasks.filter(t => t.status !== 'Completed' && new Date(t.dueDate) < today);
    }
    
    return {
      staffUsers: users.filter(u => u.role === 'staff'),
      stats: allStats,
      filteredTasks: filtered
    };
  }, [users, tasks, filter]);

  if (showFormOnly) {
    return (
      <div className="container-responsive">
        <div className="card">
          <h2 className="text-responsive-xl font-semibold mb-4 sm:mb-6 text-gray-800 dark:text-gray-200">Allocate New Task</h2>
          <form onSubmit={handleSubmit} className="space-responsive">
            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="task-text" className="block text-responsive-sm font-medium">
                  Task Description
                </label>
                <button
                  type="button"
                  onClick={handleEnhanceDescription}
                  className="text-xs text-indigo-600 hover:underline font-semibold"
                >
                  ✨ Enhance with AI
                </button>
              </div>
              <textarea
                id="task-text"
                name="text"
                required
                placeholder="A brief task idea..."
                value={formData.text}
                onChange={handleInputChange}
                className="input-field mt-1 sm:mt-2"
                rows="3"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label htmlFor="task-due-date" className="block text-responsive-sm font-medium">
                  Due Date
                </label>
                <input
                  type="date"
                  id="task-due-date"
                  name="dueDate"
                  required
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="input-field mt-1 sm:mt-2"
                />
              </div>
              
              <div>
                <label htmlFor="task-due-time" className="block text-responsive-sm font-medium">
                  Due Time
                </label>
                <input
                  type="time"
                  id="task-due-time"
                  name="dueTime"
                  value={formData.dueTime}
                  onChange={handleInputChange}
                  className="input-field mt-1 sm:mt-2"
                />
              </div>
              
              <div>
                <label htmlFor="task-priority" className="block text-responsive-sm font-medium">
                  Priority
                </label>
                <select
                  id="task-priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="input-field mt-1 sm:mt-2"
                >
                  {PRIORITIES.map(priority => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="assign-staff" className="block text-responsive-sm font-medium">
                Assign To
              </label>
              <select
                id="assign-staff"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleInputChange}
                className="input-field mt-1 sm:mt-2"
              >
                <option value="" disabled>Select staff...</option>
                {staffUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              type="submit"
              className="btn-primary w-full py-2 sm:py-3 text-responsive-base font-medium"
            >
              Add Task
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container-responsive">
      <TaskStats stats={stats} onFilterChange={setFilter} activeFilter={filter} />
      
      <div className="admin-grid">
        <div className="form-container hidden lg:block">
          <div className="card">
            <h2 className="text-responsive-xl font-semibold mb-4 sm:mb-6 text-gray-800 dark:text-gray-200">Allocate New Task</h2>
            
            <form onSubmit={handleSubmit} className="space-responsive">
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                  <label htmlFor="task-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Task Description
                  </label>
                  <button
                    type="button"
                    onClick={handleEnhanceDescription}
                    className="text-xs text-indigo-600 hover:underline font-semibold self-start sm:self-auto"
                  >
                    ✨ Enhance with AI
                  </button>
                </div>
                <textarea
                  id="task-text"
                  name="text"
                  required
                  placeholder="A brief task idea..."
                  value={formData.text}
                  onChange={handleInputChange}
                  className="input-field mt-1 sm:mt-2"
                  rows="3"
                />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
                <div>
                  <label htmlFor="task-due-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    id="task-due-date"
                    name="dueDate"
                    required
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="input-field w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="task-due-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Due Time
                  </label>
                  <input
                    type="time"
                    id="task-due-time"
                    name="dueTime"
                    value={formData.dueTime}
                    onChange={handleInputChange}
                    className="input-field w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="task-priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    id="task-priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="input-field w-full"
                  >
                    {PRIORITIES.map(priority => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="assign-staff" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assign To
                </label>
                <select
                  id="assign-staff"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleInputChange}
                  className="input-field w-full"
                >
                  <option value="" disabled>Select staff...</option>
                  {staffUsers.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                type="submit"
                className="btn-primary w-full py-2 lg:py-3 text-sm lg:text-base font-medium"
              >
                Add Task
              </button>
            </form>
          </div>
        </div>
        
        <div className="task-list-container lg:col-span-1 col-span-full">
          <TaskList isAdminView={true} filteredTasks={filteredTasks} />
        </div>
      </div>
    </div>
  );
};

export default AdminTasksView;
