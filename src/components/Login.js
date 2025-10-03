import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import ForgotPassword from './ForgotPassword';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(email, password);
    
    if (result.success) {
      setShowError(false);
      showToast(`Welcome back, ${email.split('@')[0]}!`);
      
      // Navigate based on user role
      if (result.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/staff');
      }
    } else {
      setShowError(true);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Left Side - Features Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-8 flex-col justify-center items-center">
        <div className="text-white max-w-lg">
          <div className="flex items-center mb-6">
            <svg className="w-12 h-12 mr-3 robot-hover cursor-pointer" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <rect x="25" y="20" width="50" height="40" rx="8" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="2"/>
              <circle cx="35" cy="35" r="4" fill="#10B981"/>
              <circle cx="65" cy="35" r="4" fill="#10B981"/>
              <rect x="40" y="45" width="20" height="3" rx="1.5" fill="#1F2937"/>
              <line x1="50" y1="20" x2="50" y2="10" stroke="#E5E7EB" strokeWidth="2"/>
              <circle cx="50" cy="8" r="3" fill="#EF4444"/>
              <rect x="30" y="60" width="40" height="30" rx="5" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="2"/>
              <rect x="15" y="65" width="15" height="8" rx="4" fill="#D1D5DB"/>
              <rect x="70" y="65" width="15" height="8" rx="4" fill="#D1D5DB"/>
              <rect x="35" y="68" width="12" height="2" rx="1" fill="#1F2937"/>
              <rect x="35" y="73" width="8" height="2" rx="1" fill="#1F2937"/>
              <rect x="35" y="78" width="10" height="2" rx="1" fill="#1F2937"/>
              <path d="M52 70 L54 72 L58 68" stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </svg>
            <h1 className="text-4xl font-bold">ArixManage</h1>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Smart Staff Task Manager</h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-2 rounded-lg">
              <div className="bg-white/20 p-2 rounded-lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Staff Management</h3>
                <p className="text-white/80 text-sm">Role-based dashboards with complete staff control</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-2 rounded-lg">
              <div className="bg-white/20 p-2 rounded-lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Task Assignment</h3>
                <p className="text-white/80 text-sm">Smart task allocation with priority tracking</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-2 rounded-lg">
              <div className="bg-white/20 p-2 rounded-lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">AI Analytics</h3>
                <p className="text-white/80 text-sm">Mood tracking with intelligent insights</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-2 rounded-lg">
              <div className="bg-white/20 p-2 rounded-lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Email Integration</h3>
                <p className="text-white/80 text-sm">Auto-generated professional notifications</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-20 h-20 robot-hover cursor-pointer" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
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
            <h1 className="text-4xl font-bold text-black mb-2">ArixManage</h1>
            <p className="text-black text-sm">Smart Staff Task Manager</p>
          </div>
          
          <div className="hidden lg:block text-center mb-8">
            <h2 className="text-2xl font-bold text-black mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-black focus:ring-2 focus:ring-black"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full p-2 pr-10 border border-gray-300 rounded-md bg-white text-black focus:ring-2 focus:ring-black"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {showError && (
            <p className="text-red-500 text-sm">Invalid email or password.</p>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setShowForgotPassword(true)}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium hover:underline"
          >
            Forgot Password?
          </button>
        </div>

          <div className="mt-6 p-4 bg-slate-100 rounded-md border border-slate-200">
            <p className="text-sm text-slate-700 font-medium mb-2">Demo Account:</p>
            <div className="text-xs text-slate-600 space-y-1">
              <p><strong>Admin:</strong> mdqamarahmed123@gmail.com</p>
              <p><strong>Password:</strong> 123456</p>
              <p><em>Staff accounts can be added through the admin panel</em></p>
            </div>
          </div>
        </div>
      </div>

      {showForgotPassword && (
        <ForgotPassword onClose={() => setShowForgotPassword(false)} />
      )}
    </div>
  );
};

export default Login;

