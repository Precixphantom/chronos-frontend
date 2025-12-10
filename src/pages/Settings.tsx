/* eslint-disable @typescript-eslint/no-explicit-any */
import { deleteAccount } from '@/services/deleteAccount';
import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import axios from 'axios';

const Settings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch current setting from backend on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/settings/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEmailNotifications(response.data.emailNotifications);
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const toggleNotifications = async () => {
  setLoading(true);
  const newValue = !emailNotifications;
  
  try {
    const token = localStorage.getItem('token');
    
    console.log('🔍 Sending request with value:', newValue);
    
    const response = await axios.post(
      '/api/settings/notifications', 
      { emailNotifications: newValue },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('Response:', response.data);

    if (response.data.success) {
      setEmailNotifications(newValue);
      localStorage.setItem('emailNotifications', JSON.stringify(newValue));
    }
  } catch (err: any) {
    console.error('Full error:', err);
    console.error('Response data:', err.response?.data);
    alert(`Failed to update settings: ${err.response?.data?.message || err.message}`);
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    try {
      await deleteAccount();
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-3xl font-bold mb-8">Settings</h1>

          {/* Email Notifications Toggle */}
          <div className="bg-white rounded-lg shadow p-6 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {emailNotifications ? (
                  <Bell className="text-blue-600" size={24} />
                ) : (
                  <BellOff className="text-gray-400" size={24} />
                )}
                <div>
                  <h3 className="font-semibold text-lg">Email Notifications</h3>
                  <p className="text-gray-600 text-sm">
                    Receive updates and notifications via email
                  </p>
                </div>
              </div>

              <button
                onClick={toggleNotifications}
                disabled={loading}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Delete Account Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Trash2 className="text-red-600" size={24} />
                <div>
                  <h3 className="font-semibold text-lg">Delete Account</h3>
                  <p className="text-gray-600 text-sm">
                    Permanently delete your account and all data
                  </p>
                </div>
              </div>

              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Current Status Display */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Email notifications:{' '}
              <span className="font-semibold">
                {emailNotifications ? 'Enabled' : 'Disabled'}
              </span>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Settings;