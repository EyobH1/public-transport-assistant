const Route = require('../models/Route');

// Helper function to calculate distance between coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

const getAllRoutes = async (req, res) => {
  try {
    const { 
      transportType, 
      activeOnly = true,
      page = 1, 
      limit = 20 
    } = req.query;

    const query = {};
    
    if (transportType && transportType !== 'all') {
      query.transportType = transportType;
    }
    
    if (activeOnly === 'true') {
      query.isActive = true;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    const routes = await Route.find(query)
      .sort({ popularityScore: -1, routeNumber: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-createdAt -updatedAt -__v');

    const total = await Route.countDocuments(query);

    res.status(200).json({
      success: true,
      count: routes.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      routes
    });
  } catch (error) {
    console.error('Get all routes error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching routes'
    });
  }
};

const searchRoutes = async (req, res) => {
  try {
    const { 
      from, 
      to, 
      time, 
      transportType,
      maxDistance = 2 // km
    } = req.query;

    // Basic search by route number or name
    if (from || to) {
      const query = {
        $or: [
          { routeNumber: { $regex: from || to, $options: 'i' } },
          { name: { $regex: from || to, $options: 'i' } },
          { 'stops.name': { $regex: from || to, $options: 'i' } }
        ]
      };

      if (transportType && transportType !== 'all') {
        query.transportType = transportType;
      }

      const routes = await Route.find(query)
        .sort({ popularityScore: -1 })
        .limit(20);

      // Increment popularity for each route found
      routes.forEach(route => {
        route.incrementPopularity().catch(console.error);
      });

      return res.status(200).json({
        success: true,
        count: routes.length,
        routes: routes.map(route => route.getRouteInfo())
      });
    }

    // If no search parameters, return popular routes
    const routes = await Route.find({ isActive: true })
      .sort({ popularityScore: -1 })
      .limit(10)
      .select('routeNumber name transportType stops estimatedDuration');

    res.status(200).json({
      success: true,
      count: routes.length,
      routes
    });
  } catch (error) {
    console.error('Search routes error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error searching routes'
    });
  }
};

const getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    
    if (!route) {
      return res.status(404).json({
        success: false,
        error: 'Route not found'
      });
    }

    // Increment popularity
    await route.incrementPopularity();

    res.status(200).json({
      success: true,
      route: route.getRouteInfo()
    });
  } catch (error) {
    console.error('Get route by ID error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Route not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error fetching route'
    });
  }
};

const createRoute = async (req, res) => {
  try {
    const route = await Route.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Route created successfully',
      route: route.getRouteInfo()
    });
  } catch (error) {
    console.error('Create route error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Route number already exists'
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error creating route'
    });
  }
};

const updateRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!route) {
      return res.status(404).json({
        success: false,
        error: 'Route not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Route updated successfully',
      route: route.getRouteInfo()
    });
  } catch (error) {
    console.error('Update route error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Route number already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error updating route'
    });
  }
};

const deleteRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    
    if (!route) {
      return res.status(404).json({
        success: false,
        error: 'Route not found'
      });
    }

    // Soft delete (mark as inactive)
    route.isActive = false;
    await route.save();

    res.status(200).json({
      success: true,
      message: 'Route deactivated successfully'
    });
  } catch (error) {
    console.error('Delete route error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error deleting route'
    });
  }
};

const getNearbyRoutes = async (req, res) => {
  try {
    const { lat, lng, radius = 1 } = req.query; // radius in km
    
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: 'Please provide latitude and longitude'
      });
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const searchRadius = parseFloat(radius);

    const routes = await Route.find({ isActive: true });
    
    const nearbyRoutes = routes.filter(route => {
      return route.stops.some(stop => {
        const distance = calculateDistance(
          userLat, 
          userLng, 
          stop.location.lat, 
          stop.location.lng
        );
        return distance <= searchRadius;
      });
    }).map(route => ({
      ...route.getRouteInfo(),
      nearestStop: route.stops.reduce((nearest, stop) => {
        const distance = calculateDistance(
          userLat, 
          userLng, 
          stop.location.lat, 
          stop.location.lng
        );
        return distance < nearest.distance ? 
          { ...stop.toObject(), distance } : 
          nearest;
      }, { distance: Infinity })
    }));

    // Sort by nearest distance
    nearbyRoutes.sort((a, b) => a.nearestStop.distance - b.nearestStop.distance);

    res.status(200).json({
      success: true,
      count: nearbyRoutes.length,
      userLocation: { lat: userLat, lng: userLng },
      radius: searchRadius,
      routes: nearbyRoutes.slice(0, 10) // Return top 10
    });
  } catch (error) {
    console.error('Get nearby routes error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error finding nearby routes'
    });
  }
};

module.exports = {
  getAllRoutes,
  searchRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
  getNearbyRoutes
};