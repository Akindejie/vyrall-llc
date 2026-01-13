import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { userState } from '../store/atoms';

type CurrentPage = 'home' | 'people' | 'search' | null;

interface HeaderProps {
  currentPage?: CurrentPage;
}

export const Header: React.FC<HeaderProps> = ({ currentPage = null }) => {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const setUser = useSetRecoilState(userState);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-8">
        <Link
          to="/home"
          className="text-3xl font-bold text-white font-display tracking-tight hover:text-white/80 transition-colors"
        >
          let's hang
        </Link>
        <div className="flex items-center gap-4">
          {currentPage === 'home' ? (
            <span className="text-white font-bold">Home</span>
          ) : (
            <Link
              to="/home"
              className="text-white/70 hover:text-white transition-colors"
            >
              Home
            </Link>
          )}
          {currentPage === 'people' ? (
            <span className="text-white font-bold">People</span>
          ) : (
            <Link
              to="/people"
              className="text-white/70 hover:text-white transition-colors"
            >
              People
            </Link>
          )}
          {currentPage === 'search' ? (
            <span className="text-white font-bold">Search</span>
          ) : (
            <Link
              to="/search"
              className="text-white/70 hover:text-white transition-colors"
            >
              Search
            </Link>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-white/80 text-sm">{user.email}</span>
            <button
              onClick={handleLogout}
              className="px-6 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={handleSignIn}
            className="px-6 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            Sign in
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
