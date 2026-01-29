const express = require('express');
const authRoutes = require('./authRoutes');
const routeRoutes = require('./routeRoutes');

const setupRoutes = (app) => {
  // Health check route
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  });

  // Mount routes
  app.use('/api/auth', authRoutes);
  app.use('/api/routes', routeRoutes);
  
  // 404 handler for undefined routes
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      error: `Cannot ${req.method} ${req.originalUrl}`
    });
  });
};

module.exports = setupRoutes;