import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';
// import { updateProfile } from '../features/auth/authSlice';

// Icons
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  UserCircleIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PencilIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const { user } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Only validate passwords if they're being changed
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }
      if (formData.newPassword.length > 0 && formData.newPassword.length < 6) {
        newErrors.newPassword = 'Password must be at least 6 characters';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      const updateData = {
        name: formData.name,
        email: formData.email
      };
      
      // Only include password fields if they're being changed
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }
      
      // await dispatch(updateProfile(updateData)).unwrap();
      
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      // Handle server-side errors
      console.error('Update failed:', err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      {/* Header */}
      <div className={`shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-gray-500'} mr-4`}
              aria-label="Back"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Account Settings
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'}`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className={`h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
              </div>
              <div className="ml-3">
                <p className={`text-sm ${darkMode ? 'text-green-200' : 'text-green-700'}`}>
                  {successMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationCircleIcon className={`h-5 w-5 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
              </div>
              <div className="ml-3">
                <p className={`text-sm ${darkMode ? 'text-red-200' : 'text-red-700'}`}>
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className={`rounded-lg shadow-sm overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
            {/* Profile Section */}
            <div className="px-6 py-5">
              <div className="flex items-center justify-between">
                <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Profile Information
                </h2>
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className={`inline-flex items-center px-3 py-1.5 border shadow-sm text-sm font-medium rounded-md ${
                      darkMode 
                        ? 'border-gray-600 text-gray-200 bg-gray-700 hover:bg-gray-600' 
                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <PencilIcon className="-ml-1 mr-1 h-4 w-4" />
                    Edit
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className={`inline-flex items-center px-3 py-1.5 border shadow-sm text-sm font-medium rounded-md ${
                      darkMode 
                        ? 'border-gray-600 text-gray-200 bg-gray-700 hover:bg-gray-600' 
                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <XMarkIcon className="-ml-1 mr-1 h-4 w-4" />
                    Cancel
                  </button>
                )}
              </div>

              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="name" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Full name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCircleIcon className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`block w-full pl-10 sm:text-sm rounded-md ${
                        isEditing 
                          ? darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                            : 'border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                          : darkMode 
                            ? 'bg-gray-800 border-transparent text-gray-400' 
                            : 'bg-gray-50 border-transparent text-gray-500'
                      } ${errors.name ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : ''}`}
                    />
                  </div>
                  {errors.name && (
                    <p className={`mt-2 text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="email" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`block w-full pl-10 sm:text-sm rounded-md ${
                        isEditing 
                          ? darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                            : 'border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                          : darkMode 
                            ? 'bg-gray-800 border-transparent text-gray-400' 
                            : 'bg-gray-50 border-transparent text-gray-500'
                      } ${errors.email ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <p className={`mt-2 text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="px-6 py-5">
              <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Change Password
              </h2>
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Leave these fields blank if you don't want to change your password.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="currentPassword" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Current password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="password"
                      name="currentPassword"
                      id="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`block w-full pl-10 sm:text-sm rounded-md ${
                        isEditing 
                          ? darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                            : 'border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                          : darkMode 
                            ? 'bg-gray-800 border-transparent text-gray-400' 
                            : 'bg-gray-50 border-transparent text-gray-500'
                      } ${errors.currentPassword ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : ''}`}
                    />
                  </div>
                  {errors.currentPassword && (
                    <p className={`mt-2 text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                      {errors.currentPassword}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="newPassword" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    New password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`block w-full pl-10 sm:text-sm rounded-md ${
                        isEditing 
                          ? darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                            : 'border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                          : darkMode 
                            ? 'bg-gray-800 border-transparent text-gray-400' 
                            : 'bg-gray-50 border-transparent text-gray-500'
                      } ${errors.newPassword ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : ''}`}
                    />
                  </div>
                  {errors.newPassword && (
                    <p className={`mt-2 text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="confirmPassword" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Confirm new password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`block w-full pl-10 sm:text-sm rounded-md ${
                        isEditing 
                          ? darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                            : 'border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                          : darkMode 
                            ? 'bg-gray-800 border-transparent text-gray-400' 
                            : 'bg-gray-50 border-transparent text-gray-500'
                      } ${errors.confirmPassword ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : ''}`}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className={`mt-2 text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            {isEditing && (
              <div className={`px-6 py-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} text-right`}>
                <button
                  type="button"
                  onClick={handleCancel}
                  className={`py-2 px-4 border rounded-md shadow-sm text-sm font-medium ${
                    darkMode 
                      ? 'border-gray-600 text-gray-200 bg-gray-700 hover:bg-gray-600' 
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                    darkMode 
                      ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' 
                      : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}