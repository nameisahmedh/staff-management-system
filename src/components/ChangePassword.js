import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useModal } from '../contexts/ModalContext';


const ChangePassword = ({ onClose }) => {
  const { loggedInUser, updateUser } = useAuth();
  const { showToast } = useToast();
  const { openModal } = useModal();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    currentPassword: '',
    otp: '',
    generatedOTP: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);



  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCurrentPasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.currentPassword !== loggedInUser.password) {
      showToast('Current password is incorrect', 'error');
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    openModal(
      "OTP Generated",
      `<div class="space-y-4">
        <div class="bg-blue-50 p-4 rounded border">
          <p class="text-blue-700"><strong>Your OTP:</strong> <span class="text-2xl font-bold">${otp}</span></p>
          <p class="text-sm text-blue-600 mt-2">Enter this OTP to change your password</p>
        </div>
      </div>`,
      `<button onclick="document.querySelector('[data-modal-close]')?.click();" class="btn-primary">Continue</button>`
    );
    
    setFormData(prev => ({ ...prev, generatedOTP: otp }));
    setStep(2);
    showToast('OTP generated!', 'success');
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.otp || formData.otp.length !== 6) {
      showToast('Please enter a valid 6-digit OTP', 'error');
      return;
    }

    if (formData.otp === formData.generatedOTP) {
      setStep(3);
      showToast('OTP verified successfully');
    } else {
      showToast('Invalid OTP. Please try again.', 'error');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (formData.newPassword === formData.currentPassword) {
      showToast('New password must be different from current password', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = updateUser(loggedInUser.id, { password: formData.newPassword });
      
      if (result) {
        showToast('Password updated successfully!', 'success');
        setTimeout(() => onClose(), 1000);
      } else {
        showToast('Failed to update password', 'error');
      }
    } catch (error) {
      showToast('Error updating password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setFormData(prev => ({ ...prev, generatedOTP: otp }));
    
    openModal(
      "New OTP Generated",
      `<div class="bg-blue-50 p-4 rounded border">
        <p class="text-blue-700"><strong>Your New OTP:</strong> <span class="text-2xl font-bold">${otp}</span></p>
      </div>`,
      `<button onclick="document.querySelector('[data-modal-close]')?.click();" class="btn-primary">Continue</button>`
    );
    
    showToast('New OTP generated!', 'success');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">
            {step === 1 ? 'Change Password' : step === 2 ? 'Verify SMS OTP' : 'Set New Password'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
        </div>

        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>1</div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>2</div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>3</div>
          </div>
        </div>

        {step === 1 && (
          <form onSubmit={handleCurrentPasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="input-field pr-10"
                  placeholder="Enter your current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showCurrentPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L8.464 8.464m5.656 5.656l1.415 1.415m-1.415-1.415l1.415 1.415M14.828 14.828L16.243 16.243" />
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
            
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Verifying...' : 'Continue'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOTPSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleInputChange}
                className="input-field text-center text-lg tracking-widest"
                placeholder="000000"
                maxLength="6"
                required
              />
              {countdown > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  OTP expires in {formatTime(countdown)}
                </p>
              )}
            </div>
            
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            
            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(1)} className="text-black hover:text-gray-700 text-sm">
                ← Back
              </button>
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-black hover:text-gray-700 text-sm"
              >
                Generate New OTP
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="input-field pr-10"
                  placeholder="Enter new password"
                  minLength="6"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L8.464 8.464m5.656 5.656l1.415 1.415m-1.415-1.415l1.415 1.415M14.828 14.828L16.243 16.243" />
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
            
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="input-field pr-10"
                  placeholder="Confirm new password"
                  minLength="6"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L8.464 8.464m5.656 5.656l1.415 1.415m-1.415-1.415l1.415 1.415M14.828 14.828L16.243 16.243" />
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
            
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Updating...' : 'Update Password'}
            </button>
            
            <button type="button" onClick={() => setStep(2)} className="text-black hover:text-gray-700 text-sm">
              ← Back to OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;