// Enhanced email generation with AI
export const generateEnhancedEmailContent = async (task, staffUser, adminUser) => {
  const getProjectContext = (taskText) => {
    const lowerText = taskText.toLowerCase();
    if (lowerText.includes('chatbot') || lowerText.includes('ai') || lowerText.includes('bot')) {
      return `\n\nProject Context:\nThis task is part of our AI chatbot development initiative, designed to enhance customer interaction and provide intelligent automated responses.`;
    }
    if (lowerText.includes('web') || lowerText.includes('website') || lowerText.includes('frontend')) {
      return `\n\nProject Context:\nThis task contributes to our web development project focused on creating responsive, user-friendly interfaces.`;
    }
    if (lowerText.includes('api') || lowerText.includes('backend') || lowerText.includes('database')) {
      return `\n\nProject Context:\nThis task is part of our backend infrastructure development, focusing on robust API design and efficient data management.`;
    }
    return `\n\nProject Context:\nThis task is an important component of our current development cycle, contributing to the overall project objectives.`;
  };

  return {
    subject: `New Task Assignment: ${task.text}`,
    body: `Dear ${staffUser.username},\n\nYou have been assigned a new task:\n\nTask: ${task.text}\nPriority: ${task.priority}\nDue Date: ${new Date(task.dueDate).toLocaleDateString()}\nAssigned by: ${adminUser?.username || 'Admin'}${getProjectContext(task.text)}\n\nPlease log into the ArixManage system to view complete details and update the task status as you progress.\n\nBest regards,\nThe Admin Team`
  };
};

// Send task email using Gmail
export const sendTaskEmail = (email, subject, body) => {
  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(gmailLink, '_blank');
};