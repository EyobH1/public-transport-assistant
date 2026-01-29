require('dotenv').config();
const mongoose = require('mongoose');
const { User, Route } = require('../models');

const seedRoutes = [
  {
    routeNumber: '101',
    name: 'Downtown Express',
    transportType: 'bus',
    stops: [
      { name: 'Central Station', location: { lat: 40.7128, lng: -74.0060 }, sequence: 1 },
      { name: 'City Hall', location: { lat: 40.7130, lng: -74.0070 }, sequence: 2 },
      { name: 'Financial District', location: { lat: 40.7075, lng: -74.0113 }, sequence: 3 },
      { name: 'Waterfront', location: { lat: 40.7029, lng: -74.0142 }, sequence: 4 }
    ],
    schedule: [
      { day: 'monday', departureTimes: ['07:00', '08:00', '09:00', '17:00', '18:00'] },
      { day: 'tuesday', departureTimes: ['07:00', '08:00', '09:00', '17:00', '18:00'] },
      { day: 'wednesday', departureTimes: ['07:00', '08:00', '09:00', '17:00', '18:00'] },
      { day: 'thursday', departureTimes: ['07:00', '08:00', '09:00', '17:00', '18:00'] },
      { day: 'friday', departureTimes: ['07:00', '08:00', '09:00', '17:00', '18:00'] }
    ],
    estimatedDuration: 45,
    fare: { adult: 2.50, student: 1.75, senior: 1.25, child: 1.00 },
    color: '#FF6B6B'
  },
  {
    routeNumber: '202',
    name: 'University Line',
    transportType: 'bus',
    stops: [
      { name: 'University Campus', location: { lat: 40.8075, lng: -73.9626 }, sequence: 1 },
      { name: 'Student Union', location: { lat: 40.8080, lng: -73.9630 }, sequence: 2 },
      { name: 'Science Building', location: { lat: 40.8090, lng: -73.9640 }, sequence: 3 },
      { name: 'Library', location: { lat: 40.8100, lng: -73.9650 }, sequence: 4 },
      { name: 'Sports Complex', location: { lat: 40.8110, lng: -73.9660 }, sequence: 5 }
    ],
    schedule: [
      { day: 'all', departureTimes: ['06:30', '07:30', '08:30', '09:30', '10:30', '16:30', '17:30', '18:30'] }
    ],
    estimatedDuration: 30,
    fare: { adult: 1.75, student: 1.25, senior: 1.00, child: 0.75 },
    color: '#4ECDC4'
  },
  {
    routeNumber: 'T1',
    name: 'Metro Red Line',
    transportType: 'metro',
    stops: [
      { name: 'North Terminal', location: { lat: 40.7500, lng: -73.9900 }, sequence: 1 },
      { name: 'Midtown', location: { lat: 40.7540, lng: -73.9840 }, sequence: 2 },
      { name: 'Times Square', location: { lat: 40.7580, lng: -73.9850 }, sequence: 3 },
      { name: 'Grand Central', location: { lat: 40.7520, lng: -73.9770 }, sequence: 4 },
      { name: 'South Terminal', location: { lat: 40.7460, lng: -73.9820 }, sequence: 5 }
    ],
    schedule: [
      { day: 'all', frequency: 10 }
    ],
    estimatedDuration: 25,
    fare: { adult: 3.00, student: 2.25, senior: 1.50, child: 1.25 },
    color: '#FF6B6B'
  },
  {
    routeNumber: 'B45',
    name: 'Airport Shuttle',
    transportType: 'bus',
    stops: [
      { name: 'City Center', location: { lat: 40.7589, lng: -73.9851 }, sequence: 1 },
      { name: 'Convention Center', location: { lat: 40.7600, lng: -73.9830 }, sequence: 2 },
      { name: 'Hotel District', location: { lat: 40.7620, lng: -73.9800 }, sequence: 3 },
      { name: 'International Airport', location: { lat: 40.7750, lng: -73.8721 }, sequence: 4 }
    ],
    schedule: [
      { day: 'all', departureTimes: ['05:00', '06:00', '07:00', '08:00', '09:00', '20:00', '21:00', '22:00'] }
    ],
    estimatedDuration: 60,
    fare: { adult: 10.00, student: 7.50, senior: 5.00, child: 5.00 },
    color: '#45B7D1'
  },
  {
    routeNumber: '300',
    name: 'Night Owl',
    transportType: 'bus',
    stops: [
      { name: 'Downtown', location: { lat: 40.7128, lng: -74.0060 }, sequence: 1 },
      { name: 'Entertainment District', location: { lat: 40.7570, lng: -73.9860 }, sequence: 2 },
      { name: 'Residential Area', location: { lat: 40.7850, lng: -73.9750 }, sequence: 3 },
      { name: 'University', location: { lat: 40.8075, lng: -73.9626 }, sequence: 4 }
    ],
    schedule: [
      { day: 'friday', departureTimes: ['23:00', '00:00', '01:00', '02:00', '03:00'] },
      { day: 'saturday', departureTimes: ['23:00', '00:00', '01:00', '02:00', '03:00'] }
    ],
    estimatedDuration: 50,
    fare: { adult: 3.50, student: 2.50, senior: 2.00, child: 2.00 },
    color: '#96CEB4'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    await Route.deleteMany({});
    console.log('Cleared existing routes...');

    const createdRoutes = await Route.insertMany(seedRoutes);
    console.log(`Created ${createdRoutes.length} routes...`);

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@transport.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      await User.create({
        email: adminEmail,
        password: adminPassword,
        firstName: process.env.ADMIN_FIRST_NAME || 'System',
        lastName: process.env.ADMIN_LAST_NAME || 'Administrator',
        role: 'admin'
      });
      console.log('Created admin user...');
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📋 Sample Routes Created:');
    createdRoutes.forEach(route => {
      console.log(`  - ${route.routeNumber}: ${route.name} (${route.transportType})`);
    });
    
    console.log(`\n👤 Admin Credentials:`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();