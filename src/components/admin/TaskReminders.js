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

  const generateReminderEmail = (task, daysDiff) => {
    const urgencyLevel = daysDiff === 0 ? 'URGENT' : daysDiff === 1 ? 'HIGH' : 'MEDIUM';
    const timeText = daysDiff === 0 ? 'TODAY' : daysDiff === 1 ? 'TOMORROW' : `in ${daysDiff} days`;
    const priorityEmoji = task.priority === 'High' ? '🔴' : task.priority === 'Medium' ? '🟡' : '🟢';
    const urgencyEmoji = daysDiff === 0 ? '⚠️' : daysDiff === 1 ? '⏰' : '📅';

    const lowerText = task.text.toLowerCase();

    const getTaskTypeContext = () => {
      if (lowerText.includes('chatbot') || lowerText.includes('ai') || lowerText.includes('bot')) {
        return `\n\n🤖 TASK TYPE: AI/Chatbot Development\nThis task involves artificial intelligence and chatbot functionality. Ensure all AI responses are tested and validated before completion.`;
      }
      if (lowerText.includes('web') || lowerText.includes('website') || lowerText.includes('frontend')) {
        return `\n\n🎨 TASK TYPE: Web/Frontend Development\nThis task focuses on user interface and web functionality. Test across multiple browsers and devices before marking complete.`;
      }
      if (lowerText.includes('api') || lowerText.includes('backend') || lowerText.includes('database')) {
        return `\n\n⚙️ TASK TYPE: Backend/Database Work\nThis task involves backend systems. Ensure proper error handling, data validation, and security measures are in place.`;
      }
      if (lowerText.includes('test') || lowerText.includes('qa') || lowerText.includes('bug')) {
        return `\n\n🔍 TASK TYPE: Testing/QA\nThis task requires thorough testing. Document all test cases and ensure comprehensive coverage of edge cases.`;
      }
      if (lowerText.includes('security') || lowerText.includes('auth')) {
        return `\n\n🔒 TASK TYPE: Security/Authentication\nThis task is security-critical. Follow security best practices and ensure all vulnerabilities are addressed.`;
      }
      if (lowerText.includes('deploy') || lowerText.includes('release')) {
        return `\n\n🚀 TASK TYPE: Deployment/Release\nThis task involves deployment. Follow the deployment checklist and ensure rollback plans are in place.`;
      }
      if (lowerText.includes('document') || lowerText.includes('doc')) {
        return `\n\n📝 TASK TYPE: Documentation\nThis task requires clear documentation. Ensure all information is accurate, comprehensive, and easy to understand.`;
      }
      return `\n\n💼 TASK TYPE: General Development\nThis task is part of the ongoing development cycle. Follow project standards and maintain code quality.`;
    };

    const getSpecificReminders = () => {
      const reminders = [];
      if (task.priority === 'High' || daysDiff <= 1) {
        reminders.push('• This is a HIGH-PRIORITY reminder - immediate action required');
        reminders.push('• Block your calendar and eliminate distractions to focus on this task');
      }
      if (lowerText.includes('test') || lowerText.includes('qa')) {
        reminders.push('• Run all test suites and verify functionality thoroughly');
      }
      if (lowerText.includes('review') || lowerText.includes('code')) {
        reminders.push('• Conduct thorough code review and follow coding standards');
      }
      if (lowerText.includes('api') || lowerText.includes('backend')) {
        reminders.push('• Test all API endpoints and validate error responses');
      }
      if (lowerText.includes('ui') || lowerText.includes('interface')) {
        reminders.push('• Verify responsive design across different screen sizes');
      }
      if (lowerText.includes('security')) {
        reminders.push('• Perform security audit and penetration testing if applicable');
      }
      if (reminders.length === 0) {
        reminders.push('• Review all acceptance criteria before marking as complete');
      }
      return reminders.join('\n');
    };

    const getActionPlan = () => {
      if (daysDiff === 0) {
        return `${urgencyEmoji} CRITICAL ACTION PLAN FOR TODAY:
1. DROP EVERYTHING - This task must be completed TODAY
2. Review task requirements one final time
3. Focus exclusively on task completion
4. Test thoroughly despite time pressure
5. Update status to "Completed" once finished
6. Notify admin immediately if completion is impossible

⚠️ If you cannot complete this today, contact admin NOW to discuss options.`;
      } else if (daysDiff === 1) {
        return `${urgencyEmoji} URGENT ACTION PLAN FOR TOMORROW:
1. Clear your schedule for tomorrow - this is top priority
2. Gather all required resources and information today
3. Plan your approach and identify potential blockers
4. Start any preparatory work that can be done today
5. Set reminders to begin work first thing tomorrow
6. Contact admin today if you foresee any issues`;
      } else if (daysDiff <= 3) {
        return `${urgencyEmoji} ACTION PLAN (${daysDiff} days remaining):
1. Schedule dedicated time blocks for this task
2. Break down the task into smaller, manageable sub-tasks
3. Identify any dependencies or resources needed
4. Begin work within the next 24 hours
5. Set daily check-ins with yourself to track progress
6. Maintain communication with admin on progress`;
      } else {
        return `${urgencyEmoji} ACTION PLAN (${daysDiff} days remaining):
1. Review task requirements and scope
2. Plan your approach and timeline
3. Allocate time in your schedule strategically
4. Identify any questions or clarifications needed
5. Begin work soon to avoid last-minute rush
6. Update progress regularly in ArixManage system`;
      }
    };

    return `Subject: ${urgencyEmoji} ${urgencyLevel} REMINDER: ${task.priority} Priority Task Due ${timeText.toUpperCase()}

Dear ${task.user?.username},

${daysDiff === 0 ? '⚠️⚠️⚠️ URGENT REMINDER ⚠️⚠️⚠️\n\nThis is a CRITICAL reminder - your task is DUE TODAY!' : daysDiff === 1 ? '⏰ IMPORTANT REMINDER ⏰\n\nYour task is due TOMORROW!' : `📅 FRIENDLY REMINDER 📅\n\nYour task deadline is approaching in ${daysDiff} days.`}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 TASK REMINDER DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task: ${task.text}

Priority Level: ${task.priority} ${priorityEmoji}
Current Status: ${task.status || 'Pending'}
Due Date: ${new Date(task.dueDate).toLocaleDateString()}${task.dueTime ? ` at ${task.dueTime}` : ''}
Time Remaining: ${daysDiff === 0 ? '⚠️ DUE TODAY ⚠️' : daysDiff === 1 ? '⏰ DUE TOMORROW ⏰' : `${daysDiff} day${daysDiff > 1 ? 's' : ''} remaining`}
Urgency Level: ${urgencyLevel} ${urgencyEmoji}
${getTaskTypeContext()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ ${daysDiff === 0 ? 'IMMEDIATE' : 'REQUIRED'} ACTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${getActionPlan()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 SPECIFIC REMINDERS FOR THIS TASK:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${getSpecificReminders()}
• Quality must not be compromised - deliver your best work
• Document your work and update task notes in ArixManage
• Contact admin immediately if you encounter blockers

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ IMPORTANT NOTES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Update your task status in ArixManage as you make progress
• Communicate proactively if you anticipate any delays
• Confirm receipt of this reminder by updating task comments
• Remember: It's better to ask for help than to miss the deadline
${daysDiff === 0 ? '\n🚨 CRITICAL: If you cannot complete this today, notify admin IMMEDIATELY. Do not wait until the deadline passes.\n' : ''}
${daysDiff <= 1 ? '\n⚠️ URGENT: This task requires your immediate attention. Clear your schedule and prioritize this work.\n' : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please log into the ArixManage system RIGHT NOW to:
1. Review complete task details
2. Update your progress status
3. Add any comments or concerns
4. Mark as completed once finished

${daysDiff === 0 ? 'This is your FINAL reminder. Action is required TODAY.' : daysDiff === 1 ? 'This is an URGENT reminder. Begin work immediately.' : 'This is a friendly reminder to help you stay on track.'}

If you have any questions, concerns, or need assistance, please contact the admin team IMMEDIATELY. We are here to support you!

Best regards,
Admin Team
ArixManage Task Management System

---
${daysDiff === 0 ? '⚠️ CRITICAL DEADLINE: TODAY' : daysDiff === 1 ? '⏰ URGENT: DUE TOMORROW' : `📅 Reminder sent: ${daysDiff} days before deadline`}
Task ID: ${task.id} | Priority: ${task.priority} ${priorityEmoji}`;
  };

  const sendReminders = async () => {
    if (upcomingTasks.length === 0) {
      showToast('No tasks found for the selected timeframe', 'warning');
      return;
    }

    const emailsData = upcomingTasks
      .filter(task => task.user?.email)
      .map(task => {
        const emailContent = generateReminderEmail(task, task.daysDiff);
        const [subjectLine, ...bodyParts] = emailContent.split('\n');
        return {
          task,
          subject: subjectLine.replace('Subject: ', '').trim(),
          body: bodyParts.join('\n').trim()
        };
      });

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

  const previewReminders = () => {
    if (upcomingTasks.length === 0) {
      showToast('No tasks found for the selected timeframe', 'warning');
      return;
    }

    const previewContent = upcomingTasks.map(task => {
      const email = generateReminderEmail(task, task.daysDiff);
      return `
        <div class="mb-6 p-4 border rounded-lg bg-gray-50">
          <div class="font-semibold text-blue-600 mb-2">To: ${task.user?.email || 'No email'}</div>
          <div class="text-sm text-gray-600 mb-2">Task: ${task.text}</div>
          <div class="text-sm text-gray-600 mb-2">Due in: ${task.daysDiff} day(s)</div>
          <pre class="text-xs bg-white p-3 rounded border overflow-x-auto">${email}</pre>
        </div>
      `;
    }).join('');

    openModal(
      `📧 Email Preview (${upcomingTasks.length} emails)`,
      `<div class="max-h-96 overflow-y-auto">${previewContent}</div>`,
      `<div class="flex gap-3">
        <button onclick="document.querySelector('[data-modal-close]')?.click();" class="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
          Close
        </button>
      </div>`
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
              👁️ Preview Emails
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