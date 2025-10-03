export const callGeminiAPI = async (prompt) => {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

  console.log('=== GEMINI SERVICE DEBUG ===');
  console.log('API Key from env:', apiKey ? 'Found' : 'Not found');
  console.log('API Key length:', apiKey ? apiKey.length : 0);
  console.log('API Key preview:', apiKey ? apiKey.substring(0, 15) + '...' : 'N/A');

  if (!apiKey) {
    throw new Error('Gemini API key not found. Please add REACT_APP_GEMINI_API_KEY to your .env file.');
  }

  if (!apiKey.startsWith('AIzaSy')) {
    throw new Error('Invalid API key format. Gemini API keys should start with "AIzaSy"');
  }
  
  const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;
  
  try {
    const response = await fetch(apiUrl, {
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
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API Error:', errorData);
      throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const result = await response.json();
    
    if (!result.candidates || result.candidates.length === 0) {
      throw new Error('No response generated from AI');
    }
    
    const text = result.candidates[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('Empty response from AI');
    }
    
    return text.trim();
  } catch (error) {
    console.error('Gemini API Error:', error);
    if (error.message.includes('API key')) {
      throw new Error('Invalid API key. Please check your Gemini API configuration.');
    }
    throw new Error(`AI service unavailable: ${error.message}`);
  }
};

export const enhanceTaskDescription = async (briefDescription) => {
  if (!briefDescription.trim()) {
    throw new Error("Please enter a brief task description first.");
  }

  const prompt = `Transform this brief task "${briefDescription}" into ONE clear, professional, actionable sentence. Make it specific and concise. Return ONLY the enhanced task description without quotes or extra text.`;
  
  try {
    const result = await callGeminiAPI(prompt);
    return result.replace(/^["']|["']$/g, '').split('\n')[0].trim();
  } catch (error) {
    throw new Error(`Task enhancement failed: ${error.message}`);
  }
};

export const generateEmailNotification = async (task, staffMember, adminName) => {
  const prompt = `Write a professional email for task assignment with these details:
- Task: ${task.text}
- Priority: ${task.priority}
- Due Date: ${new Date(task.dueDate).toLocaleDateString()}
- Staff: ${staffMember.username}
- Admin: ${adminName}

Format: Subject line, greeting, task details, expectations, next steps, and professional closing. Make it clear and actionable.`;
  
  try {
    return await callGeminiAPI(prompt);
  } catch (error) {
    console.error('Email generation error:', error);
    throw new Error(`Email generation failed: ${error.message}`);
  }
};

export const generateContactEmail = async (emotion, topic, name) => {
  const prompt = `Write a professional email message for contacting admin about "${topic}". 
The sender's name is ${name} and their emotion is ${emotion}. 
Make it concise, professional, and appropriate for the emotional context. 
Write only the message body without subject line or greetings.`;
  
  try {
    return await callGeminiAPI(prompt);
  } catch (error) {
    console.error('Contact email generation error:', error);
    throw new Error(`Contact email generation failed: ${error.message}`);
  }
};

export const generateMoodAnalysis = async (moodData, tasks, users) => {
  const totalMoods = Object.values(moodData.overall).reduce((sum, count) => sum + count, 0);
  
  if (totalMoods === 0) {
    return 'No mood data available for analysis.';
  }
  
  const prompt = `Analyze this team mood data and provide detailed insights:

Mood Distribution:
- Happy: ${moodData.overall['😊'] || 0}
- Motivated: ${moodData.overall['💪'] || 0}
- Neutral: ${moodData.overall['😐'] || 0}
- Thinking: ${moodData.overall['🤔'] || 0}
- Frustrated: ${moodData.overall['😤'] || 0}

Total tasks with mood: ${totalMoods}
Staff count: ${Object.keys(moodData.byStaff).length}

Provide:
1. Executive summary
2. Key insights and concerns
3. Performance correlation
4. Specific recommendations
5. Action items

Make it professional and actionable for management.`;
  
  try {
    return await callGeminiAPI(prompt);
  } catch (error) {
    throw new Error(`Mood analysis failed: ${error.message}`);
  }
};
