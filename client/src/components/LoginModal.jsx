import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';
import toast from 'react-hot-toast';

const LoginModal = ({ onClose }) => {

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Login successful");

      if (onClose) onClose(); // modal close
      window.location.reload(); // refresh to update UI
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Login failed. Try again.");
    }
  };

  return (
    <div className='fixed top-0 left-0 w-full h-full bg-black/70 z-50 flex items-center justify-center'>
      <div className='bg-white text-black p-6 rounded-xl w-80'>
        <h2 className='text-xl font-semibold mb-4'>Login</h2>

        <button
          onClick={handleGoogleLogin}
          className='w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition'
        >
          Continue with Google
        </button>

        <button
          onClick={onClose}
          className='mt-4 w-full text-sm text-gray-600 hover:text-black'
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LoginModal;