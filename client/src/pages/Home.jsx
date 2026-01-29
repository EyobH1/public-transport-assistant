import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, Bell } from 'lucide-react';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Smart Public Transport Assistant</h1>
          <p className="hero-subtitle">
            Real-time schedules, crowd-sourced delay reports, and intelligent route planning
            for your daily commute.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">
              Get Started Free
            </Link>
            <Link to="/login" className="btn-secondary">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <Search className="feature-icon" />
            <h3>Route Search</h3>
            <p>Find optimal routes between any two points with real-time schedule information.</p>
          </div>
          
          <div className="feature-card">
            <MapPin className="feature-icon" />
            <h3>Interactive Maps</h3>
            <p>Visualize routes and stops on detailed maps with live vehicle tracking.</p>
          </div>
          
          <div className="feature-card">
            <Clock className="feature-icon" />
            <h3>Delay Reporting</h3>
            <p>Crowd-sourced delay reporting with upvoting system for accuracy.</p>
          </div>
          
          <div className="feature-card">
            <Bell className="feature-icon" />
            <h3>Real-time Updates</h3>
            <p>Get notifications about delays and schedule changes on your favorite routes.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Ready for a Smarter Commute?</h2>
        <p>Join thousands of commuters who save time and reduce stress daily.</p>
        <Link to="/register" className="btn-primary btn-large">
          Start Your Journey Today
        </Link>
      </section>
    </div>
  );
};

export default Home;