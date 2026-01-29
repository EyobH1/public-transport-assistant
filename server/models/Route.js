const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Stop name is required'],
    trim: true
  },
  location: {
    lat: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: -90,
      max: 90
    },
    lng: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: -180,
      max: 180
    }
  },
  address: String,
  sequence: {
    type: Number,
    required: true
  },
  estimatedArrivalTimes: [String], 
  isTerminal: {
    type: Boolean,
    default: false
  }
});

const scheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'all'],
    required: true
  },
  departureTimes: [{
    type: String,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ 
  }],
  frequency: {
    type: Number, 
    min: 5,
    max: 120
  },
  operational: {
    type: Boolean,
    default: true
  }
});

const routeSchema = new mongoose.Schema({
  routeNumber: {
    type: String,
    required: [true, 'Route number is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: [true, 'Route name is required'],
    trim: true
  },
  description: String,
  transportType: {
    type: String,
    enum: ['bus', 'train', 'metro', 'ferry'],
    required: true
  },
  stops: [stopSchema],
  schedule: [scheduleSchema],
  distance: Number, 
  estimatedDuration: Number, 
  fare: {
    adult: Number,
    student: Number,
    senior: Number,
    child: Number
  },
  operator: String,
  color: {
    type: String,
    default: '#2563eb',
    match: /^#[0-9A-F]{6}$/i
  },
  isActive: {
    type: Boolean,
    default: true
  },
  popularityScore: {
    type: Number,
    default: 0,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

routeSchema.methods.incrementPopularity = function() {
  this.popularityScore += 1;
  return this.save();
};

routeSchema.methods.getRouteInfo = function() {
  return {
    id: this._id,
    routeNumber: this.routeNumber,
    name: this.name,
    transportType: this.transportType,
    stops: this.stops.map(stop => ({
      name: stop.name,
      location: stop.location,
      sequence: stop.sequence
    })),
    schedule: this.schedule,
    fare: this.fare,
    estimatedDuration: this.estimatedDuration,
    isActive: this.isActive
  };
};

routeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Route = mongoose.model('Route', routeSchema);

module.exports = Route;