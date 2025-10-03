export const generateEnhancedEmailContent = async (task, staffUser, adminUser) => {
  const lowerText = task.text.toLowerCase();

  const getUrgencyLevel = () => {
    if (task.priority === 'High') return 'HIGH PRIORITY';
    if (task.priority === 'Medium') return 'MEDIUM PRIORITY';
    return 'STANDARD PRIORITY';
  };

  const getDaysUntilDue = () => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTimeframeMessage = () => {
    const days = getDaysUntilDue();
    if (days < 0) return "URGENT: This task is overdue!";
    if (days === 0) return "URGENT: This task is due today!";
    if (days === 1) return "This task is due tomorrow.";
    if (days <= 3) return `This task is due in ${days} days - please prioritize accordingly.`;
    if (days <= 7) return `You have ${days} days to complete this task.`;
    return `Deadline: ${days} days from now.`;
  };

  const getProjectContext = () => {
    if (lowerText.includes('chatbot') || lowerText.includes('ai') || lowerText.includes('bot') || lowerText.includes('ml') || lowerText.includes('machine learning')) {
      return `\n\nPROJECT CONTEXT:\nThis task is part of our AI/ML development initiative focused on building intelligent systems that enhance automation and user interaction through advanced algorithms and natural language processing.`;
    }
    if (lowerText.includes('web') || lowerText.includes('website') || lowerText.includes('frontend') || lowerText.includes('ui') || lowerText.includes('interface')) {
      return `\n\nPROJECT CONTEXT:\nThis task contributes to our web development project, focusing on creating responsive, user-friendly interfaces with modern design patterns and optimal user experience.`;
    }
    if (lowerText.includes('api') || lowerText.includes('backend') || lowerText.includes('database') || lowerText.includes('server') || lowerText.includes('microservice')) {
      return `\n\nPROJECT CONTEXT:\nThis task is part of our backend infrastructure development, focusing on building scalable APIs, efficient data management systems, and robust server architecture.`;
    }
    if (lowerText.includes('mobile') || lowerText.includes('app') || lowerText.includes('ios') || lowerText.includes('android')) {
      return `\n\nPROJECT CONTEXT:\nThis task is part of our mobile application development, aimed at creating seamless cross-platform experiences with native performance and intuitive mobile-first design.`;
    }
    if (lowerText.includes('test') || lowerText.includes('qa') || lowerText.includes('bug') || lowerText.includes('debug')) {
      return `\n\nPROJECT CONTEXT:\nThis task is part of our quality assurance efforts to ensure robust, bug-free software through comprehensive testing, debugging, and validation procedures.`;
    }
    if (lowerText.includes('security') || lowerText.includes('auth') || lowerText.includes('encrypt') || lowerText.includes('protect')) {
      return `\n\nPROJECT CONTEXT:\nThis task is critical for our security infrastructure, focusing on implementing robust authentication, encryption, and protection mechanisms to safeguard user data and system integrity.`;
    }
    if (lowerText.includes('deploy') || lowerText.includes('devops') || lowerText.includes('ci/cd') || lowerText.includes('pipeline')) {
      return `\n\nPROJECT CONTEXT:\nThis task is part of our DevOps and deployment pipeline, aimed at automating delivery processes and ensuring reliable, efficient software releases.`;
    }
    if (lowerText.includes('data') || lowerText.includes('analytics') || lowerText.includes('report') || lowerText.includes('insight')) {
      return `\n\nPROJECT CONTEXT:\nThis task contributes to our data analytics initiative, focusing on extracting meaningful insights, generating reports, and enabling data-driven decision making.`;
    }
    return `\n\nPROJECT CONTEXT:\nThis task is an important component of our current development cycle, directly contributing to our project milestones and overall business objectives.`;
  };

  const getActionItems = () => {
    const actions = [
      '• Review the task requirements carefully and clarify any uncertainties',
      '• Update task status in ArixManage system as you make progress'
    ];

    if (task.priority === 'High' || getDaysUntilDue() <= 2) {
      actions.push('• Begin work immediately - this is time-sensitive');
      actions.push('• Communicate any blockers or issues to the admin team promptly');
    } else {
      actions.push('• Plan your approach and allocate appropriate time in your schedule');
      actions.push('• Contact admin if you need additional resources or clarification');
    }

    if (lowerText.includes('test') || lowerText.includes('qa')) {
      actions.push('• Ensure comprehensive test coverage and documentation');
    }
    if (lowerText.includes('review') || lowerText.includes('code')) {
      actions.push('• Follow coding standards and best practices');
    }
    if (lowerText.includes('document') || lowerText.includes('doc')) {
      actions.push('• Maintain clear and detailed documentation');
    }

    return actions.join('\n');
  };

  const subject = `${getUrgencyLevel()}: ${task.text.substring(0, 60)}${task.text.length > 60 ? '...' : ''}`;

  const body = `Dear ${staffUser.username},

${getTimeframeMessage()}

You have been assigned a new task by ${adminUser?.username || 'Admin'}.

==========================================
TASK DETAILS:
==========================================

Task Description: ${task.text}

Priority Level: ${task.priority}
Due Date: ${new Date(task.dueDate).toLocaleDateString()}${task.dueTime ? ` at ${task.dueTime}` : ''}
Assigned By: ${adminUser?.username || 'Admin'}
Time Available: ${getDaysUntilDue()} day(s)
${getProjectContext()}

==========================================
ACTION ITEMS:
==========================================

${getActionItems()}

==========================================
IMPORTANT REMINDERS:
==========================================

• Quality is paramount - take the time needed to deliver excellent work
• Communication is key - keep the team updated on your progress
• Don't hesitate to ask questions or request assistance when needed
• Mark task as completed in ArixManage once finished

${getDaysUntilDue() <= 2 ? '\nTIME-SENSITIVE: This task requires immediate attention. Please prioritize it in your current workload.\n' : ''}
Please log into the ArixManage system to track your progress and update the task status.

If you have any questions or concerns about this assignment, please reach out to the admin team immediately.

Best regards,
${adminUser?.username || 'Admin'}
ArixManage System

---
This is an automated notification from ArixManage Task Management System.`;

  return { subject, body };
};

// Send task email using Gmail
export const sendTaskEmail = (email, subject, body) => {
  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(gmailLink, '_blank');
};