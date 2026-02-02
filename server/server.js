console.log('🚀 Starting Public Transport Assistant Backend...\n');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// MongoDB connection
// SIMPLE MONGODB CONNECTION FOR MONGOOSE 7+
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/transport_assistant';

console.log(`🔗 Connecting to MongoDB at: ${MONGODB_URI}`);

// Remove ALL options - Mongoose 7 connects with just the URI
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    console.log(`📍 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
  })
  .catch((error) => {
    console.error('❌ MongoDB Connection Failed:', error.message);
    console.log('\n💡 Since MongoDB is running locally, try:');
    console.log('   1. Restart MongoDB: mongod');
    console.log('   2. Use URI: mongodb://localhost:27017/transport_assistant');
    console.log('   3. Check if MongoDB service is running');
  });

// Simple schema definitions
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, default: 'passenger' },
  createdAt: { type: Date, default: Date.now }
});

const routeSchema = new mongoose.Schema({
  routeNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  transportType: { type: String, enum: ['bus', 'train', 'tram'], default: 'bus' },
  stops: [{
    name: String,
    location: { lat: Number, lng: Number }
  }],
  schedule: [{
    day: String,
    times: [String]
  }],
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Route = mongoose.models.Route || mongoose.model('Route', routeSchema);

// Routes
const authRouter = express.Router();
const routeRouter = express.Router();

// Protect routes
routeRouter.get('/protected-route', authenticate, async (req, res) => {
  res.json({ message: 'Protected data', user: req.user });
});

// Admin-only route
routeRouter.get('/admin-only', authenticate, authorize('admin'), async (req, res) => {
  res.json({ message: 'Admin data' });
});

// Health check
app.get('/api/health', async (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.json({
    status: 'operational',
    timestamp: new Date().toISOString(),
    database: statusMap[dbStatus] || 'unknown',
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚍 Public Transport Assistant API',
    version: '1.0.0',
    status: 'online',
    endpoints: [
      'GET  /api/health - Health check',
      'POST /api/auth/register - Register user',
      'POST /api/auth/login - Login user',
      'GET  /api/routes - List all routes',
      'GET  /api/routes/search?from=X - Search routes'
    ],
    database: mongoose.connection.readyState === 1 ? 'connected' : 'in-memory'
  });
});

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
    
    // Simple email validation
    if (!email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }
    
    // Create user
    const user = await User.create({
      email,
      password, // Note: In production, hash this!
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
    res.status(500).json({ 
      success: false, 
      error: 'Registration failed',
      details: error.message 
    });
  }
});
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
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
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Simple password check (in production, use bcrypt)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Invalid password'
      });
    }
    
    res.json({
      success: true,
      message: 'Login successful',
      token: 'jwt-token-placeholder',
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
    res.status(500).json({ 
      success: false, 
      error: 'Login failed',
      details: error.message 
    });
  }
});

// Route routes
routeRouter.get('/', async (req, res) => {
  try {
    let routes;
    const dbConnected = mongoose.connection.readyState === 1;
    
    if (dbConnected) {
      routes = await Route.find().limit(50);
      
      // If no routes exist, create sample data
      if (routes.length === 0) {
        console.log('📝 Creating sample routes...');
        
        const sampleRoutes = [
          {
            routeNumber: '101',
            name: 'Downtown Express',
            transportType: 'bus',
            stops: [
              { name: 'Central Station', location: { lat: 40.7128, lng: -74.0060 } },
              { name: 'City Hall', location: { lat: 40.7130, lng: -74.0070 } },
              { name: 'Financial District', location: { lat: 40.7075, lng: -74.0113 } }
            ],
            schedule: [
              { day: 'weekday', times: ['07:00', '08:00', '09:00', '17:00', '18:00'] },
              { day: 'weekend', times: ['09:00', '11:00', '14:00', '17:00'] }
            ]
          },
          {
            routeNumber: '202',
            name: 'University Line',
            transportType: 'bus',
            stops: [
              { name: 'University Campus', location: { lat: 40.8075, lng: -73.9626 } },
              { name: 'Student Union', location: { lat: 40.8080, lng: -73.9630 } },
              { name: 'Library', location: { lat: 40.8100, lng: -73.9650 } }
            ],
            schedule: [
              { day: 'all', times: ['06:30', '07:30', '08:30', '16:30', '17:30'] }
            ]
          },
          {
            routeNumber: 'T1',
            name: 'Red Metro Line',
            transportType: 'train',
            stops: [
              { name: 'North Terminal', location: { lat: 40.7500, lng: -73.9900 } },
              { name: 'Midtown', location: { lat: 40.7540, lng: -73.9840 } },
              { name: 'Times Square', location: { lat: 40.7580, lng: -73.9850 } }
            ],
            schedule: [
              { day: 'weekday', times: ['06:00', '07:00', '08:00', '16:00', '17:00', '18:00'] },
              { day: 'weekend', times: ['08:00', '10:00', '12:00', '14:00', '16:00'] }
            ]
          }
        ];
        
        await Route.insertMany(sampleRoutes);
        routes = await Route.find().limit(50);
        console.log(`✅ Created ${routes.length} sample routes`);
      }
    } else {
      // Fallback: In-memory routes if DB not connected
      console.log('⚠️  Using in-memory routes (MongoDB not connected)');
      routes = [
        {
          _id: '1',
          routeNumber: '101',
          name: 'Downtown Express',
          transportType: 'bus',
          stops: [{ name: 'Central Station' }, { name: 'City Hall' }],
          schedule: [{ day: 'weekday', times: ['07:00', '08:00'] }]
        }
      ];
    }
    
    res.json({
      success: true,
      database: dbConnected ? 'connected' : 'in-memory',
      count: routes.length,
      routes
    });
  } catch (error) {
    console.error('Get routes error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch routes',
      details: error.message 
    });
  }
});

routeRouter.get('/search', async (req, res) => {
  try {
    const { from, to, type } = req.query;
    const dbConnected = mongoose.connection.readyState === 1;
    
    let routes = [];
    
    if (dbConnected) {
      let query = {};
      
      if (from) {
        query['stops.name'] = { $regex: from, $options: 'i' };
      }
      
      if (type && type !== 'all') {
        query.transportType = type;
      }
      
      routes = await Route.find(query).limit(20);
    } else {
      // In-memory search
      routes = [
        {
          _id: '1',
          routeNumber: '101',
          name: 'Downtown Express',
          transportType: 'bus',
          stops: [{ name: 'Central Station' }, { name: 'City Hall' }],
          schedule: [{ day: 'weekday', times: ['07:00', '08:00'] }]
        }
      ].filter(route => 
        !from || route.stops.some(stop => 
          stop.name.toLowerCase().includes(from.toLowerCase())
        )
      );
    }
    
    res.json({
      success: true,
      database: dbConnected ? 'connected' : 'in-memory',
      query: { from, to, type },
      count: routes.length,
      results: routes
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Search failed',
      details: error.message 
    });
  }
});

routeRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dbConnected = mongoose.connection.readyState === 1;
    
    let route;
    
    if (dbConnected) {
      route = await Route.findById(id);
    } else {
      // In-memory route
      route = {
        _id: '1',
        routeNumber: '101',
        name: 'Downtown Express',
        transportType: 'bus',
        stops: [
          { name: 'Central Station', location: { lat: 40.7128, lng: -74.0060 } },
          { name: 'City Hall', location: { lat: 40.7130, lng: -74.0070 } }
        ],
        schedule: [
          { day: 'weekday', times: ['07:00', '08:00', '09:00', '17:00', '18:00'] }
        ],
        estimatedDuration: 45,
        fare: { adult: 2.50, student: 1.75 }
      };
    }
    
    if (!route) {
      return res.status(404).json({
        success: false,
        error: 'Route not found'
      });
    }
    
    res.json({
      success: true,
      database: dbConnected ? 'connected' : 'in-memory',
      route
    });
  } catch (error) {
    console.error('Get route error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch route',
      details: error.message 
    });
  }
});

// Add this schema after the routeSchema
const delayReportSchema = new mongoose.Schema({
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  routeNumber: String,
  routeName: String,
  stopName: String,
  delayMinutes: { type: Number, required: true },
  severity: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  description: String,
  location: {
    lat: Number,
    lng: Number
  },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { 
    type: String, 
    enum: ['pending', 'verified', 'resolved', 'false_report'], 
    default: 'pending' 
  },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

const DelayReport = mongoose.models.DelayReport || mongoose.model('DelayReport', delayReportSchema);

// Add favorite route schema
const favoriteRouteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  addedAt: { type: Date, default: Date.now },
  note: String
});

const FavoriteRoute = mongoose.models.FavoriteRoute || mongoose.model('FavoriteRoute', favoriteRouteSchema);

// Add trip history schema
const tripHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  routeNumber: String,
  routeName: String,
  startStop: String,
  endStop: String,
  scheduledTime: Date,
  actualTime: Date,
  duration: Number,
  status: { 
    type: String, 
    enum: ['planned', 'in_progress', 'completed', 'cancelled'] 
  },
  delayMinutes: Number,
  createdAt: { type: Date, default: Date.now }
});

const TripHistory = mongoose.models.TripHistory || mongoose.model('TripHistory', tripHistorySchema);

// Create routers for delays and favorites
const delayRouter = express.Router();
const favoriteRouter = express.Router();

// Delay Report Routes
delayRouter.post('/report', async (req, res) => {
  try {
    const { routeId, routeNumber, routeName, stopName, delayMinutes, severity, description, location } = req.body;
    const userId = req.headers.userid || 'anonymous'; // In production, get from JWT

    if (!routeId || !delayMinutes) {
      return res.status(400).json({ 
        success: false, 
        error: 'Route ID and delay minutes are required' 
      });
    }

    const report = await DelayReport.create({
      routeId,
      userId,
      routeNumber,
      routeName,
      stopName,
      delayMinutes: parseInt(delayMinutes),
      severity: severity || 'medium',
      description,
      location,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Delay reported successfully',
      report
    });
  } catch (error) {
    console.error('Report delay error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to report delay',
      details: error.message 
    });
  }
});

delayRouter.get('/', async (req, res) => {
  try {
    const { routeId, limit = 50, status } = req.query;
    let query = {};
    
    if (routeId) query.routeId = routeId;
    if (status) query.status = status;
    
    const reports = await DelayReport.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('routeId', 'routeNumber name transportType')
      .populate('userId', 'firstName lastName email');
    
    res.json({
      success: true,
      count: reports.length,
      reports
    });
  } catch (error) {
    console.error('Get delay reports error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch delay reports',
      details: error.message 
    });
  }
});

delayRouter.put('/:id/upvote', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'User ID required' 
      });
    }

    const report = await DelayReport.findById(id);
    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    // Check if user already upvoted
    const alreadyUpvoted = report.upvotes.includes(userId);
    
    if (alreadyUpvoted) {
      // Remove upvote
      report.upvotes = report.upvotes.filter(vote => vote.toString() !== userId);
    } else {
      // Add upvote
      report.upvotes.push(userId);
    }

    await report.save();

    res.json({
      success: true,
      message: alreadyUpvoted ? 'Upvote removed' : 'Upvoted successfully',
      upvotes: report.upvotes.length
    });
  } catch (error) {
    console.error('Upvote error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update upvote',
      details: error.message 
    });
  }
});

// Favorite Routes
favoriteRouter.post('/', async (req, res) => {
  try {
    const { userId, routeId, note } = req.body;

    if (!userId || !routeId) {
      return res.status(400).json({ 
        success: false, 
        error: 'User ID and Route ID are required' 
      });
    }

    // Check if already favorited
    const existing = await FavoriteRoute.findOne({ userId, routeId });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Route already in favorites'
      });
    }

    const favorite = await FavoriteRoute.create({
      userId,
      routeId,
      note
    });

    res.status(201).json({
      success: true,
      message: 'Route added to favorites',
      favorite
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add to favorites',
      details: error.message 
    });
  }
});

favoriteRouter.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const favorites = await FavoriteRoute.find({ userId })
      .populate('routeId')
      .sort({ addedAt: -1 });
    
    res.json({
      success: true,
      count: favorites.length,
      favorites
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch favorites',
      details: error.message 
    });
  }
});

favoriteRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const favorite = await FavoriteRoute.findOne({ _id: id, userId });
    
    if (!favorite) {
      return res.status(404).json({
        success: false,
        error: 'Favorite not found'
      });
    }

    await favorite.deleteOne();

    res.json({
      success: true,
      message: 'Route removed from favorites'
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to remove from favorites',
      details: error.message 
    });
  }
});

// Mount the new routers
app.use('/api/delays', delayRouter);
app.use('/api/favorites', favoriteRouter);

// Mount routers
app.use('/api/auth', authRouter);
app.use('/api/routes', routeRouter);

// Start server
const PORT = process.env.PORT || 5000;

// Try to connect to MongoDB, but start server even if it fails
const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`📍 Host: ${mongoose.connection.host}`);
  } catch (error) {
    console.log('⚠️  MongoDB not connected, using in-memory data');
    console.log('💡 To connect MongoDB:');
    console.log('   1. Install MongoDB from https://www.mongodb.com/try/download/community');
    console.log('   2. Start MongoDB service');
    console.log('   3. For Windows: Run "mongod" in Command Prompt as Administrator');
  }
  
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📡 Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'In-memory mode'}`);
    console.log('\n📋 Available Endpoints:');
    console.log('   GET  /              - API info');
    console.log('   GET  /api/health    - Health check');
    console.log('   POST /api/auth/register - Register');
    console.log('   POST /api/auth/login    - Login');
    console.log('   GET  /api/routes       - All routes');
    console.log('   GET  /api/routes/search?from=X - Search');
    console.log('   GET  /api/routes/:id   - Route details');
  });
};

startServer();