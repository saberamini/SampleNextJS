'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  image: string | null;
  createdAt: string;
  _count: {
    ownedProjects: number;
    memberships: number;
    tasks: number;
  };
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/protected/user');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFormData((prev) => ({
          ...prev,
          firstName: data.firstName,
          lastName: data.lastName,
        }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    // Validate password confirmation
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setIsSaving(false);
      return;
    }

    try {
      const updateData: {
        firstName: string;
        lastName: string;
        currentPassword?: string;
        newPassword?: string;
      } = {
        firstName: formData.firstName,
        lastName: formData.lastName,
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await fetch('/api/protected/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update session with new name
      await update({
        user: {
          ...session?.user,
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
      });

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              firstName: formData.firstName,
              lastName: formData.lastName,
            }
          : null
      );

      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setIsEditing(false);
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'An error occurred',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="mt-1 text-gray-600">Manage your account settings</p>
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-2xl font-bold text-primary-700">
            {profile.firstName[0]}
            {profile.lastName[0]}
          </div>
          <div className="ml-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-gray-500">{profile.email}</p>
            <span className="inline-block mt-2 px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-full">
              {profile.role}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 py-4 border-y">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {profile._count.ownedProjects}
            </p>
            <p className="text-sm text-gray-500">Projects Owned</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {profile._count.memberships}
            </p>
            <p className="text-sm text-gray-500">Team Memberships</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {profile._count.tasks}
            </p>
            <p className="text-sm text-gray-500">Tasks Assigned</p>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Member since {new Date(profile.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Edit profile form */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Edit
            </button>
          )}
        </div>

        {message.text && (
          <div
            className={`mb-4 px-4 py-3 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-green-50 text-green-600'
                : 'bg-red-50 text-red-600'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                disabled={!isEditing}
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                required
                disabled={!isEditing}
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              disabled
              value={profile.email}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>

          {isEditing && (
            <>
              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-4">
                  Change Password (optional)
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, currentPassword: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, newPassword: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      firstName: profile.firstName,
                      lastName: profile.lastName,
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    });
                    setMessage({ type: '', text: '' });
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
