import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('Gemini API key not found. Please add REACT_APP_GEMINI_API_KEY to your .env file.');
}

const genAI = new GoogleGenerativeAI(apiKey);

const callGeminiAPI = async (prompt, outputFormat = 'text') => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    };

    if (outputFormat === 'json') {
      generationConfig.responseMimeType = 'application/json';
    }

    const result = await model.generateContent(prompt, generationConfig);
    const response = result.response;
    const text = response.text();

    if (!text) {
      throw new Error('Empty or incomplete response from AI.');
    }

    return text.trim();
  } catch (error) {
    console.error('Gemini API Call Failed:', error);
    if (error.message.includes('API key')) {
      throw new Error('Invalid or missing API key. Please check your Gemini API configuration.');
    }
    throw new Error(`AI service request failed: ${error.message}`);
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
  const prompt = `Generate a professional email notification for a new task assignment.
  
  Task Details:
  - Title: ${task.title}
  - Description: ${task.description}
  - Priority: ${task.priority}
  - Due Date: ${task.dueDate}
  - Assigned to: ${staffMember.name}
  - Assigned by: ${adminName}
  
  Generate a professional email with subject and body. Return as JSON with "subject" and "body" fields.`;

  try {
    const result = await callGeminiAPI(prompt, 'json');
    return JSON.parse(result);
  } catch (error) {
    throw new Error(`Email generation failed: ${error.message}`);
  }
};

export const analyzeMoodData = async (moodData) => {
  const prompt = `Analyze the following team mood data and provide insights:
  
  ${JSON.stringify(moodData, null, 2)}
  
  Provide analysis as JSON with "summary", "insights", and "recommendations" fields.`;

  try {
    const result = await callGeminiAPI(prompt, 'json');
    return JSON.parse(result);
  } catch (error) {
    throw new Error(`Mood analysis failed: ${error.message}`);
  }
};

export const generateContactEmail = async (emotion, topic, name) => {
  const prompt = `Generate a professional contact email message.
  
  Details:
  - Sender: ${name}
  - Emotion: ${emotion}
  - Topic: ${topic}
  
  Create a professional, polite email message that reflects the sender's emotion and addresses the topic. Return only the message body as plain text.`;

  try {
    const result = await callGeminiAPI(prompt);
    return result;
  } catch (error) {
    throw new Error(`Contact email generation failed: ${error.message}`);
  }
};