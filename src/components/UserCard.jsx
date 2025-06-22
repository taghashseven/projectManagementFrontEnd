import { useState, useRef, useEffect } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
//   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    // setIsOpen(false);
    // Optional: Redirect after logout
    navigate('/login');
  };

  const handleChangePassword = () => {
    console.log('Change password initiated');
    // Add password change logic here
    setIsOpen(false);
    // Optional: Open change password modal
  };

  

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="sr-only">Open user menu</span>
        <div className="flex items-center">
          {user?.avatar ? (
            <img 
              className="h-8 w-8 rounded-full" 
              src={user.avatar} 
              alt={`${user.name}'s avatar`}
            />
          ) : (
            <UserCircleIcon className="h-8 w-8 text-gray-500 hover:text-indigo-600 transition-colors" />
          )}
          <span className="ml-2 text-gray-700 hidden md:inline-block">
            {user?.name || 'Account'}
          </span>
        </div>
      </button>

      {isOpen && (
  <div 
    className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
    role="menu"
    aria-orientation="vertical"
    aria-labelledby="user-menu"
  >
    <div className="px-4 py-2 border-b border-gray-100">
      <p className="text-sm font-medium text-gray-900 truncate">
        {user?.name || 'User'}
      </p>
      <p className="text-xs text-gray-500 truncate">
        {user?.email || ''}
      </p>
    </div>

    <button
      onClick={() => {
        navigate('/settings');
        setIsOpen(false);
      }}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors"
      role="menuitem"
    >
      Settings
    </button>

    <button
      onClick={handleChangePassword}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors"
      role="menuitem"
    >
      Change Password
    </button>

    <button
      onClick={handleLogout}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors border-t border-gray-100"
      role="menuitem"
    >
      Sign out
    </button>
    <button
      onClick={() => {
        console.log("Manage Users");
        navigate('/users')
      }}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors border-t border-gray-100"
      role="menuitem"
    >
      Manage Users
    </button>
  </div>
)}

    </div>
  );
}