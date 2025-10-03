import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useTasks } from '../../hooks/useTasks';
import { sendBulkTaskEmails, sendTaskNotificationEmail } from '../../services/emailService';

const BulkEmailSender = () => {
  const { users } = useAuth();
  const { tasks } = useTasks();
  const { showToast } = useToast();
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [sending, setSending] = useState(false);

  const staffUsers = users.filter(u => u.role === 'staff');
  const adminUser = users.find(u => u.role === 'admin');
  
  // Get tasks assigned to staff that haven't been completed
  const assignedTasks = tasks.filter(task => 
    task.assignedTo && task.status !== 'Completed'
  );

  const handleTaskSelection = (taskId) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === assignedTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(assignedTasks.map(task => task.id));
    }
  };

  const sendBulkEmails = async () => {
    if (selectedTasks.length === 0) {
      showToast('Please select at least one task', 'warning');
      return;
    }

    setSending(true);
    
    try {
      // Prepare email data for selected tasks
      const emailsData = selectedTasks.map(taskId => {
        const task = tasks.find(t => t.id === taskId);
        const staffUser = staffUsers.find(u => u.id === task.assignedTo);
        
        return {
          taskData: task,
          staffUser: staffUser,
          adminUser: adminUser
        };
      }).filter(data => data.staffUser); // Only include tasks with valid staff users

      // Send bulk emails
      const result = await sendBulkTaskEmails(emailsData);
      
      if (result.success) {
        const successCount = result.results.filter(r => r.success).length;
        const failCount = result.results.filter(r => !r.success).length;
        
        if (failCount === 0) {
          showToast(`✅ Successfully sent ${successCount} emails!`, 'success');
        } else {
          showToast(`📧 Sent ${successCount} emails, ${failCount} failed`, 'warning');
        }
        
        // Clear selection after sending
        setSelectedTasks([]);
      } else {
        showToast('Failed to send bulk emails', 'error');
      }
    } catch (error) {
      console.error('Bulk email error:', error);
      showToast('Error sending bulk emails', 'error');
    } finally {
      setSending(false);
    }
  };

  const sendSingleEmail = async (task) => {
    const staffUser = staffUsers.find(u => u.id === task.assignedTo);
    if (!staffUser) return;

    try {
      const result = await sendTaskNotificationEmail(task, staffUser, adminUser);
      if (result.success) {
        showToast(`✅ Email sent to ${staffUser.username}`, 'success');
      } else {
        showToast(`Failed to send email to ${staffUser.username}`, 'error');
      }
    } catch (error) {
      showToast('Error sending email', 'error');
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          📧 Email Notifications
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleSelectAll}
            className="text-sm text-blue-600 hover:underline"
          >
            {selectedTasks.length === assignedTasks.length ? 'Deselect All' : 'Select All'}
          </button>
          <button
            onClick={sendBulkEmails}
            disabled={selectedTasks.length === 0 || sending}
            className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
          >
            {sending ? 'Sending...' : `Send ${selectedTasks.length} Emails`}
          </button>
        </div>
      </div>

      {assignedTasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No assigned tasks available for email notifications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assignedTasks.map(task => {
            const staffUser = staffUsers.find(u => u.id === task.assignedTo);
            const isSelected = selectedTasks.includes(task.id);
            
            return (
              <div
                key={task.id}
                className={`p-4 border rounded-lg transition-colors ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleTaskSelection(task.id)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {task.text}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Assigned to: {staffUser?.username} ({staffUser?.email})
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 text-xs rounded ${
                          task.priority === 'High' ? 'bg-red-100 text-red-800' :
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-gray-500">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => sendSingleEmail(task)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Send Individual
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BulkEmailSender;