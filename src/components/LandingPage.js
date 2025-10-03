import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import ContactModal from './ContactModal';

const LandingPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C6.095 4.01 5.25 4.973 5.25 6.108V18.75c0 1.28.98 2.347 2.21 2.392A48.403 48.403 0 0012 21.75c.628 0 1.25-.017 1.874-.50z" />
              </svg>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>ArixManage</h1>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <button
                onClick={() => setShowContactModal(true)}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors text-sm lg:text-base"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="hidden md:inline">Connect</span>
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-indigo-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 lg:px-6 lg:py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300 text-sm lg:text-base"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Login
              </button>
              <button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
              >
                {theme === 'dark' ? (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 px-3 sm:px-4 lg:px-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6 sm:mb-8 animate-fadeIn">
            <svg className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 robot-hover cursor-pointer" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <rect x="25" y="20" width="50" height="40" rx="8" fill="#4F46E5" stroke="#3730A3" strokeWidth="2"/>
              <circle cx="35" cy="35" r="4" fill="#10B981"/>
              <circle cx="65" cy="35" r="4" fill="#10B981"/>
              <rect x="40" y="45" width="20" height="3" rx="1.5" fill="#1F2937"/>
              <line x1="50" y1="20" x2="50" y2="10" stroke="#3730A3" strokeWidth="2"/>
              <circle cx="50" cy="8" r="3" fill="#EF4444"/>
              <rect x="30" y="60" width="40" height="30" rx="5" fill="#6366F1" stroke="#4F46E5" strokeWidth="2"/>
              <rect x="15" y="65" width="15" height="8" rx="4" fill="#8B5CF6"/>
              <rect x="70" y="65" width="15" height="8" rx="4" fill="#8B5CF6"/>
              <rect x="35" y="68" width="12" height="2" rx="1" fill="#FFFFFF"/>
              <rect x="35" y="73" width="8" height="2" rx="1" fill="#FFFFFF"/>
              <rect x="35" y="78" width="10" height="2" rx="1" fill="#FFFFFF"/>
              <path d="M52 70 L54 72 L58 68" stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
          
          <div className="mb-4 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <span className="inline-block bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-4 py-2 rounded-full text-sm font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
              🤖 Powered by Google Gemini AI
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 animate-fadeIn" style={{ fontFamily: 'Poppins, sans-serif', animationDelay: '0.3s' }}>
            Smart Staff Management System
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 max-w-2xl mx-auto animate-fadeIn" style={{ fontFamily: 'Poppins, sans-serif', animationDelay: '0.4s' }}>
            Transform your team management with AI-powered task allocation, intelligent mood tracking, and real-time analytics.
          </p>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-8 sm:mb-10 max-w-xl mx-auto animate-fadeIn" style={{ fontFamily: 'Poppins, sans-serif', animationDelay: '0.5s' }}>
            Streamline workflows, boost productivity, and keep your team engaged with our cutting-edge management platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-fadeIn" style={{ animationDelay: '0.6s' }}>
            <button
              onClick={() => navigate('/login')}
              className="bg-indigo-600 text-white px-6 py-3 sm:px-8 sm:py-3 lg:px-10 lg:py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Get Started →
            </button>
            <button
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 px-6 py-3 sm:px-8 sm:py-3 lg:px-10 lg:py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-indigo-600 dark:border-indigo-400 w-full sm:w-auto"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Learn More
            </button>
          </div>
          
          <div className="mt-12 sm:mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto animate-fadeIn" style={{ animationDelay: '0.7s' }}>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400" style={{ fontFamily: 'Poppins, sans-serif' }}>100%</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Poppins, sans-serif' }}>AI-Powered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400" style={{ fontFamily: 'Poppins, sans-serif' }}>24/7</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Poppins, sans-serif' }}>Real-time Tracking</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400" style={{ fontFamily: 'Poppins, sans-serif' }}>∞</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Poppins, sans-serif' }}>Unlimited Tasks</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 px-3 sm:px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Powerful Features
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Everything you need to manage your team efficiently and effectively
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 animate-fadeIn">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Staff Management</h3>
              <p className="text-gray-600 dark:text-gray-300" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Complete staff control with role-based access and profile management.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Task Assignment</h3>
              <p className="text-gray-600 dark:text-gray-300" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Smart task allocation with priorities, due dates, and status tracking.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>AI Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Intelligent mood tracking and team performance insights.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Email Integration</h3>
              <p className="text-gray-600 dark:text-gray-300" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Auto-generated professional task notifications and reminders.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">😊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Mood Tracking</h3>
              <p className="text-gray-600 dark:text-gray-300" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Emoji-based feedback system for team wellness monitoring.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Modern UI</h3>
              <p className="text-gray-600 dark:text-gray-300" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Responsive design with dark/light themes and smooth animations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 px-3 sm:px-4 lg:px-6 bg-indigo-600 dark:bg-indigo-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center text-white">
            <div className="animate-fadeIn">
              <div className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>⚡</div>
              <div className="text-2xl sm:text-3xl font-bold mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Fast</div>
              <div className="text-xs sm:text-sm opacity-90" style={{ fontFamily: 'Poppins, sans-serif' }}>Lightning-fast performance</div>
            </div>
            <div className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>🔒</div>
              <div className="text-3xl font-bold mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Secure</div>
              <div className="text-sm opacity-90" style={{ fontFamily: 'Poppins, sans-serif' }}>Enterprise-grade security</div>
            </div>
            <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>📱</div>
              <div className="text-3xl font-bold mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Responsive</div>
              <div className="text-sm opacity-90" style={{ fontFamily: 'Poppins, sans-serif' }}>Works on all devices</div>
            </div>
            <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>🎨</div>
              <div className="text-3xl font-bold mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Modern</div>
              <div className="text-sm opacity-90" style={{ fontFamily: 'Poppins, sans-serif' }}>Beautiful UI/UX design</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 dark:bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>About ArixManage</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🚀</span>
                <p className="text-gray-300" style={{ fontFamily: 'Poppins, sans-serif' }}>Modern staff management solution</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🤖</span>
                <p className="text-gray-300" style={{ fontFamily: 'Poppins, sans-serif' }}>AI-powered task enhancement</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📧</span>
                <p className="text-gray-300" style={{ fontFamily: 'Poppins, sans-serif' }}>Smart email notifications</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📊</span>
                <p className="text-gray-300" style={{ fontFamily: 'Poppins, sans-serif' }}>Real-time analytics dashboard</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>Technology Stack</h2>
            <p className="text-gray-300 text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Built with React, Tailwind CSS, and Google Gemini AI for intelligent task management and seamless user experience.
            </p>
            <p className="text-gray-400 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Made with ❤️ by Ahmed | © 2025 All rights reserved
            </p>
          </div>
        </div>
      </section>



      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal onClose={() => setShowContactModal(false)} />
      )}
    </div>
  );
};

export default LandingPage;
