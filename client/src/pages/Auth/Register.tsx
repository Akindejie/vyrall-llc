import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../utils/firebase';
import { FormInput } from '../../components/FormInput';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Success - user is registered and signed in, redirect to home page
      navigate('/home');
    } catch (err: unknown) {
      // Handle errors
      let errorMessage = 'An error occurred during registration';

      if (err && typeof err === 'object' && 'code' in err) {
        const errorCode = err.code as string;
        if (errorCode === 'auth/email-already-in-use') {
          errorMessage = 'An account with this email already exists';
        } else if (errorCode === 'auth/invalid-email') {
          errorMessage = 'Invalid email address';
        } else if (errorCode === 'auth/operation-not-allowed') {
          errorMessage = 'Email/password accounts are not enabled';
        } else if (errorCode === 'auth/weak-password') {
          errorMessage =
            'Password is too weak. Please choose a stronger password';
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-8">
        <Link
          to="/"
          className="text-4xl font-bold text-white font-display tracking-tight hover:text-white/80 transition-colors"
        >
          let's hang
        </Link>
      </div>
      <div className="w-full max-w-md">
        <div className="bg-black/20 backdrop-blur-sm rounded-3xl border border-white/20 p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            Create Account
          </h1>
          <p className="text-white/60 text-center mb-8">
            Sign up to get started
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              icon="✉️"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={setEmail}
              className="w-full"
            />

            <FormInput
              icon="🔒"
              type="password"
              placeholder="Password (min. 6 characters)"
              value={password}
              onChange={setPassword}
              className="w-full"
            />

            <FormInput
              icon="🔒"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              className="w-full"
            />

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email || !password || !confirmPassword}
              className={`w-full px-6 py-4 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl ${
                !isLoading && email && password && confirmPassword
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                  : 'bg-white/10 text-white/50 border border-white/10 cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-white hover:text-white/80 underline font-medium transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
