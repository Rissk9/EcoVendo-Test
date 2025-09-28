import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await createUserProfile(user);
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const createUserProfile = async (user) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Determine if this is a phone user (email contains 'phone.demo')
        const isPhoneUser = user.email && user.email.includes('phone.demo');
        const phoneNumber = isPhoneUser ? user.email.replace('@phone.demo', '') : null;
        
        await setDoc(userRef, {
          uid: user.uid,
          displayName: isPhoneUser ? `Phone User ${phoneNumber.slice(-4)}` : (user.displayName || 'User'),
          email: isPhoneUser ? null : user.email,
          phoneNumber: isPhoneUser ? `+${phoneNumber}` : null,
          photoURL: user.photoURL || null,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          role: 'organizer',
          authMethod: isPhoneUser ? 'phone' : 'google'
        });
      } else {
        await setDoc(userRef, {
          lastLoginAt: new Date().toISOString()
        }, { merge: true });
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  };

  // Google Sign In
  const signInWithGoogle = async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError('Google sign-in failed. Please try again.');
      throw error;
    }
  };

  // Universal Phone Auth - Same OTP for all numbers (Demo)
  const signInWithPhone = async (phoneNumber, otp) => {
    setError(null);
    try {
      // Universal OTP for demo - same for all phone numbers
      if (otp !== '123456') {
        throw new Error('Invalid OTP. Use 123456 (universal demo OTP).');
      }

      // Create unique email for this phone number
      const cleanPhone = phoneNumber.replace(/\D/g, ''); // Remove all non-digits
      const phoneEmail = `${cleanPhone}@phone.demo`;
      const phonePassword = 'demo123456';

      try {
        // Try to create new user first
        const result = await createUserWithEmailAndPassword(auth, phoneEmail, phonePassword);
        console.log('Created new phone user:', result.user.uid);
        return result.user;
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          // User exists, sign them in
          console.log('Phone user exists, signing in...');
          const result = await signInWithEmailAndPassword(auth, phoneEmail, phonePassword);
          return result.user;
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Phone sign-in error:', error);
      setError(error.message || 'Phone sign-in failed. Please try again.');
      throw error;
    }
  };

  // Sign Out
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to log out. Please try again.');
      throw error;
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    signInWithGoogle,
    signInWithPhone,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
