import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const AuthenticatedHome = () => {
  const navigate = useNavigate();
  const { loggedInUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleDashboard = () => {
    if (loggedInUser.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/staff');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center py-2 sm:py-3 lg:py-4">
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 min-w-0 flex-1">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-indigo-600 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C6.095 4.01 5.25 4.973 5.25 6.108V18.75c0 1.28.98 2.347 2.21 2.392A48.403 48.403 0 0012 21.75c.628 0 1.25-.017 1.874-.50z" />
              </svg>
              <h1 className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 dark:text-white truncate">ArixManage</h1>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 flex-shrink-0">
              <span className="hidden md:block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-24 lg:max-w-none">
                Hi, {loggedInUser?.username}!
              </span>
              <button
                onClick={logout}
                className="text-xs sm:text-sm text-red-600 hover:text-red-800 font-medium px-1 sm:px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 whitespace-nowrap"
              >
                Logout
              </button>
              <button
                onClick={toggleTheme}
                className="p-1 sm:p-1.5 lg:p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 flex-shrink-0"
              >
                {theme === 'dark' ? (
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                ) : (
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
              </svg>
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
            Welcome Back, {loggedInUser?.username}!
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 px-4">
            You're logged in as {loggedInUser?.role === 'admin' ? 'Administrator' : 'Staff Member'}
          </p>
          
          <button
            onClick={handleDashboard}
            className="w-full sm:w-auto bg-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mx-4 sm:mx-0"
          >
            Go to Dashboard
          </button>
        </div>
      </section>
    </div>
  );
};

export default AuthenticatedHome;