import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, User, LogOut } from 'lucide-react';

function Header() {
  const navigate = useNavigate();
  const isLoggedIn = false; 

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold">
          <Bus className="w-6 h-6" />
          <span>Transport Assistant</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/routes" className="hover:underline">Routes</Link>
          <Link to="/delays" className="hover:underline">Delays</Link>

          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="flex items-center gap-1 hover:underline">
                <User className="w-4 h-4" /> Dashboard
              </Link>
              <button
                onClick={() => navigate('/logout')}
                className="flex items-center gap-1 text-sm hover:underline"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link
                to="/register"
                className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 font-medium"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;