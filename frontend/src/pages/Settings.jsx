import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserSettings, updateProfile, updatePassword } from '../store/slices/settingsSlice';

const Settings = () => {
  const dispatch = useDispatch();
  const { user, loading, error, message } = useSelector((state) => state.settings) || {};

  // Use 'username' instead of 'name'
  const [profile, setProfile] = useState({
    username: '',
    email: ''
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: ''
  });

  useEffect(() => {
    dispatch(getUserSettings());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setProfile({
        username: user.username || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    dispatch(updateProfile(profile));
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    dispatch(updatePassword(passwords));
    setPasswords({ currentPassword: '', newPassword: '' });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="font-semibold text-lg mb-6">Settings</h3>

      {loading && <p className="mb-4 text-blue-600">Processing...</p>}
      {error && <p className="mb-4 text-red-600">{error}</p>}
      {message && <p className="mb-4 text-green-600">{message}</p>}

      <div className="space-y-6">
        {/* Profile Information Section */}
        <div>
          <h4 className="font-medium mb-3">Profile Information</h4>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={profile.username ?? ''}
                onChange={handleProfileChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={profile.email ?? ''}
                onChange={handleProfileChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
              />
            </div>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Update Profile
            </button>
          </form>
        </div>

        {/* Change Password Section */}
        <div>
          <h4 className="font-medium mb-3">Change Password</h4>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="currentPassword">
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                name="currentPassword"
                value={passwords.currentPassword ?? ''}
                onChange={handlePasswordChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="newPassword">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                name="newPassword"
                value={passwords.newPassword ?? ''}
                onChange={handlePasswordChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;