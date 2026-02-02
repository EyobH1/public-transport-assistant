import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Favorites.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [tripHistory, setTripHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('favorites');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data
    fetchFavorites();
    fetchTripHistory();
  }, []);

  const fetchFavorites = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        setFavorites([
          {
            _id: '1',
            routeId: { _id: '101', routeNumber: '101', name: 'Downtown Express', transportType: 'bus' },
            addedAt: new Date(Date.now() - 86400000).toISOString(),
            note: 'Daily commute route'
          },
          {
            _id: '2',
            routeId: { _id: 'T1', routeNumber: 'T1', name: 'Red Metro Line', transportType: 'train' },
            addedAt: new Date(Date.now() - 172800000).toISOString(),
            note: 'Weekend trips'
          },
          {
            _id: '3',
            routeId: { _id: '202', routeNumber: '202', name: 'University Line', transportType: 'bus' },
            addedAt: new Date(Date.now() - 259200000).toISOString()
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setLoading(false);
    }
  };

  const fetchTripHistory = async () => {
    // Sample trip history data
    setTripHistory([
      {
        _id: '1',
        routeNumber: '101',
        routeName: 'Downtown Express',
        startStop: 'Central Station',
        endStop: 'Financial District',
        scheduledTime: new Date(Date.now() - 7200000).toISOString(),
        actualTime: new Date(Date.now() - 6840000).toISOString(),
        duration: 40,
        status: 'completed',
        delayMinutes: 5
      },
      {
        _id: '2',
        routeNumber: 'T1',
        routeName: 'Red Metro Line',
        startStop: 'North Terminal',
        endStop: 'Times Square',
        scheduledTime: new Date(Date.now() - 86400000).toISOString(),
        actualTime: new Date(Date.now() - 86100000).toISOString(),
        duration: 25,
        status: 'completed',
        delayMinutes: -2
      },
      {
        _id: '3',
        routeNumber: '202',
        routeName: 'University Line',
        startStop: 'University Campus',
        endStop: 'Student Union',
        scheduledTime: new Date(Date.now() - 172800000).toISOString(),
        actualTime: null,
        duration: null,
        status: 'cancelled',
        delayMinutes: null
      }
    ]);
  };

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      // API call to remove favorite
      setFavorites(favorites.filter(fav => fav._id !== favoriteId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const getTransportIcon = (type) => {
    switch(type) {
      case 'bus': return '🚌';
      case 'train': return '🚆';
      case 'tram': return '🚋';
      default: return '🚍';
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return '#10b981';
      case 'in_progress': return '#3b82f6';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-icon spinner-large">⟳</div>
        <p>Loading your favorites...</p>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>Your Journey</h1>
        <p className="subtitle">Manage your favorite routes and view trip history</p>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <span className="tab-icon">⭐</span>
            Favorites ({favorites.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <span className="tab-icon">📅</span>
            Trip History ({tripHistory.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <span className="tab-icon">📊</span>
            Statistics
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'favorites' && (
            <div className="favorites-content">
              {favorites.length > 0 ? (
                <div className="favorites-grid">
                  {favorites.map(favorite => (
                    <div key={favorite._id} className="favorite-card">
                      <div className="favorite-header">
                        <div className="favorite-badge">
                          <span className="transport-icon">
                            {getTransportIcon(favorite.routeId.transportType)}
                          </span>
                          <span className="route-number">{favorite.routeId.routeNumber}</span>
                        </div>
                        
                        <button 
                          className="btn-remove"
                          onClick={() => handleRemoveFavorite(favorite._id)}
                          title="Remove from favorites"
                        >
                          ✕
                        </button>
                      </div>

                      <h3>{favorite.routeId.name}</h3>
                      <p className="route-type">{favorite.routeId.transportType}</p>
                      
                      {favorite.note && (
                        <div className="favorite-note">
                          <span className="note-icon">📝</span>
                          <p>{favorite.note}</p>
                        </div>
                      )}

                      <div className="favorite-meta">
                        <span className="added-date">
                          Added {formatDate(favorite.addedAt)}
                        </span>
                      </div>

                      <div className="favorite-actions">
                        <Link 
                          to={`/routes/${favorite.routeId._id}`}
                          className="btn btn-primary btn-sm"
                        >
                          View Route
                        </Link>
                        <Link 
                          to="/map"
                          className="btn btn-secondary btn-sm"
                        >
                          View on Map
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">⭐</div>
                  <h3>No favorites yet</h3>
                  <p>Start by exploring routes and adding your frequent ones to favorites!</p>
                  <div className="empty-actions">
                    <Link to="/routes" className="btn btn-primary">
                      Explore Routes
                    </Link>
                    <Link to="/map" className="btn btn-secondary">
                      View Map
                    </Link>
                  </div>
                </div>
              )}

              <div className="favorites-tips">
                <h4>💡 Tips for Using Favorites</h4>
                <ul>
                  <li>Add routes you use frequently for quick access</li>
                  <li>Use notes to remember specific details about each route</li>
                  <li>Favorites sync across all your devices when logged in</li>
                  <li>Get notifications for delays on your favorite routes</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="history-content">
              {tripHistory.length > 0 ? (
                <div className="history-table">
                  <div className="table-header">
                    <div>Route</div>
                    <div>Journey</div>
                    <div>Scheduled</div>
                    <div>Actual</div>
                    <div>Delay</div>
                    <div>Status</div>
                  </div>

                  {tripHistory.map(trip => (
                    <div key={trip._id} className="table-row">
                      <div className="route-cell">
                        <div className="route-badge-small">{trip.routeNumber}</div>
                        <div className="route-info">
                          <strong>{trip.routeName}</strong>
                          <span>{trip.startStop} → {trip.endStop}</span>
                        </div>
                      </div>
                      
                      <div className="journey-cell">
                        <div className="stop-line">
                          <div className="stop-circle start"></div>
                          <div className="stop-line-connector"></div>
                          <div className="stop-circle end"></div>
                        </div>
                        <div className="stop-names">
                          <span>{trip.startStop}</span>
                          <span>{trip.endStop}</span>
                        </div>
                      </div>
                      
                      <div className="time-cell">
                        {formatTime(trip.scheduledTime)}
                        <span className="time-date">{formatDate(trip.scheduledTime)}</span>
                      </div>
                      
                      <div className="time-cell">
                        {trip.actualTime ? formatTime(trip.actualTime) : '--:--'}
                        {trip.actualTime && (
                          <span className="time-date">{formatDate(trip.actualTime)}</span>
                        )}
                      </div>
                      
                      <div className="delay-cell">
                        {trip.delayMinutes !== null && trip.delayMinutes !== undefined ? (
                          <span className={`delay-badge ${
                            trip.delayMinutes > 0 ? 'delayed' : 
                            trip.delayMinutes < 0 ? 'early' : 'on-time'
                          }`}>
                            {trip.delayMinutes > 0 ? '+' : ''}{trip.delayMinutes} min
                          </span>
                        ) : '--'}
                      </div>
                      
                      <div className="status-cell">
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(trip.status) }}
                        >
                          {trip.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📅</div>
                  <h3>No trip history</h3>
                  <p>Your trip history will appear here as you use the app to plan journeys.</p>
                  <Link to="/routes" className="btn btn-primary">
                    Plan a Journey
                  </Link>
                </div>
              )}

              <div className="history-stats">
                <div className="stat-summary">
                  <h4>Trip Summary</h4>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <div className="stat-value">{tripHistory.length}</div>
                      <div className="stat-label">Total Trips</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">
                        {tripHistory.filter(t => t.status === 'completed').length}
                      </div>
                      <div className="stat-label">Completed</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">
                        {Math.round(tripHistory.reduce((sum, t) => 
                          sum + (t.delayMinutes || 0), 0) / tripHistory.length) || 0}
                      </div>
                      <div className="stat-label">Avg. Delay</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">
                        {Math.round(tripHistory.reduce((sum, t) => 
                          sum + (t.duration || 0), 0) / tripHistory.length) || 0} min
                      </div>
                      <div className="stat-label">Avg. Duration</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="stats-content">
              <div className="stats-grid-large">
                <div className="stat-card-large">
                  <div className="stat-icon-large">🚌</div>
                  <div className="stat-info-large">
                    <h3>{favorites.length}</h3>
                    <p>Favorite Routes</p>
                  </div>
                </div>
                
                <div className="stat-card-large">
                  <div className="stat-icon-large">📅</div>
                  <div className="stat-info-large">
                    <h3>{tripHistory.length}</h3>
                    <p>Trips Tracked</p>
                  </div>
                </div>
                
                <div className="stat-card-large">
                  <div className="stat-icon-large">⏱️</div>
                  <div className="stat-info-large">
                    <h3>156</h3>
                    <p>Hours Traveled</p>
                  </div>
                </div>
                
                <div className="stat-card-large">
                  <div className="stat-icon-large">💰</div>
                  <div className="stat-info-large">
                    <h3>$245</h3>
                    <p>Money Saved</p>
                  </div>
                </div>
              </div>

              <div className="stats-insights">
                <h4>Your Transport Insights</h4>
                <div className="insights-list">
                  <div className="insight-item">
                    <div className="insight-icon">🏆</div>
                    <div className="insight-text">
                      <h5>Most Used Route</h5>
                      <p>Route 101 - 24 times this month</p>
                    </div>
                  </div>
                  
                  <div className="insight-item">
                    <div className="insight-icon">⏰</div>
                    <div className="insight-text">
                      <h5>Best Time to Travel</h5>
                      <p>Least delays: 9:30 AM - 11:00 AM</p>
                    </div>
                  </div>
                  
                  <div className="insight-item">
                    <div className="insight-icon">🌱</div>
                    <div className="insight-text">
                      <h5>Environmental Impact</h5>
                      <p>You've reduced CO₂ by 45kg this year</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="export-section">
                <h4>Export Your Data</h4>
                <p>Download your trip history and favorites for personal records.</p>
                <div className="export-buttons">
                  <button className="btn btn-secondary">
                    📥 Export Trip History (CSV)
                  </button>
                  <button className="btn btn-secondary">
                    📥 Export Favorites (JSON)
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
export default Favorites;