import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [recentRoutes, setRecentRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    const userData = JSON.parse(localStorage.getItem('user')) || {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    };
    setUser(userData);

    // Fetch recent routes
    const fetchRecentRoutes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/routes?limit=3');
        const data = await response.json();
        if (data.success) {
          setRecentRoutes(data.routes.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching routes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentRoutes();
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-icon spinner-large">⟳</div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.firstName}!</h1>
        <p className="subtitle">Your public transport dashboard</p>
      </div>

      <div className="dashboard-grid">
        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/routes" className="action-card">
              <div className="action-icon">🔍</div>
              <h3>Search Routes</h3>
              <p>Find the best route for your journey</p>
            </Link>
            
            <Link to="/map" className="action-card">
              <div className="action-icon">🗺️</div>
              <h3>View Map</h3>
              <p>Interactive transport map</p>
            </Link>
            
            <Link to="/delays" className="action-card">
              <div className="action-icon">⚠️</div>
              <h3>Delay Reports</h3>
              <p>Check or report delays</p>
            </Link>
            
            <Link to="/favorites" className="action-card">
              <div className="action-icon">⭐</div>
              <h3>Favorites</h3>
              <p>Your saved routes</p>
            </Link>
          </div>
        </div>

        {/* Recent Routes */}
        <div className="recent-routes">
          <h2>Recently Viewed Routes</h2>
          {recentRoutes.length > 0 ? (
            <div className="routes-list">
              {recentRoutes.map(route => (
                <div key={route._id} className="route-card-mini">
                  <div className="route-mini-header">
                    <span className="route-badge-mini" style={{ 
                      backgroundColor: route.transportType === 'bus' ? '#10b981' : 
                                     route.transportType === 'train' ? '#ef4444' : '#8b5cf6'
                    }}>
                      {route.routeNumber}
                    </span>
                    <h4>{route.name}</h4>
                  </div>
                  <p className="route-type">{route.transportType}</p>
                  <div className="route-mini-stops">
                    {route.stops?.slice(0, 3).map((stop, idx) => (
                      <span key={idx} className="stop-tag">{stop.name}</span>
                    ))}
                    {route.stops?.length > 3 && (
                      <span className="more-stops">+{route.stops.length - 3} more</span>
                    )}
                  </div>
                  <Link to={`/routes/${route._id}`} className="btn btn-sm btn-secondary">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No recent routes found. Start by searching for routes!</p>
          )}
        </div>

        {/* Statistics */}
        <div className="user-stats">
          <h2>Your Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🚌</div>
              <div className="stat-info">
                <h3>24</h3>
                <p>Routes Used</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-info">
                <h3>156</h3>
                <p>Hours Saved</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <h3>$245</h3>
                <p>Money Saved</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🌱</div>
              <div className="stat-info">
                <h3>45kg</h3>
                <p>CO₂ Reduced</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Search */}
        <div className="quick-search-widget">
          <h2>Plan Your Journey</h2>
          <form className="search-widget-form">
            <div className="form-group">
              <label>From</label>
              <input type="text" placeholder="Current location" />
            </div>
            <div className="form-group">
              <label>To</label>
              <input type="text" placeholder="Destination" />
            </div>
            <button type="submit" className="btn btn-primary">
              Find Route
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;