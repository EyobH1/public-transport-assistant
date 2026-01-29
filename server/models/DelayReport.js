const mongoose = require('mongoose');

const delayReportSchema = new mongoose.Schema({
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: [true, 'Route ID is required']
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  delayMinutes: {
    type: Number,
    required: [true, 'Delay minutes is required'],
    min: 1,
    max: 180 
  },
  reason: {
    type: String,
    enum: [
      'traffic',
      'mechanical',
      'weather',
      'accident',
      'construction',
      'staff_shortage',
      'other'
    ],
    required: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  location: {
    lat: Number,
    lng: Number
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  downvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['pending', 'verified', 'resolved', 'false_report'],
    default: 'pending'
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date,
  resolvedAt: Date,
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  affectedDirection: {
    type: String,
    enum: ['both', 'inbound', 'outbound']
  },
  expectedResolutionTime: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

delayReportSchema.virtual('confidenceScore').get(function() {
  return this.upvotes.length - this.downvotes.length;
});

delayReportSchema.methods.getReportInfo = function() {
  return {
    id: this._id,
    routeId: this.routeId,
    delayMinutes: this.delayMinutes,
    reason: this.reason,
    description: this.description,
    status: this.status,
    severity: this.severity,
    confidenceScore: this.confidenceScore,
    createdAt: this.createdAt,
    upvoteCount: this.upvotes.length,
    downvoteCount: this.downvotes.length
  };
};

delayReportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  if (this.isModified('delayMinutes')) {
    if (this.delayMinutes <= 10) this.severity = 'low';
    else if (this.delayMinutes <= 30) this.severity = 'medium';
    else if (this.delayMinutes <= 60) this.severity = 'high';
    else this.severity = 'critical';
  }
  
  next();
});

const DelayReport = mongoose.model('DelayReport', delayReportSchema);

module.exports = DelayReport;