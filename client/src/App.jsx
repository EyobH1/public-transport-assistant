import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './pages/Home.jsx';
//import Login from './pages/Login';
//import Register from './pages/Register';
//import Dashboard from './pages/Dashboard';
//import Admin from './pages/Admin';

import Header from './components/Layout/Header.jsx';
import Footer from './components/Layout/Footer.jsx';

function App(){
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            {/*<Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/*" element={<Admin />} /> */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
export default App;
