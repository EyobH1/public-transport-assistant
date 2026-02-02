/*import React from 'react';
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

export default AdminDashboard;*/

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RouteAnalytics from '../../components/Analytics/RouteAnalytics';
import './AdminPages.css';

const AdminDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch analytics data
    const fetchAnalytics = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setAnalyticsData({
            totalRoutes: 24,
            totalPassengers: '1,240',
            avgDelay: 12,
            onTimeRate: '89%',
            popularRoutes: [
              { routeNumber: '101', name: 'Downtown Express', tripCount: 156 },
              { routeNumber: 'T1', name: 'Red Metro Line', tripCount: 128 },
              { routeNumber: '202', name: 'University Line', tripCount: 95 },
              { routeNumber: '45', name: 'Airport Express', tripCount: 78 },
              { routeNumber: '33', name: 'Beach Line', tripCount: 65 },
            ],
            delayTrends: [15, 12, 18, 20, 25, 8, 10],
            reportTrends: [24, 20, 28, 32, 40, 15, 18],
            transportDistribution: [65, 25, 10],
            peakHours: [120, 450, 280, 320, 240, 380, 420, 280, 150],
            topDelayedRoutes: [
              { routeNumber: '101', name: 'Downtown Express', delayCount: 24 },
              { routeNumber: 'T1', name: 'Red Metro Line', delayCount: 18 },
              { routeNumber: '202', name: 'University Line', delayCount: 12 },
            ],
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="subtitle">Transport Assistant Administration Panel</p>
        </div>
        
        <div className="admin-actions">
          <button className="btn btn-secondary">
            📊 Export Report
          </button>
          <button className="btn btn-primary">
            🔄 Refresh Data
          </button>
        </div>
      </div>

      {/* Quick Stats */}
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

      {/* Analytics Section */}
      <div className="analytics-section">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner-icon spinner-large">⟳</div>
            <p>Loading analytics...</p>
          </div>
        ) : (
          <RouteAnalytics data={analyticsData} />
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
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
          
          <Link to="/admin/analytics" className="action-card">
            <div className="action-icon">📊</div>
            <h3>Advanced Analytics</h3>
            <p>Detailed performance metrics</p>
          </Link>
          
          <div className="action-card">
            <div className="action-icon">👥</div>
            <h3>User Management</h3>
            <p>Manage user accounts</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
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
          <div className="activity-item">
            <div className="activity-icon">⭐</div>
            <div className="activity-content">
              <p><strong>Route T1 added to 12 favorites</strong></p>
              <span className="activity-time">3 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;