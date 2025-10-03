import React, { useState, useMemo } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useModal } from '../../contexts/ModalContext';

const TaskReminders = () => {
  const { tasks } = useTasks();
  const { users } = useAuth();
  const { showToast } = useToast();
  const { openModal } = useModal();
  const [selectedDays, setSelectedDays] = useState('2');
  const [sending, setSending] = useState(false);

  const upcomingTasks = useMemo(() => {
    const now = new Date();
    const daysAhead = parseInt(selectedDays);
    const targetDate = new Date(now.getTime() + (daysAhead * 24 * 60 * 60 * 1000));
    
    return tasks.filter(task => {
      if (task.status === 'Completed') return false;
      
      const taskDueDate = new Date(task.dueDate);
      const daysDiff = Math.ceil((taskDueDate - now) / (1000 * 60 * 60 * 24));
      
      return daysDiff <= daysAhead && daysDiff >= 0;
    }).map(task => {
      const user = users.find(u => u.id === task.assignedTo);
      const dueDate = new Date(task.dueDate);
      const daysDiff = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
      
      return {
        ...task,
        user,
        daysDiff,
        dueDateTime: task.dueTime ? `${task.dueDate} ${task.dueTime}` : task.dueDate
      };
    }).sort((a, b) => a.daysDiff - b.daysDiff);
  }, [tasks, users, selectedDays]);

  const generateReminderEmail = async (task, daysDiff) => {
    const timeText = daysDiff === 0 ? 'today' : daysDiff === 1 ? 'tomorrow' : `in ${daysDiff} days`;
    const urgencyLevel = daysDiff === 0 ? 'URGENT' : daysDiff === 1 ? 'HIGH PRIORITY' : 'REMINDER';
    
    try {
      const { generateTaskReminder } = await import('../../services/geminiService');
      const aiEmail = await generateTaskReminder(task, daysDiff, timeText, urgencyLevel);
      return aiEmail;
    } catch (error) {
      console.error('AI reminder generation failed:', error);
      // Simple fallback
      return `Subject: ${urgencyLevel}: Task Due ${timeText}\n\nDear ${task.user?.username},\n\nReminder: Your task "${task.text}" is due ${timeText}.\n\nPriority: ${task.priority}\nDue Date: ${new Date(task.dueDate).toLocaleDateString()}${task.dueTime ? ` at ${task.dueTime}` : ''}\n\nPlease complete this task on time.\n\nBest regards,\nAdmin Team`;
    }
  };

  const sendReminders = async () => {
    if (upcomingTasks.length === 0) {
      showToast('No tasks found for the selected timeframe', 'warning');
      return;
    }

    const emailsData = [];
    for (const task of upcomingTasks.filter(task => task.user?.email)) {
      const emailContent = await generateReminderEmail(task, task.daysDiff);
      const [subjectLine, ...bodyParts] = emailContent.split('\n');
      emailsData.push({
        task,
        subject: subjectLine.replace('Subject: ', '').trim(),
        body: bodyParts.join('\n').trim()
      });
    }

    // Show bulk email modal
    const emailsHtml = emailsData.map((email, index) => `
      <div class="mb-4 p-4 border rounded-lg bg-gray-50">
        <div class="flex justify-between items-center mb-2">
          <h4 class="font-semibold text-blue-600">Email ${index + 1}: ${email.task.user.username}</h4>
          <button onclick="window.openSingleEmail(${index})" class="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
            📧 Open Gmail
          </button>
        </div>
        <p class="text-sm text-gray-600 mb-2"><strong>To:</strong> ${email.task.user.email}</p>
        <p class="text-sm text-gray-600 mb-2"><strong>Subject:</strong> ${email.subject}</p>
        <div class="text-xs bg-white p-2 rounded border max-h-32 overflow-y-auto">
          <pre class="whitespace-pre-wrap">${email.body.substring(0, 200)}...</pre>
        </div>
      </div>
    `).join('');

    window.emailsData = emailsData;
    window.openSingleEmail = (index) => {
      const email = emailsData[index];
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email.task.user.email)}&subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`;
      window.open(gmailUrl, `gmail_${index}`);
    };

    window.openAllEmails = () => {
      emailsData.forEach((email, index) => {
        setTimeout(() => {
          window.openSingleEmail(index);
        }, index * 1000);
      });
    };

    window.sendAllInOne = () => {
      const allEmails = emailsData.map(email => email.task.user.email).join(',');
      const combinedBody = emailsData.map((email, index) => 
        `EMAIL ${index + 1} - ${email.task.user.username}:\n${email.subject}\n\n${email.body}\n\n${'='.repeat(50)}\n\n`
      ).join('');
      
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&bcc=${encodeURIComponent(allEmails)}&subject=${encodeURIComponent('Task Reminders - Multiple Recipients')}&body=${encodeURIComponent(combinedBody)}`;
      window.open(gmailUrl, 'gmail_bulk');
    };

    openModal(
      `📧 Bulk Email Reminders (${emailsData.length} emails)`,
      `<div class="max-h-96 overflow-y-auto">${emailsHtml}</div>`,
``
    );
  };

  const previewReminders = async () => {
    if (upcomingTasks.length === 0) {
      showToast('No tasks found for the selected timeframe', 'warning');
      return;
    }

    const previewContent = [];
    for (const task of upcomingTasks) {
      const email = await generateReminderEmail(task, task.daysDiff);
      previewContent.push(`
        <div class="mb-6 p-4 border rounded-lg bg-gray-50">
          <div class="font-semibold text-blue-600 mb-2">To: ${task.user?.email || 'No email'}</div>
          <div class="text-sm text-gray-600 mb-2">Task: ${task.text}</div>
          <div class="text-sm text-gray-600 mb-2">Priority: ${task.priority} | Due in: ${task.daysDiff} day(s) | ID: ${task.id}</div>
          <pre class="text-xs bg-white p-3 rounded border overflow-x-auto">${email}</pre>
        </div>
      `);
    }

    openModal(
      `Email Preview (${upcomingTasks.length} emails)`,
      `<div class="max-h-96 overflow-y-auto">${previewContent.join('')}</div>`
    );
  };

  return (
    <div className="space-y-6 mt-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-6 text-black dark:text-white">📧 Task Reminder System</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Send reminders for tasks due within:
            </label>
            <select
              value={selectedDays}
              onChange={(e) => setSelectedDays(e.target.value)}
              className="input-field"
            >
              <option value="1">1 day</option>
              <option value="2">2 days</option>
              <option value="3">3 days</option>
              <option value="5">5 days</option>
              <option value="7">7 days</option>
            </select>
          </div>
          
          <div className="flex flex-col justify-end">
            <button
              onClick={previewReminders}
              className="btn-secondary mb-2"
              disabled={sending}
            >
              Preview Emails
            </button>
          </div>
          
          <div className="flex flex-col justify-end">
            <button
              onClick={sendReminders}
              disabled={upcomingTasks.length === 0}
              className="btn-primary"
            >
              📧 Send {upcomingTasks.length} Reminders
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
          Upcoming Tasks ({upcomingTasks.length})
        </h3>
        
        {upcomingTasks.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No tasks due within the selected timeframe.
          </p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
            {upcomingTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-black dark:text-white">
                    {task.text.length > 60 ? `${task.text.substring(0, 60)}...` : task.text}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Assigned to: {task.user?.username || 'Unassigned'} | 
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                    {task.dueTime && ` at ${task.dueTime}`}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.daysDiff === 0 ? 'bg-red-100 text-red-800' :
                    task.daysDiff === 1 ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {task.daysDiff === 0 ? 'Due Today' : `${task.daysDiff} day${task.daysDiff > 1 ? 's' : ''} left`}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    task.priority === 'High' ? 'bg-red-100 text-red-800' :
                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskReminders;