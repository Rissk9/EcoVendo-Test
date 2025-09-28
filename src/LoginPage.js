import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const LoginPage = () => {
  const [authMethod, setAuthMethod] = useState('google');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { 
    signInWithGoogle, 
    signInWithPhone, 
    error, 
    clearError 
  } = useAuth();

  useEffect(() => {
    clearError();
    setOtpSent(false);
    setOtp('');
    setPhoneNumber('');
  }, [authMethod, clearError]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    clearError();
    try {
      await signInWithGoogle();
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      return;
    }

    setLoading(true);
    clearError();

    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
    }, 1000);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      return;
    }

    setLoading(true);
    clearError();

    try {
      const formattedPhone = phoneNumber.startsWith('+') 
        ? phoneNumber 
        : `+91${phoneNumber.replace(/\D/g, '')}`;
      
      await signInWithPhone(formattedPhone, otp);
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setOtpSent(false);
    setOtp('');
    clearError();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        
        {/* Clean Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-xl font-bold">E</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h1>
          <p className="text-gray-600">Access your EcoVENDO dashboard</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 text-sm">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button onClick={clearError} className="text-red-400 hover:text-red-600 ml-2">×</button>
            </div>
          </div>
        )}

        {/* Auth Method Tabs */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setAuthMethod('google')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
              authMethod === 'google'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Google
          </button>
          <button
            onClick={() => setAuthMethod('phone')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
              authMethod === 'phone'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Phone
          </button>
        </div>

        {/* Google Authentication - Simple Button */}
        {authMethod === 'google' && (
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-5 h-5 mr-3">
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <span className="font-medium text-gray-700">
              {loading ? 'Signing in...' : 'Continue with Google'}
            </span>
          </button>
        )}

        {/* Phone Authentication - Send OTP */}
        {authMethod === 'phone' && !otpSent && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="9876543210"
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter any 10-digit mobile number for demo
              </p>
            </div>
            <button
              type="submit"
              disabled={loading || !phoneNumber.trim()}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {/* Phone Authentication - Verify OTP */}
        {authMethod === 'phone' && otpSent && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                maxLength="6"
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-lg tracking-widest"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                OTP sent to +91{phoneNumber}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-2 mt-2">
                <p className="text-xs text-blue-700 font-medium">
                  Demo OTP for all numbers: <strong>123456</strong>
                </p>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify & Sign In'}
            </button>
            <button
              type="button"
              onClick={handleBackToPhone}
              className="w-full text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              disabled={loading}
            >
              ← Back to phone number
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
