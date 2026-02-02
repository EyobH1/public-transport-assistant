import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="error-code">
            <span className="error-digit">4</span>
            <span className="error-icon">🚍</span>
            <span className="error-digit">4</span>
          </div>
          
          <h1>Route Not Found</h1>
          <p className="error-description">
            The page you're looking for seems to have taken a different route. 
            It might have been moved, deleted, or never existed in the first place.
          </p>
          
          <div className="error-suggestions">
            <div className="suggestion-card">
              <div className="suggestion-icon">🔍</div>
              <h3>Check the URL</h3>
              <p>Make sure you typed the correct address</p>
            </div>
            
            <div className="suggestion-card">
              <div className="suggestion-icon">🏠</div>
              <h3>Go Home</h3>
              <p>Return to the main dashboard</p>
            </div>
            
            <div className="suggestion-card">
              <div className="suggestion-icon">🗺️</div>
              <h3>Browse Routes</h3>
              <p>Explore available transport routes</p>
            </div>
          </div>
          
          <div className="error-actions">
            <button 
              className="btn btn-primary btn-large"
              onClick={() => navigate(-1)}
            >
              ← Go Back
            </button>
            
            <Link to="/" className="btn btn-secondary btn-large">
              🏠 Home Dashboard
            </Link>
            
            <Link to="/routes" className="btn btn-secondary btn-large">
              🚍 Browse Routes
            </Link>
          </div>
          
          <div className="error-search">
            <h4>Search for what you need:</h4>
            <div className="search-container">
              <input 
                type="text" 
                placeholder="Search routes, stops, or destinations..."
                className="search-input"
              />
              <button className="search-button">
                🔍
              </button>
            </div>
          </div>
          
          <div className="quick-links">
            <h4>Quick Links:</h4>
            <div className="links-grid">
              <Link to="/map">Interactive Map</Link>
              <Link to="/delays">Delay Reports</Link>
              <Link to="/favorites">Favorite Routes</Link>
              <Link to="/profile">Your Profile</Link>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          </div>
          
          <div className="error-footer">
            <p>
              Still lost? <Link to="/contact">Contact our support team</Link> for help.
            </p>
            <p className="footer-note">
              🚍 Transport Assistant • Making your commute better since 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NotFound;