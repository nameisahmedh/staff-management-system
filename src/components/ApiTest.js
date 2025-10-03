import React, { useState, useEffect } from 'react';
import { callGeminiAPI } from '../services/geminiService';
import { checkEnvironment } from '../utils/envCheck';

const ApiTest = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [envStatus, setEnvStatus] = useState(null);

  useEffect(() => {
    const status = checkEnvironment();
    setEnvStatus(status);
  }, []);

  const testAPI = async () => {
    setLoading(true);
    setError('');
    setResult('');
    
    try {
      const response = await callGeminiAPI('Say hello and confirm the API is working');
      setResult(response);
    } catch (err) {
      setError(err.message);
      console.error('API Test Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-lg max-w-sm">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Gemini API Test</h3>
      
      {envStatus && (
        <div className="mb-4 text-sm space-y-2">
          <div className={`p-2 rounded ${envStatus.hasApiKey ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            API Key: {envStatus.hasApiKey ? `✓ Loaded (${envStatus.apiKeyLength} chars)` : '✗ Missing'}
          </div>
          {envStatus.hasApiKey && (
            <div className="p-2 bg-blue-100 text-blue-800 rounded text-xs">
              Preview: {envStatus.apiKeyPreview}
            </div>
          )}
        </div>
      )}
      
      <button 
        onClick={testAPI}
        disabled={loading || !envStatus?.hasApiKey}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400 mb-4"
      >
        {loading ? 'Testing...' : 'Test API'}
      </button>
      
      {result && (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded">
          <strong>Success:</strong> {result}
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default ApiTest;