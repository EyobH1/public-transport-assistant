import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    notificationPreferences: {
      email: true,
      sms: false,
      push: true
    }
  });

  useEffect(() => {
    // Simulate fetching user data
    const userData = {
      id: 'user123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, City, Country',
      role: 'passenger',
      joinedDate: '2024-01-15',
      totalTrips: 24,
      favoriteRoutes: 3,
      verified: true
    };
    
    setUser(userData);
    setFormData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      notificationPreferences: {
        email: true,
        sms: false,
        push: true
      }
    });
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // Save logic here
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    // Reset form data
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      notificationPreferences: {
        email: true,
        sms: false,
        push: true
      }
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="loading-spinner">
        <div className="spinner-icon spinner-large">⟳</div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </div>
          <div className="avatar-status"></div>
        </div>
        
        <div className="profile-info">
          <h1>{user.firstName} {user.lastName}</h1>
          <p className="user-email">{user.email}</p>
          <div className="profile-badges">
            <span className="badge badge-primary">Passenger</span>
            {user.verified && <span className="badge badge-success">✓ Verified</span>}
            <span className="badge">Member since {new Date(user.joinedDate).getFullYear()}</span>
          </div>
        </div>
        
        <div className="profile-stats">
          <div className="stat">
            <div className="stat-number">{user.totalTrips}</div>
            <div className="stat-label">Trips</div>
          </div>
          <div className="stat">
            <div className="stat-number">{user.favoriteRoutes}</div>
            <div className="stat-label">Favorites</div>
          </div>
          <div className="stat">
            <div className="stat-number">89%</div>
            <div className="stat-label">On-time</div>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            👤 Personal Info
          </button>
          <button 
            className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            ⚙️ Preferences
          </button>
          <button 
            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            🔒 Security
          </button>
          <button 
            className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            📊 Activity
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'personal' && (
            <div className="personal-info">
              <div className="section-header">
                <h2>Personal Information</h2>
                {!isEditing && (
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveProfile}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="info-grid">
                  <div className="info-item">
                    <label>Full Name</label>
                    <p>{user.firstName} {user.lastName}</p>
                  </div>
                  <div className="info-item">
                    <label>Email Address</label>
                    <p>{user.email}</p>
                  </div>
                  <div className="info-item">
                    <label>Phone Number</label>
                    <p>{user.phone || 'Not provided'}</p>
                  </div>
                  <div className="info-item">
                    <label>Address</label>
                    <p>{user.address || 'Not provided'}</p>
                  </div>
                  <div className="info-item">
                    <label>Account Type</label>
                    <p>Passenger</p>
                  </div>
                  <div className="info-item">
                    <label>Member Since</label>
                    <p>{new Date(user.joinedDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="preferences-info">
              <h2>Preferences</h2>
              
              <div className="preference-section">
                <h3>Notification Preferences</h3>
                <div className="preference-options">
                  <div className="preference-item">
                    <div className="preference-info">
                      <h4>Email Notifications</h4>
                      <p>Receive updates about delays and news via email</p>
                    </div>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={formData.notificationPreferences.email}
                        onChange={(e) => setFormData({
                          ...formData,
                          notificationPreferences: {
                            ...formData.notificationPreferences,
                            email: e.target.checked
                          }
                        })}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="preference-item">
                    <div className="preference-info">
                      <h4>SMS Notifications</h4>
                      <p>Get text alerts for critical delays</p>
                    </div>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={formData.notificationPreferences.sms}
                        onChange={(e) => setFormData({
                          ...formData,
                          notificationPreferences: {
                            ...formData.notificationPreferences,
                            sms: e.target.checked
                          }
                        })}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="preference-item">
                    <div className="preference-info">
                      <h4>Push Notifications</h4>
                      <p>Real-time updates in your browser</p>
                    </div>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={formData.notificationPreferences.push}
                        onChange={(e) => setFormData({
                          ...formData,
                          notificationPreferences: {
                            ...formData.notificationPreferences,
                            push: e.target.checked
                          }
                        })}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="preference-section">
                <h3>Display Preferences</h3>
                <div className="form-group">
                  <label>Theme</label>
                  <select className="theme-select">
                    <option>Light</option>
                    <option>Dark</option>
                    <option>System Default</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Default Map View</label>
                  <select className="map-select">
                    <option>Standard</option>
                    <option>Satellite</option>
                    <option>Terrain</option>
                  </select>
                </div>
              </div>

              <button className="btn btn-primary">
                Save Preferences
              </button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="security-info">
              <h2>Security Settings</h2>
              
              <div className="security-section">
                <h3>Change Password</h3>
                <form className="password-form">
                  <div className="form-group">
                    <label>Current Password</label>
                    <input type="password" placeholder="Enter current password" />
                  </div>
                  
                  <div className="form-group">
                    <label>New Password</label>
                    <input type="password" placeholder="Enter new password" />
                  </div>
                  
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input type="password" placeholder="Confirm new password" />
                  </div>
                  
                  <button type="submit" className="btn btn-primary">
                    Update Password
                  </button>
                </form>
              </div>

              <div className="security-section">
                <h3>Two-Factor Authentication</h3>
                <div className="two-factor-info">
                  <p>Add an extra layer of security to your account</p>
                  <button className="btn btn-secondary">
                    Enable 2FA
                  </button>
                </div>
              </div>

              <div className="security-section">
                <h3>Active Sessions</h3>
                <div className="sessions-list">
                  <div className="session-item">
                    <div className="session-info">
                      <h4>Current Session</h4>
                      <p>Chrome • Windows • Just now</p>
                    </div>
                    <span className="session-status active">Active</span>
                  </div>
                  
                  <div className="session-item">
                    <div className="session-info">
                      <h4>Mobile App</h4>
                      <p>Safari • iOS • 2 hours ago</p>
                    </div>
                    <button className="btn-logout-session">
                      Logout
                    </button>
                  </div>
                </div>
              </div>

              <div className="security-section danger-zone">
                <h3>Danger Zone</h3>
                <div className="danger-actions">
                  <button className="btn btn-danger">
                    Deactivate Account
                  </button>
                  <button className="btn btn-danger">
                    Delete Account
                  </button>
                </div>
                <p className="danger-warning">
                  ⚠️ These actions are irreversible. Please proceed with caution.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="activity-info">
              <h2>Account Activity</h2>
              
              <div className="activity-stats">
                <div className="stat-card">
                  <div className="stat-icon">📅</div>
                  <div className="stat-info">
                    <h3>24</h3>
                    <p>Total Trips</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-info">
                    <h3>3</h3>
                    <p>Favorite Routes</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">⚠️</div>
                  <div className="stat-info">
                    <h3>5</h3>
                    <p>Reports Submitted</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">⏱️</div>
                  <div className="stat-info">
                    <h3>156</h3>
                    <p>Hours Traveled</p>
                  </div>
                </div>
              </div>

              <div className="recent-activity">
                <h3>Recent Activity</h3>
                <div className="activity-timeline">
                  <div className="timeline-item">
                    <div className="timeline-dot success"></div>
                    <div className="timeline-content">
                      <p><strong>Reported delay</strong> on Route 101</p>
                      <span className="timeline-time">2 hours ago</span>
                    </div>
                  </div>
                  
                  <div className="timeline-item">
                    <div className="timeline-dot primary"></div>
                    <div className="timeline-content">
                      <p><strong>Added Route T1</strong> to favorites</p>
                      <span className="timeline-time">Yesterday</span>
                    </div>
                  </div>
                  
                  <div className="timeline-item">
                    <div className="timeline-dot warning"></div>
                    <div className="timeline-content">
                      <p><strong>Upvoted delay report</strong> on Route 202</p>
                      <span className="timeline-time">2 days ago</span>
                    </div>
                  </div>
                  
                  <div className="timeline-item">
                    <div className="timeline-dot success"></div>
                    <div className="timeline-content">
                      <p><strong>Completed trip</strong> on Route 101</p>
                      <span className="timeline-time">3 days ago</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="export-section">
                <h3>Export Data</h3>
                <p>Download your trip history and activity logs</p>
                <div className="export-buttons">
                  <button className="btn btn-secondary">
                    📥 Export Trip History (CSV)
                  </button>
                  <button className="btn btn-secondary">
                    📥 Export Activity Logs (JSON)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Profile;