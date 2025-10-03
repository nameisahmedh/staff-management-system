import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('Gemini API key not found. Please add REACT_APP_GEMINI_API_KEY to your .env file.');
}

const genAI = new GoogleGenerativeAI(apiKey);

const callGeminiAPI = async (prompt, outputFormat = 'text') => {
  try {
    // Try SDK first
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('Empty response from AI.');
    }
    
    return text.trim();
  } catch (sdkError) {
    console.log('SDK failed, trying direct API call:', sdkError.message);
    
    // Fallback to direct API call
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        throw new Error('No text in API response');
      }
      
      return text.trim();
    } catch (apiError) {
      console.error('Direct API call also failed:', apiError);
      throw new Error(`AI service unavailable: ${apiError.message}`);
    }
  }
};

export const enhanceTaskDescription = async (briefDescription) => {
  if (!briefDescription.trim()) {
    throw new Error("Please enter a brief task description first.");
  }

  const prompt = `Transform the following brief task description into a single, clear, professional, and actionable sentence.
  
  Brief Description: "${briefDescription}"
  
  Return ONLY the enhanced task description as a raw string, without any extra text, quotes, or formatting.`;

  try {
    const result = await callGeminiAPI(prompt);
    // Clean up the result to ensure it's a single line and trimmed.
    return result.replace(/\n/g, ' ').replace(/^["']|["']$/g, '').trim();
  } catch (error) {
    throw new Error(`Task enhancement failed: ${error.message}`);
  }
};

export const generateEmailNotification = async (task, staffMember, adminName) => {
  const prompt = `Create a professional, polite task assignment email with the following details:

Task Information:
- Task: ${task.text || task.title || task.description}
- Priority Level: ${task.priority}
- Due Date: ${task.dueDate}
- Due Time: ${task.dueTime || 'Not specified'}
- Staff Member: ${staffMember.username || staffMember.name}
- Admin: ${adminName}

Requirements:
1. Write a polite, professional email in PLAIN TEXT format (no HTML)
2. Include ALL task details clearly
3. Be encouraging and supportive
4. Use proper formatting with line breaks and spacing
5. Return as JSON with "subject" and "body" fields
6. Make the body plain text with clear structure

Example format:
{
  "subject": "New Task Assignment - [Task Name]",
  "body": "Dear [Name],\n\nI hope this email finds you well...\n\nBest regards,\n[Admin Name]"
}`;

  try {
    const result = await callGeminiAPI(prompt);
    try {
      const parsed = JSON.parse(result);
      // Clean any HTML tags from the response
      if (parsed.body) {
        parsed.body = parsed.body.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
      }
      return parsed;
    } catch (parseError) {
      // Fallback to structured plain text response
      return {
        subject: `New Task Assignment - ${task.text?.substring(0, 50) || 'Task'}`,
        body: `Dear ${staffMember.username || staffMember.name},\n\nI hope this email finds you well. I'm writing to assign you a new task that requires your attention.\n\nTask Details:\n- Task Description: ${task.text || task.description}\n- Priority Level: ${task.priority}\n- Due Date: ${task.dueDate}${task.dueTime ? `\n- Due Time: ${task.dueTime}` : ''}\n\nCould you please review this task and complete it by the specified deadline? If you have any questions or need clarification, please don't hesitate to reach out to me.\n\nThank you for your dedication and hard work. I'm confident you'll handle this task excellently.\n\nBest regards,\n${adminName}\nTask Management System`
      };
    }
  } catch (error) {
    throw new Error(`Email generation failed: ${error.message}`);
  }
};

export const generateTaskReminder = async (task, daysDiff, timeText, urgencyLevel) => {
  const prompt = `Generate a short, direct task reminder email based on:

Task: "${task.text}"
Priority: ${task.priority}
Due: ${timeText} (${daysDiff} days)
Staff: ${task.user?.username}
Status: ${task.status || 'Pending'}
Due Date: ${new Date(task.dueDate).toLocaleDateString()}${task.dueTime ? ` at ${task.dueTime}` : ''}

Requirements:
1. Keep it SHORT and direct - no long templates
2. Personalize based on the specific task content
3. Adjust urgency based on days remaining (${daysDiff} days)
4. Be professional but concise
5. Focus on completion, not lengthy explanations
6. Return as plain text with Subject: line first

Make it specific to this task, not generic. ${daysDiff === 0 ? 'Make it urgent since it\'s due today.' : daysDiff === 1 ? 'Make it high priority since it\'s due tomorrow.' : 'Keep it as a friendly reminder.'}`;

  try {
    const result = await callGeminiAPI(prompt);
    return result;
  } catch (error) {
    throw new Error(`Reminder generation failed: ${error.message}`);
  }
};

export const generateMoodAnalysis = async (moodData, tasks, users) => {
  const tasksWithMood = tasks.filter(t => t.mood);
  const staffDetails = {};
  
  tasksWithMood.forEach(task => {
    if (task.assignedTo) {
      const user = users.find(u => u.id === task.assignedTo);
      if (user && user.role === 'staff') {
        if (!staffDetails[user.username]) {
          staffDetails[user.username] = { entries: [] };
        }
        staffDetails[user.username].entries.push({
          task: task.text,
          emoji: task.mood,
          remark: task.moodRemark || 'No remark',
          priority: task.priority,
          status: task.status,
          dueDate: task.dueDate
        });
      }
    }
  });

  const prompt = `Analyze team mood based on emoji reactions and staff remarks:

EMOJI MEANINGS:
😊 = Happy/Satisfied
😐 = Neutral/Okay
😤 = Frustrated/Angry
🤔 = Thinking/Confused
💪 = Motivated/Energetic

STAFF MOOD DATA:
${Object.entries(staffDetails).map(([name, data]) => 
  `\n${name}:\n${data.entries.map(entry => 
    `- Task: "${entry.task}"\n  Emoji: ${entry.emoji} | Remark: "${entry.remark}"\n  Priority: ${entry.priority} | Status: ${entry.status}`
  ).join('\n')}`
).join('\n')}

TOTAL MOOD BREAKDOWN:
${Object.entries(moodData.overall).map(([emoji, count]) => `${emoji}: ${count} times`).join('\n')}

Analyze emoji reactions and staff remarks. Keep each field under 100 words. Use clean, simple language without markdown formatting, asterisks, or special characters.

Return JSON:
{
  "summary": "Brief team mood overview in plain text",
  "insights": "Key patterns in plain text without formatting",
  "recommendations": "Simple actionable advice in plain text",
  "actionItems": "Clean bullet points using \\n for line breaks"
}`;

  try {
    const result = await callGeminiAPI(prompt);
    // Clean the result to extract JSON
    let cleanResult = result.replace(/```json/g, '').replace(/```/g, '').trim();
    // Remove HTML entities and markdown formatting
    cleanResult = cleanResult.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\*\*/g, '').replace(/\*/g, '');
    return JSON.parse(cleanResult);
  } catch (error) {
    throw new Error(`Mood analysis failed: ${error.message}`);
  }
};

export const generateContactEmail = async (emotion, topic, name) => {
  const prompt = `Generate a professional contact email message.
  
  Details:
  - Sender name: ${name}
  - Emotion/mood: ${emotion}
  - Topic/subject: ${topic}
  
  Requirements:
  1. Create a professional, polite email message
  2. Address it to "Dear Team" (not placeholders like [Recipient name])
  3. Reflect the sender's emotion appropriately
  4. Focus on the specified topic
  5. Use the sender's actual name, not placeholders
  6. Return only the message body as plain text
  7. Do NOT use any placeholder brackets like [Name] or [Topic]
  
  The message should be complete and ready to send without any placeholders.`;

  try {
    const result = await callGeminiAPI(prompt);
    // Clean any remaining placeholders
    let cleanResult = result
      .replace(/\[.*?\]/g, '') // Remove any [placeholder] text
      .replace(/Dear \[.*?\],?/gi, 'Dear Team,') // Replace any Dear [placeholder] with Dear Team
      .replace(/\{.*?\}/g, '') // Remove any {placeholder} text
      .trim();
    
    // Ensure it starts with Dear Team if no greeting
    if (!cleanResult.toLowerCase().startsWith('dear')) {
      cleanResult = `Dear Team,\n\n${cleanResult}`;
    }
    
    return cleanResult;
  } catch (error) {
    throw new Error(`Contact email generation failed: ${error.message}`);
  }
};