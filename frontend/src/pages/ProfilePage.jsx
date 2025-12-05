import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';
import { 
  HiSparkles, 
  HiChartBar, 
  HiFire, 
  HiGift,
  HiAcademicCap,
  HiUserCircle
} from 'react-icons/hi2';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    full_name: user?.full_name || '',
    language_preference: user?.language_preference || 'en'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await api.put('/auth/profile', formData);
      updateUser(response.data.user);
      setEditing(false);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>Profile</h2>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          <div className="avatar-circle">
            <HiUserCircle className="avatar-icon" />
          </div>
        </div>

        {message && (
          <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="profile-form">
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={user?.email || ''} disabled />
            <small>Email cannot be changed</small>
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>

          <div className="form-group">
            <label>Language Preference</label>
            <select
              name="language_preference"
              value={formData.language_preference}
              onChange={handleChange}
              disabled={!editing}
            >
              <option value="en">English</option>
              <option value="ar">Arabic</option>
            </select>
          </div>

          <div className="profile-actions">
            {!editing ? (
              <button className="btn-edit" onClick={() => setEditing(true)}>
                Edit Profile
              </button>
            ) : (
              <>
                <button className="btn-cancel" onClick={() => {
                  setEditing(false);
                  setFormData({
                    username: user?.username || '',
                    full_name: user?.full_name || '',
                    language_preference: user?.language_preference || 'en'
                  });
                }}>
                  Cancel
                </button>
                <button className="btn-save" onClick={handleSave} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="profile-stats">
          <h3>Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <HiSparkles className="stat-icon" />
              <span className="stat-label">Total XP</span>
              <span className="stat-value">{user?.total_xp || 0}</span>
            </div>
            <div className="stat-item">
              <HiChartBar className="stat-icon" />
              <span className="stat-label">Level</span>
              <span className="stat-value">{user?.level_number || 1}</span>
            </div>
            <div className="stat-item">
              <HiFire className="stat-icon" />
              <span className="stat-label">Current Streak</span>
              <span className="stat-value">{user?.current_streak || 0} days</span>
            </div>
            <div className="stat-item">
              <HiFire className="stat-icon" />
              <span className="stat-label">Longest Streak</span>
              <span className="stat-value">{user?.longest_streak || 0} days</span>
            </div>
            <div className="stat-item">
              <HiGift className="stat-icon" />
              <span className="stat-label">Gems</span>
              <span className="stat-value">{user?.gems || 0}</span>
            </div>
            <div className="stat-item">
              <HiAcademicCap className="stat-icon" />
              <span className="stat-label">Current Level</span>
              <span className="stat-value">{user?.current_level || 'A1'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
