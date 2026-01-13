import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '../../utils/firebase';
import { FormInput } from '../../components/FormInput';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Success - user is signed in, redirect to home page (events list)
      navigate('/home');
    } catch (err: unknown) {
      // Handle errors
      let errorMessage = 'An error occurred during sign in';

      if (err && typeof err === 'object' && 'code' in err) {
        const errorCode = err.code as string;
        if (errorCode === 'auth/invalid-email') {
          errorMessage = 'Invalid email address';
        } else if (errorCode === 'auth/user-disabled') {
          errorMessage = 'This account has been disabled';
        } else if (errorCode === 'auth/user-not-found') {
          errorMessage = 'No account found with this email';
        } else if (errorCode === 'auth/wrong-password') {
          errorMessage = 'Incorrect password';
        } else if (errorCode === 'auth/invalid-credential') {
          errorMessage = 'Invalid email or password';
        } else if (errorCode === 'auth/too-many-requests') {
          errorMessage = 'Too many failed attempts. Please try again later';
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Success - user is signed in, redirect to home page
      navigate('/home');
    } catch (err: unknown) {
      // Handle errors
      let errorMessage = 'An error occurred during Google sign in';

      if (err && typeof err === 'object' && 'code' in err) {
        const errorCode = err.code as string;
        if (errorCode === 'auth/popup-closed-by-user') {
          errorMessage = 'Sign in was cancelled';
        } else if (errorCode === 'auth/popup-blocked') {
          errorMessage = 'Popup was blocked. Please allow popups and try again';
        } else if (
          errorCode === 'auth/account-exists-with-different-credential'
        ) {
          errorMessage =
            'An account already exists with this email using a different sign-in method';
        } else if (errorCode === 'auth/cancelled-popup-request') {
          errorMessage = 'Sign in was cancelled';
        }
      }

      setError(errorMessage);
    } finally {
      setIsGoogleLoading(false);
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
            Welcome Back
          </h1>
          <p className="text-white/60 text-center mb-8">
            Sign in to your account
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
              placeholder="Password"
              value={password}
              onChange={setPassword}
              className="w-full"
            />

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading || !email || !password}
              className={`w-full px-6 py-4 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl ${
                !isLoading && !isGoogleLoading && email && password
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                  : 'bg-white/10 text-white/50 border border-white/10 cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-white/60">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading || isGoogleLoading}
              className="mt-6 w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20 px-6 py-4 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/10 flex items-center justify-center gap-3"
            >
              {isGoogleLoading ? (
                'Signing in...'
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-white hover:text-white/80 underline font-medium transition-colors"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
