import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaSearch, 
  FaFilter, 
  FaMapMarkerAlt, 
  FaClock, 
  FaBus,
  FaTrain,
  FaSubway,
  FaStar,
  FaStarHalfAlt,
  FaDirections,
  FaCalendarAlt,
  FaArrowRight
} from 'react-icons/fa';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const RouteSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { api } = useAuth();
  
  const [searchData, setSearchData] = useState({
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    time: searchParams.get('time') || '',
    transportType: searchParams.get('type') || 'all',
    date: searchParams.get('date') || new Date().toISOString().split('T')[0]
  });
  
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Fetch routes on component mount and when search params change
  useEffect(() => {
    const fetchRoutes = async () => {
      // Only fetch if we have search criteria
      if (searchData.from || searchData.to) {
        await searchRoutes();
      } else {
        // Fetch popular routes if no search criteria
        fetchPopularRoutes();
      }
    };
    
    fetchRoutes();
  }, []);

  const fetchPopularRoutes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/routes');
      if (response.data.success) {
        setRoutes(response.data.routes || []);
      }
    } catch (err) {
      console.error('Error fetching routes:', err);
      setError('Failed to load routes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const searchRoutes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (searchData.from) params.append('from', searchData.from);
      if (searchData.to) params.append('to', searchData.to);
      if (searchData.transportType !== 'all') params.append('type', searchData.transportType);
      
      const response = await api.get(`/routes/search?${params.toString()}`);
      
      if (response.data.success) {
        setRoutes(response.data.results || response.data.routes || []);
        
        // Update URL with search params
        const newParams = new URLSearchParams();
        if (searchData.from) newParams.set('from', searchData.from);
        if (searchData.to) newParams.set('to', searchData.to);
        if (searchData.transportType !== 'all') newParams.set('type', searchData.transportType);
        if (searchData.date) newParams.set('date', searchData.date);
        if (searchData.time) newParams.set('time', searchData.time);
        
        navigate(`/routes?${newParams.toString()}`, { replace: true });
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.error || 'Failed to search routes. Please try again.');
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchRoutes();
  };

  const handleQuickSearch = (location) => {
    setSearchData(prev => ({
      ...prev,
      from: location
    }));
    // Auto-search after 500ms
    setTimeout(() => searchRoutes(), 500);
  };

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
    navigate(`/routes/${route._id || route.id}`);
  };

  const handleClearFilters = () => {
    setSearchData({
      from: '',
      to: '',
      time: '',
      transportType: 'all',
      date: new Date().toISOString().split('T')[0]
    });
    setSearchParams({});
    fetchPopularRoutes();
  };

  const getTransportIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'bus': return <FaBus className="transport-icon bus" />;
      case 'train': return <FaTrain className="transport-icon train" />;
      case 'metro':
      case 'subway': return <FaSubway className="transport-icon metro" />;
      case 'tram': return <FaSubway className="transport-icon tram" />;
      default: return <FaBus className="transport-icon bus" />;
    }
  };

  const getTransportColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'bus': return 'var(--accent-green)';
      case 'train': return 'var(--accent-red)';
      case 'metro':
      case 'subway': return 'var(--primary-600)';
      case 'tram': return 'var(--accent-purple)';
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

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star filled" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="star half" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="star empty" />);
    }
    
    return stars;
  };

  const popularLocations = [
    'Downtown', 'Airport', 'University', 'Central Station', 'Shopping Mall',
    'Hospital', 'Sports Arena', 'Beach', 'Business District'
  ];

  if (loading && routes.length === 0) {
    return <LoadingSpinner text="Finding routes..." />;
  }

  return (
    <div className="route-search-page">
      {/* Hero Section */}
      <div className="search-hero">
        <div className="search-hero-content">
          <h1>Find Your Perfect Route</h1>
          <p>Search across hundreds of bus, train, and metro routes</p>
        </div>
      </div>

      {/* Main Search Container */}
      <div className="search-container-main">
        <form onSubmit={handleSubmit} className="search-form-main">
          <div className="search-input-group">
            <div className="input-with-icon">
              <FaMapMarkerAlt className="input-icon" />
              <input
                type="text"
                name="from"
                value={searchData.from}
                onChange={handleInputChange}
                placeholder="Where from? (e.g., Central Station)"
                className="search-input"
                autoComplete="off"
              />
            </div>
            
            <div className="input-with-icon">
              <FaMapMarkerAlt className="input-icon" />
              <input
                type="text"
                name="to"
                value={searchData.to}
                onChange={handleInputChange}
                placeholder="Where to? (e.g., University Campus)"
                className="search-input"
                autoComplete="off"
              />
            </div>
            
            <button 
              type="button" 
              className="btn-filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter />
              <span>Filters</span>
            </button>
            
            <button type="submit" className="btn-search-primary">
              <FaSearch />
              <span>Search Routes</span>
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="advanced-filters">
              <div className="filter-row">
                <div className="filter-group">
                  <label className="filter-label">
                    <FaCalendarAlt />
                    <span>Travel Date</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={searchData.date}
                    onChange={handleInputChange}
                    className="filter-input"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="filter-group">
                  <label className="filter-label">
                    <FaClock />
                    <span>Departure Time</span>
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={searchData.time}
                    onChange={handleInputChange}
                    className="filter-input"
                  />
                </div>
                
                <div className="filter-group">
                  <label className="filter-label">Transport Type</label>
                  <div className="transport-type-selector">
                    {['all', 'bus', 'train', 'metro', 'tram'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`type-btn ${searchData.transportType === type ? 'active' : ''}`}
                        onClick={() => setSearchData(prev => ({ ...prev, transportType: type }))}
                      >
                        {getTransportIcon(type === 'all' ? 'bus' : type)}
                        <span>{type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="filter-actions">
                <button 
                  type="button" 
                  className="btn-clear-filters"
                  onClick={handleClearFilters}
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Error Display */}
        {error && (
          <div className="search-error">
            <div className="alert alert-error">
              {error}
            </div>
          </div>
        )}

        {/* Quick Search Suggestions */}
        <div className="quick-search">
          <h3>Popular Destinations</h3>
          <div className="quick-search-tags">
            {popularLocations.map((location) => (
              <button
                key={location}
                type="button"
                className="quick-search-tag"
                onClick={() => handleQuickSearch(location)}
              >
                {location}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="results-section">
        <div className="results-header">
          <h2>
            {searchData.from || searchData.to 
              ? `Found ${routes.length} Route${routes.length !== 1 ? 's' : ''}`
              : 'Popular Routes'
            }
          </h2>
          {routes.length > 0 && (
            <div className="results-stats">
              <span className="stat">
                <FaBus /> {routes.filter(r => r.transportType === 'bus').length} Buses
              </span>
              <span className="stat">
                <FaTrain /> {routes.filter(r => r.transportType === 'train').length} Trains
              </span>
              <span className="stat">
                <FaSubway /> {routes.filter(r => r.transportType === 'metro').length} Metros
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <LoadingSpinner text="Loading routes..." />
        ) : routes.length === 0 ? (
          <div className="no-results">
            <div className="no-results-content">
              <FaSearch className="no-results-icon" />
              <h3>No routes found</h3>
              <p>
                {searchData.from || searchData.to
                  ? 'Try adjusting your search criteria or explore popular routes below'
                  : 'Search for routes using the form above'
                }
              </p>
              {!(searchData.from || searchData.to) && (
                <button 
                  className="btn-explore"
                  onClick={fetchPopularRoutes}
                >
                  Load Sample Routes
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Results Grid */}
            <div className="results-grid">
              {routes.map((route) => (
                <div 
                  key={route._id || route.id} 
                  className="route-card"
                  onClick={() => handleRouteSelect(route)}
                >
                  <div className="route-card-header">
                    <div className="route-type-badge" style={{ 
                      backgroundColor: getTransportColor(route.transportType) 
                    }}>
                      {getTransportIcon(route.transportType)}
                      <span className="route-type-text">
                        {route.transportType?.charAt(0).toUpperCase() + route.transportType?.slice(1)}
                      </span>
                    </div>
                    
                    <div className="route-number">
                      <span className="route-number-text">{route.routeNumber}</span>
                    </div>
                  </div>
                  
                  <div className="route-card-body">
                    <h3 className="route-name">{route.name}</h3>
                    
                    <div className="route-info">
                      <div className="route-stops">
                        <div className="stop-item">
                          <span className="stop-dot start"></span>
                          <span className="stop-text">
                            {route.stops?.[0]?.name || 'Starting Point'}
                          </span>
                        </div>
                        
                        <div className="route-line">
                          <div className="line-dots">
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className="line-dot"></div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="stop-item">
                          <span className="stop-dot end"></span>
                          <span className="stop-text">
                            {route.stops?.[route.stops?.length - 1]?.name || 'Destination'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="route-details">
                        <div className="detail-item">
                          <FaClock />
                          <span>{route.estimatedDuration || 30} min</span>
                        </div>
                        
                        <div className="detail-item">
                          <span className="fare">${route.fare?.adult || 2.50}</span>
                          <span className="fare-label">Adult Fare</span>
                        </div>
                        
                        {route.popularityScore > 0 && (
                          <div className="detail-item">
                            <div className="popularity">
                              {renderStars(route.popularityScore > 5 ? 5 : route.popularityScore / 2)}
                              <span className="popularity-text">
                                {route.popularityScore > 50 ? 'Very Popular' : 'Popular'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {route.schedule && route.schedule.length > 0 && (
                      <div className="route-schedule">
                        <h4>Next Departures:</h4>
                        <div className="departure-times">
                          {route.schedule[0].times?.slice(0, 3).map((time, index) => (
                            <span key={index} className="departure-time">
                              {formatTime(time)}
                            </span>
                          ))}
                          {route.schedule[0].times?.length > 3 && (
                            <span className="more-times">
                              +{route.schedule[0].times.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="route-card-footer">
                    <button 
                      className="btn-view-details"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRouteSelect(route);
                      }}
                    >
                      <FaDirections />
                      <span>View Details</span>
                    </button>
                    
                    <button 
                      className="btn-favorite"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement favorite functionality
                        console.log('Add to favorites:', route._id);
                      }}
                    >
                      <FaStar />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Map View Toggle */}
            <div className="map-view-toggle">
              <button 
                className="btn-map-view"
                onClick={() => navigate('/map')}
              >
                <FaMapMarkerAlt />
                <span>View Routes on Map</span>
                <FaArrowRight />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Search Tips */}
      <div className="search-tips">
        <h3>Search Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">🔍</div>
            <h4>Be Specific</h4>
            <p>Use exact station or stop names for better results</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">⏰</div>
            <h4>Check Times</h4>
            <p>Some routes have limited schedules on weekends</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🚌</div>
            <h4>Multiple Options</h4>
            <p>Try different transport types for more choices</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">⭐</div>
            <h4>Save Favorites</h4>
            <p>Bookmark routes you use regularly</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RouteSearch;