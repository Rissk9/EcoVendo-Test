// src/UserProfile.js - NEW FILE
import React from 'react';
import { useAuth } from './AuthContext';

const UserProfile = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900">
              {user.displayName || 'Anonymous User'}
            </p>
            <p className="text-sm text-gray-500">
              {user.email || user.phoneNumber || 'No contact info'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1 rounded border border-red-200 hover:border-red-300 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;