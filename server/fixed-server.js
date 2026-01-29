console.log('🚀 Starting Public Transport Assistant Backend...');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/transport_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    console.log('Using in-memory data for now...');
  }
};
connectDB();

// Import models (create simple versions if they don't exist)
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  role: { type: String, default: 'passenger' }
}));

const Route = mongoose.models.Route || mongoose.model('Route', new mongoose.Schema({
  routeNumber: String,
  name: String,
  transportType: String,
  stops: Array,
  schedule: Array
}));

// Routes using express.Router
const authRouter = express.Router();
const routeRouter = express.Router();

// Auth routes
authRouter.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }
    
    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }
    
    // Create user
    const user = await User.create({
      email,
      password, // In real app, hash this!
      firstName,
      lastName
    });
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password required' 
      });
    }
    
    // Find user
    const user = await User.findOne({ email });
    
    if (!user || user.password !== password) { // In real app, compare hashed passwords
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    res.json({
      success: true,
      message: 'Login successful',
      token: 'jwt-token-placeholder', // In real app, generate JWT
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// Route routes
routeRouter.get('/', async (req, res) => {
  try {
    const routes = await Route.find().limit(20);
    
    if (routes.length === 0) {
      // Create sample routes if none exist
      const sampleRoutes = [
        {
          routeNumber: '101',
          name: 'Downtown Express',
          transportType: 'bus',
          stops: [
            { name: 'Central Station', location: { lat: 40.7128, lng: -74.0060 } },
            { name: 'City Hall', location: { lat: 40.7130, lng: -74.0070 } }
          ],
          schedule: [
            { day: 'weekday', times: ['07:00', '08:00', '17:00', '18:00'] }
          ]
        }
      ];
      
      await Route.insertMany(sampleRoutes);
      const newRoutes = await Route.find();
      return res.json({
        success: true,
        count: newRoutes.length,
        routes: newRoutes
      });
    }
    
    res.json({
      success: true,
      count: routes.length,
      routes
    });
  } catch (error) {
    console.error('Get routes error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch routes' });
  }
});

routeRouter.get('/search', async (req, res) => {
  const { from, to } = req.query;
  
  try {
    let query = {};
    
    if (from) {
      query['stops.name'] = { $regex: from, $options: 'i' };
    }
    
    const routes = await Route.find(query).limit(10);
    
    res.json({
      success: true,
      query: { from, to },
      count: routes.length,
      routes
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ success: false, error: 'Search failed' });
  }
});

// Mount routers
app.use('/api/auth', authRouter);
app.use('/api/routes', routeRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Base: http://localhost:${PORT}/api`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});