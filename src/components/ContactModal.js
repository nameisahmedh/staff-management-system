import React, { useState } from 'react';
import { generateContactEmail } from '../services/geminiService';

const ContactModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    emotion: '',
    topic: '',
    message: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [apiError, setApiError] = useState('');

  const emotions = [
    { value: 'happy', label: '😊 Happy', emoji: '😊' },
    { value: 'excited', label: '🎉 Excited', emoji: '🎉' },
    { value: 'neutral', label: '😐 Neutral', emoji: '😐' },
    { value: 'concerned', label: '🤔 Concerned', emoji: '🤔' },
    { value: 'frustrated', label: '😤 Frustrated', emoji: '😤' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerateEmail = async () => {
    if (!formData.emotion || !formData.topic) {
      alert('Please select an emotion and enter a topic first.');
      return;
    }

    if (!formData.name) {
      alert('Please enter your name first.');
      return;
    }

    setIsGenerating(true);
    setApiError('');
    
    try {
      const selectedEmotion = emotions.find(e => e.value === formData.emotion);
      const generatedMessage = await generateContactEmail(
        selectedEmotion?.label || formData.emotion,
        formData.topic,
        formData.name
      );
      setFormData({ ...formData, message: generatedMessage });
      setApiError('');
    } catch (error) {
      console.error('Email generation error:', error);
      setApiError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSending(true);
    try {
      // Simulate sending email
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Email sent successfully! We will get back to you soon.');
      onClose();
    } catch (error) {
      alert('Failed to send email: ' + error.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Admin</h2>
          <button
            onClick={onClose}
            className="text-3xl font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 leading-none"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          {/* AI Email Assistant Section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🤖</span>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300">AI Email Assistant</h3>
            </div>

            {/* Emotion Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What's your emotion?
              </label>
              <select
                name="emotion"
                value={formData.emotion}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              >
                <option value="">Select emotion...</option>
                {emotions.map(emotion => (
                  <option key={emotion.value} value={emotion.value}>
                    {emotion.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What's your topic?
              </label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                placeholder="e.g., partnership, support..."
              />
            </div>

            {/* Generate Button */}
            <button
              type="button"
              onClick={handleGenerateEmail}
              disabled={isGenerating || !formData.emotion || !formData.topic || !formData.name}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span className="text-xl">🤖</span>
              {isGenerating ? 'Generating AI Email...' : 'Generate AI Email'}
            </button>
            
            {apiError && (
              <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg">
                <p className="text-red-700 dark:text-red-300 text-sm">
                  <strong>AI Error:</strong> {apiError}
                </p>
                <p className="text-red-600 dark:text-red-400 text-xs mt-1">
                  You can still write your message manually below.
                </p>
              </div>
            )}
          </div>

          {/* Message Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all resize-none"
              placeholder="Write your message manually or use the AI generator above..."
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              💡 Tip: Fill in your details above and click "Generate AI Email" for a professional message
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSending}
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isSending ? 'Sending...' : 'Send Email'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
