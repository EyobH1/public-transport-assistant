import React from 'react';
import { Link } from 'react-router-dom';
import './AdminPages.css';

const AdminDashboard = () => {
  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <p className="subtitle">Transport Assistant Administration Panel</p>
      
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">🚌</div>
          <div className="stat-info">
            <h3>24</h3>
            <p>Active Routes</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3>8</h3>
            <p>Pending Reports</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>156</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <h3>89%</h3>
            <p>On-time Rate</p>
          </div>
        </div>
      </div>

      <div className="admin-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/admin/routes" className="action-card">
            <div className="action-icon">➕</div>
            <h3>Add New Route</h3>
            <p>Create a new transport route</p>
          </Link>
          
          <Link to="/admin/delays" className="action-card">
            <div className="action-icon">⚠️</div>
            <h3>Manage Delays</h3>
            <p>Review delay reports</p>
          </Link>
          
          <div className="action-card">
            <div className="action-icon">📊</div>
            <h3>View Analytics</h3>
            <p>System performance data</p>
          </div>
          
          <div className="action-card">
            <div className="action-icon">👥</div>
            <h3>User Management</h3>
            <p>Manage user accounts</p>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">⚠️</div>
            <div className="activity-content">
              <p><strong>New delay report</strong> on Route 101</p>
              <span className="activity-time">10 minutes ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">👤</div>
            <div className="activity-content">
              <p><strong>New user registered:</strong> john@example.com</p>
              <span className="activity-time">30 minutes ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">🚌</div>
            <div className="activity-content">
              <p><strong>Route 202 schedule updated</strong></p>
              <span className="activity-time">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;