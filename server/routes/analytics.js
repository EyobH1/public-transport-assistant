const express = require('express');
const router = express.Router();
const Route = require('../models/Route');
const DelayReport = require('../models/DelayReport');
const User = require('../models/User');
const TripHistory = require('../models/TripHistory');

// Get analytics data
router.get('/', async (req, res) => {
  try {
    // Get counts
    const totalRoutes = await Route.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalDelays = await DelayReport.countDocuments({ status: 'pending' });
    const totalTrips = await TripHistory.countDocuments({ status: 'completed' });

    // Get popular routes (based on trip history)
    const popularRoutes = await TripHistory.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$routeId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'routes',
          localField: '_id',
          foreignField: '_id',
          as: 'route'
        }
      },
      { $unwind: '$route' },
      {
        $project: {
          routeNumber: '$route.routeNumber',
          name: '$route.name',
          tripCount: '$count'
        }
      }
    ]);

    // Get delay trends (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const delayTrends = await DelayReport.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dayOfWeek: '$createdAt' },
          avgDelay: { $avg: '$delayMinutes' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Get transport type distribution
    const transportDistribution = await Route.aggregate([
      { $group: { _id: '$transportType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Calculate on-time rate (simplified)
    const completedTrips = await TripHistory.find({ status: 'completed' });
    const onTimeTrips = completedTrips.filter(trip => 
      trip.delayMinutes <= 5
    ).length;
    const onTimeRate = totalTrips > 0 ? 
      Math.round((onTimeTrips / totalTrips) * 100) : 100;

    res.json({
      success: true,
      analytics: {
        totalRoutes,
        totalUsers,
        pendingDelays: totalDelays,
        totalTrips,
        onTimeRate: `${onTimeRate}%`,
        popularRoutes,
        delayTrends: delayTrends.map(d => Math.round(d.avgDelay)),
        reportTrends: delayTrends.map(d => d.count),
        transportDistribution: transportDistribution.map(t => t.count),
        topDelayedRoutes: await getTopDelayedRoutes()
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch analytics' });
  }
});

async function getTopDelayedRoutes() {
  const topDelayed = await DelayReport.aggregate([
    { $group: { _id: '$routeId', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'routes',
        localField: '_id',
        foreignField: '_id',
        as: 'route'
      }
    },
    { $unwind: '$route' },
    {
      $project: {
        routeNumber: '$route.routeNumber',
        name: '$route.name',
        delayCount: '$count'
      }
    }
  ]);

  return topDelayed;
}
module.exports = router;