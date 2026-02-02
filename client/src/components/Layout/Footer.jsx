import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Github, 
  Linkedin, 
  Heart, 
  Bus,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-container">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-logo">
              <Bus className="footer-logo-icon" />
              <span className="footer-logo-text">Transport Assistant</span>
            </div>
            <p className="footer-description">
              Making public transport smarter, more reliable, and accessible for everyone. 
              Join thousands of commuters who save time and reduce stress daily.
            </p>
            <div className="footer-social">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                aria-label="GitHub"
              >
                <Github />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                aria-label="LinkedIn"
              >
                <Linkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/routes">All Routes</Link></li>
              <li><Link to="/delays">Delay Reports</Link></li>
              <li><Link to="/map">Interactive Map</Link></li>
              <li><Link to="/favorites">Favorite Routes</Link></li>
              <li><Link to="/plan">Trip Planner</Link></li>
            </ul>
          </div>

          {/* Help & Support */}
          <div className="footer-section">
            <h3 className="footer-heading">Help & Support</h3>
            <ul className="footer-links">
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3 className="footer-heading">Contact Info</h3>
            <ul className="footer-contact">
              <li>
                <Mail className="contact-icon" />
                <span>support@transportassistant.com</span>
              </li>
              <li>
                <Phone className="contact-icon" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li>
                <MapPin className="contact-icon" />
                <span>123 Transit Street, City, Country</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-container">
          <p className="copyright">
            &copy; {currentYear} Transport Assistant. All rights reserved.
            <span className="made-with">
              Made with <Heart className="heart-icon" /> for better public transport
            </span>
          </p>
          <div className="footer-extra">
            <span className="version">v1.0.0</span>
            <Link to="/sitemap" className="sitemap-link">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;