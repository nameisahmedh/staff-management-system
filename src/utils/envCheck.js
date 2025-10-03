export const checkEnvironment = () => {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  
  console.log('=== ENVIRONMENT DEBUG ===');
  console.log('All env vars:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP')));
  console.log('Raw API Key:', apiKey);
  console.log('API Key exists:', !!apiKey);
  console.log('API Key length:', apiKey ? apiKey.length : 0);
  console.log('API Key starts with:', apiKey ? apiKey.substring(0, 15) + '...' : 'N/A');
  console.log('Expected format: AIzaSy...');
  console.log('========================');
  
  return {
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey ? apiKey.length : 0,
    apiKeyPreview: apiKey ? apiKey.substring(0, 15) + '...' : 'N/A'
  };
};