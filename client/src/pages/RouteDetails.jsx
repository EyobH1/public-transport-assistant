import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  Bus,
  Train,
  Train as Subway,
  Clock,
  MapPin,
  DollarSign,
  Star,
  StarHalf,
  Users,
  Calendar,
  Share2,
  Heart,
  HeartOff,
  AlertTriangle,
  ChevronRight,
  Printer
} from 'lucide-react';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const RouteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { api, user } = useAuth();
  
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('schedule');
  const [isFavorite, setIsFavorite] = useState(false);
  const [delayReports, setDelayReports] = useState([]);

  useEffect(() => {
    fetchRouteDetails();
    checkIfFavorite();
    fetchDelayReports();
  }, [id]);

  const fetchRouteDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/routes/${id}`);
      if (response.data.success) {
        setRoute(response.data.route);
      } else {
        setError('Route not found');
      }
    } catch (err) {
      console.error('Error fetching route:', err);
      setError(err.response?.data?.error || 'Failed to load route details');
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = () => {
    // TODO: Check if route is in user's favorites
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(id));
  };

  const fetchDelayReports = async () => {
    try {
      // TODO: Fetch delay reports for this route
      const mockDelays = [
        { id: 1, delayMinutes: 15, reason: 'traffic', reportedAt: '2024-01-15T08:30:00Z', upvotes: 5 },
        { id: 2, delayMinutes: 30, reason: 'mechanical', reportedAt: '2024-01-15T09:15:00Z', upvotes: 12 },
      ];
      setDelayReports(mockDelays);
    } catch (err) {
      console.error('Error fetching delays:', err);
    }
  };

  const handleFavoriteToggle = () => {
    // TODO: Implement favorite toggle with API
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFavorite) {
      const newFavorites = favorites.filter(fav => fav !== id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } else {
      favorites.push(id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: route?.name,
        text: `Check out ${route?.name} on Transport Assistant`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleReportDelay = () => {
    navigate(`/delays/report?route=${id}`);
  };

  const getTransportIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'bus': return <Bus className="transport-icon-lg bus" />;
      case 'train': return <Train className="transport-icon-lg train" />;
      case 'metro':
      case 'subway': return <Train className="transport-icon-lg metro" />;
      default: return <Bus className="transport-icon-lg bus" />;
    }
  };

  const getTransportColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'bus': return 'var(--accent-green)';
      case 'train': return 'var(--accent-red)';
      case 'metro':
      case 'subway': return 'var(--primary-600)';
      default: return 'var(--text-secondary)';
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const calculateAverageDelay = () => {
    if (delayReports.length === 0) return 0;
    const totalDelay = delayReports.reduce((sum, report) => sum + report.delayMinutes, 0);
    return Math.round(totalDelay / delayReports.length);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="star filled" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="star half" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="star empty" />);
    }
    
    return stars;
  };

  if (loading) {
    return <LoadingSpinner text="Loading route details..." />;
  }

  if (error || !route) {
    return (
      <div className="route-error">
        <div className="error-content">
          <AlertTriangle className="error-icon" />
          <h2>{error || 'Route not found'}</h2>
          <p>The route you're looking for doesn't exist or has been removed.</p>
          <button 
            className="btn-back"
            onClick={() => navigate('/routes')}
          >
            <ArrowLeft />
            Back to Routes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="route-details-page">
      {/* Header with Back Button */}
      <div className="route-details-header">
        <button 
          className="btn-back"
          onClick={() => navigate('/routes')}
        >
          <ArrowLeft />
          <span>Back to Routes</span>
        </button>
        
        <div className="header-actions">
          <button className="btn-action" onClick={handleShare}>
            <Share2 />
            <span>Share</span>
          </button>
          <button className="btn-action" onClick={() => window.print()}>
            <Printer />
            <span>Print</span>
          </button>
          <button 
            className={`btn-action ${isFavorite ? 'active' : ''}`}
            onClick={handleFavoriteToggle}
          >
            {isFavorite ? <Heart /> : <HeartOff />}
            <span>{isFavorite ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Route Overview */}
      <div className="route-overview">
        <div className="route-badge-large" style={{ 
          backgroundColor: getTransportColor(route.transportType) 
        }}>
          {getTransportIcon(route.transportType)}
          <span className="route-type-text">
            {route.transportType?.charAt(0).toUpperCase() + route.transportType?.slice(1)}
          </span>
        </div>
        
        <div className="route-title">
          <h1>{route.name}</h1>
          <div className="route-subtitle">
            <span className="route-number-big">{route.routeNumber}</span>
            <span className="route-operator">{route.operator || 'Public Transport'}</span>
          </div>
        </div>
        
        <div className="route-stats">
          <div className="stat-item">
            <Clock />
            <div>
              <span className="stat-value">{route.estimatedDuration || 30} min</span>
              <span className="stat-label">Travel Time</span>
            </div>
          </div>
          
          <div className="stat-item">
            <MapPin />
            <div>
              <span className="stat-value">{route.stops?.length || 0}</span>
              <span className="stat-label">Stops</span>
            </div>
          </div>
          
          <div className="stat-item">
            <DollarSign />
            <div>
              <span className="stat-value">${route.fare?.adult || 2.50}</span>
              <span className="stat-label">Adult Fare</span>
            </div>
          </div>
          
          <div className="stat-item">
            <Users />
            <div>
              <span className="stat-value">{route.popularityScore || 0}</span>
              <span className="stat-label">Daily Riders</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Banner for Delays */}
      {delayReports.length > 0 && (
        <div className="delay-alert">
          <AlertTriangle />
          <div className="alert-content">
            <strong>Service Alert:</strong> Average delay of {calculateAverageDelay()} minutes reported
            <button className="alert-link" onClick={() => setActiveTab('delays')}>
              View delay reports
            </button>
          </div>
          <button className="btn-report-delay" onClick={handleReportDelay}>
            Report New Delay
          </button>
        </div>
      )}

      {/* Main Content Tabs */}
      <div className="route-tabs">
        <div className="tab-nav">
          {['schedule', 'stops', 'delays', 'fares', 'info'].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="tab-content">
          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="schedule-tab">
              <h3>Timetable & Schedule</h3>
              <div className="schedule-filters">
                <select className="day-selector">
                  <option value="weekday">Weekdays (Mon-Fri)</option>
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                  <option value="holiday">Holidays</option>
                </select>
                
                <div className="current-time">
                  <Calendar />
                  <span>Current: {new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span>
                </div>
              </div>
              
              {route.schedule && route.schedule.length > 0 ? (
                <div className="timetable">
                  <div className="timetable-header">
                    <span>Departure Time</span>
                    <span>Frequency</span>
                    <span>Status</span>
                  </div>
                  
                  <div className="timetable-body">
                    {route.schedule[0].times?.map((time, index) => (
                      <div key={index} className="timetable-row">
                        <span className="time-slot">{formatTime(time)}</span>
                        <span className="frequency">
                          {route.schedule[0].frequency ? `Every ${route.schedule[0].frequency} min` : 'Scheduled'}
                        </span>
                        <span className={`status ${index < 3 ? 'active' : 'upcoming'}`}>
                          {index < 3 ? 'Boarding Now' : 'Upcoming'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="no-schedule">
                  <p>Schedule information is currently unavailable for this route.</p>
                </div>
              )}
              
              <div className="schedule-notes">
                <h4>Important Notes:</h4>
                <ul>
                  <li>Arrive at stop 5 minutes before departure</li>
                  <li>Service may be reduced on weekends and holidays</li>
                  <li>Real-time tracking available on mobile app</li>
                  <li>Check delay reports for current service status</li>
                </ul>
              </div>
            </div>
          )}
          
          {/* Stops Tab */}
          {activeTab === 'stops' && (
            <div className="stops-tab">
              <h3>Route Stops & Map</h3>
              <div className="stops-list">
                {route.stops && route.stops.length > 0 ? (
                  route.stops.map((stop, index) => (
                    <div key={index} className="stop-item-detail">
                      <div className="stop-marker">
                        <div className={`stop-circle ${index === 0 ? 'first' : index === route.stops.length - 1 ? 'last' : ''}`}>
                          {index + 1}
                        </div>
                        {index < route.stops.length - 1 && <div className="stop-line"></div>}
                      </div>
                      
                      <div className="stop-info">
                        <h4>{stop.name}</h4>
                        <p className="stop-address">{stop.address || 'No address available'}</p>
                        {stop.estimatedArrivalTimes && (
                          <div className="stop-times">
                            <span>Next arrival: </span>
                            {stop.estimatedArrivalTimes.slice(0, 2).map((time, i) => (
                              <span key={i} className="arrival-time">
                                {formatTime(time)}
                              </span>
                            ))}
                          </div>
                        )}
                        {stop.isTerminal && (
                          <span className="terminal-badge">Terminal Station</span>
                        )}
                      </div>
                      
                      <div className="stop-actions">
                        <button className="btn-stop-action">
                          <MapPin />
                          <span>Map</span>
                        </button>
                        <button className="btn-stop-action">
                          <Clock />
                          <span>Times</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-stops">
                    <p>Stop information is currently unavailable for this route.</p>
                  </div>
                )}
              </div>
              
              <div className="map-preview">
                <h4>Route Map Preview</h4>
                <div className="map-placeholder">
                  <MapPin className="map-icon" />
                  <p>Interactive map showing all stops along the route</p>
                  <button 
                    className="btn-view-map"
                    onClick={() => navigate('/map', { state: { routeId: id } })}
                  >
                    Open Full Map
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Delays Tab */}
          {activeTab === 'delays' && (
            <div className="delays-tab">
              <h3>Current Delays & Reports</h3>
              
              <div className="delay-summary">
                <div className="delay-metric">
                  <span className="metric-value">{delayReports.length}</span>
                  <span className="metric-label">Active Reports</span>
                </div>
                <div className="delay-metric">
                  <span className="metric-value">{calculateAverageDelay()} min</span>
                  <span className="metric-label">Avg. Delay</span>
                </div>
                <div className="delay-metric">
                  <span className="metric-value">
                    {delayReports.length > 0 ? Math.max(...delayReports.map(d => d.upvotes)) : 0}
                  </span>
                  <span className="metric-label">Most Upvoted</span>
                </div>
              </div>
              
              <button className="btn-report-delay-large" onClick={handleReportDelay}>
                <AlertTriangle />
                Report a Delay
              </button>
              
              {delayReports.length > 0 ? (
                <div className="delay-reports">
                  <h4>Recent Delay Reports</h4>
                  {delayReports.map((report) => (
                    <div key={report.id} className="delay-report-card">
                      <div className="report-header">
                        <span className={`delay-severity ${report.delayMinutes > 20 ? 'high' : 'medium'}`}>
                          {report.delayMinutes} min delay
                        </span>
                        <span className="report-time">
                          {new Date(report.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <div className="report-body">
                        <p className="report-reason">
                          Reason: {report.reason?.replace('_', ' ') || 'Unknown'}
                        </p>
                        <div className="report-actions">
                          <button className="btn-upvote">
                            ↑ {report.upvotes}
                          </button>
                          <button className="btn-comment">
                            Comment
                          </button>
                          <button className="btn-share-report">
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-delays">
                  <p>No delay reports for this route. Service appears to be running normally.</p>
                  <p className="subtext">Be the first to report a delay if you encounter one.</p>
                </div>
              )}
            </div>
          )}
          
          {/* Fares Tab */}
          {activeTab === 'fares' && (
            <div className="fares-tab">
              <h3>Fare Information</h3>
              
              <div className="fare-table">
                <div className="fare-row header">
                  <span>Passenger Type</span>
                  <span>Single Ride</span>
                  <span>Day Pass</span>
                  <span>Monthly Pass</span>
                </div>
                
                <div className="fare-row">
                  <span>Adult</span>
                  <span>${route.fare?.adult || 2.50}</span>
                  <span>$10.00</span>
                  <span>$75.00</span>
                </div>
                
                <div className="fare-row">
                  <span>Student</span>
                  <span>${route.fare?.student || 1.75}</span>
                  <span>$7.50</span>
                  <span>$55.00</span>
                </div>
                
                <div className="fare-row">
                  <span>Senior (65+)</span>
                  <span>${route.fare?.senior || 1.25}</span>
                  <span>$5.00</span>
                  <span>$40.00</span>
                </div>
                
                <div className="fare-row">
                  <span>Child (Under 12)</span>
                  <span>${route.fare?.child || 1.00}</span>
                  <span>$4.00</span>
                  <span>$30.00</span>
                </div>
              </div>
              
              <div className="payment-methods">
                <h4>Accepted Payment Methods:</h4>
                <div className="payment-icons">
                  <span className="payment-icon">💳</span>
                  <span className="payment-icon">📱</span>
                  <span className="payment-icon">💵</span>
                  <span className="payment-icon">🏦</span>
                </div>
                <p className="payment-note">
                  Contactless payment available. Mobile app tickets accepted.
                </p>
              </div>
              
              <div className="discounts">
                <h4>Discounts & Transfers:</h4>
                <ul>
                  <li>Free transfers within 2 hours of first tap</li>
                  <li>Family discounts available on weekends</li>
                  <li>Group rates for 10+ passengers</li>
                  <li>Student discounts with valid ID</li>
                </ul>
              </div>
            </div>
          )}
          
          {/* Info Tab */}
          {activeTab === 'info' && (
            <div className="info-tab">
              <h3>Route Information & Policies</h3>
              
              <div className="route-description">
                <h4>Description</h4>
                <p>{route.description || 'No description available for this route.'}</p>
              </div>
              
              <div className="service-info">
                <h4>Service Information</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">First Departure</span>
                    <span className="info-value">6:00 AM</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Last Departure</span>
                    <span className="info-value">11:00 PM</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Peak Hours</span>
                    <span className="info-value">7-9 AM, 4-6 PM</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Weekend Service</span>
                    <span className="info-value">Reduced</span>
                  </div>
                </div>
              </div>
              
              <div className="amenities">
                <h4>Amenities & Features</h4>
                <div className="amenity-tags">
                  <span className="amenity-tag">Wheelchair Accessible</span>
                  <span className="amenity-tag">Wi-Fi Available</span>
                  <span className="amenity-tag">USB Charging</span>
                  <span className="amenity-tag">Air Conditioned</span>
                  <span className="amenity-tag">Real-time Tracking</span>
                </div>
              </div>
              
              <div className="contact-info">
                <h4>Contact & Support</h4>
                <div className="contact-details">
                  <p>For route-specific inquiries, contact:</p>
                  <p><strong>Customer Service:</strong> 1-800-TRANSPORT</p>
                  <p><strong>Email:</strong> routes@transportassistant.com</p>
                  <p><strong>Twitter:</strong> @TransitAlert</p>
                </div>
              </div>
              
              <div className="route-rating">
                <h4>User Ratings</h4>
                <div className="rating-overview">
                  <div className="rating-stars">
                    {renderStars(4.2)}
                    <span className="rating-score">4.2/5</span>
                  </div>
                  <p className="rating-count">Based on 1,247 ratings</p>
                </div>
                
                <div className="rating-breakdown">
                  <div className="rating-bar">
                    <span>5 Stars</span>
                    <div className="bar-container">
                      <div className="bar-fill" style={{ width: '65%' }}></div>
                    </div>
                    <span>65%</span>
                  </div>
                  <div className="rating-bar">
                    <span>4 Stars</span>
                    <div className="bar-container">
                      <div className="bar-fill" style={{ width: '20%' }}></div>
                    </div>
                    <span>20%</span>
                  </div>
                  <div className="rating-bar">
                    <span>3 Stars</span>
                    <div className="bar-container">
                      <div className="bar-fill" style={{ width: '10%' }}></div>
                    </div>
                    <span>10%</span>
                  </div>
                  <div className="rating-bar">
                    <span>2 Stars</span>
                    <div className="bar-container">
                      <div className="bar-fill" style={{ width: '3%' }}></div>
                    </div>
                    <span>3%</span>
                  </div>
                  <div className="rating-bar">
                    <span>1 Star</span>
                    <div className="bar-container">
                      <div className="bar-fill" style={{ width: '2%' }}></div>
                    </div>
                    <span>2%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Routes */}
      <div className="related-routes">
        <h3>Related Routes You Might Like</h3>
        <div className="related-grid">
          {/* TODO: Fetch and display related routes */}
          <div className="related-card">
            <div className="related-type">Bus</div>
            <h4>Downtown Express</h4>
            <p>Route 102 • 40 min • $2.50</p>
          </div>
          <div className="related-card">
            <div className="related-type">Metro</div>
            <h4>Red Line</h4>
            <p>Route T1 • 25 min • $3.00</p>
          </div>
          <div className="related-card">
            <div className="related-type">Bus</div>
            <h4>University Shuttle</h4>
            <p>Route 203 • 35 min • $1.75</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteDetails;