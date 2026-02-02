import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  FaBus, 
  FaUser, 
  FaSignOutAlt, 
  FaSearch,
  FaMapMarkerAlt,
  FaBars,
  FaTimes 
} from 'react-icons/fa';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/routes/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: <FaBus /> },
    { path: '/routes', label: 'Routes', icon: <FaMapMarkerAlt /> },
    { path: '/delays', label: 'Delays', icon: <FaSearch /> },
  ];

  if (isAdmin) {
    navLinks.push({ path: '/admin', label: 'Admin', icon: <FaUser /> });
  }

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
          <FaBus className="logo-icon" />
          <div className="logo-text">
            <span className="logo-title">Transport Assistant</span>
            <span className="logo-subtitle">Smart Commute Solutions</span>
          </div>
        </Link>

        {/* Search Bar (Desktop) */}
        <div className="search-container">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search routes, stops, or destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <FaSearch />
            </button>
          </form>
        </div>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="nav-link"
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
          
          {user ? (
            <div className="user-menu">
              <Link to="/dashboard" className="nav-link user-profile">
                <FaUser />
                <span>{user.firstName}</span>
              </Link>
              <button onClick={handleLogout} className="btn-logout">
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn-register">Register</Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="menu-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mobile-search-form">
            <input
              type="text"
              placeholder="Search routes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mobile-search-input"
            />
            <button type="submit" className="mobile-search-button">
              <FaSearch />
            </button>
          </form>

          {/* Mobile Navigation Links */}
          <div className="mobile-nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Auth Links */}
          <div className="mobile-auth-links">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUser />
                  <span>Dashboard ({user.firstName})</span>
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="mobile-logout-btn"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Login</span>
                </Link>
                <Link 
                  to="/register" 
                  className="mobile-register-btn"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;