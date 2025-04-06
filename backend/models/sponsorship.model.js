
const mongoose = require('mongoose');

const sponsorshipSchema = new mongoose.Schema({
  donorType: {
    type: String,
    enum: ['person', 'organization'],
    required: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  organizationName: {
    type: String,
    trim: true
  },
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  frequency: {
    type: String,
    required: true,
    enum: ['monthly', 'quarterly', 'annually']
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'ended'],
    default: 'active'
  },
  notes: {
    type: String
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

sponsorshipSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Sponsorship = mongoose.model('Sponsorship', sponsorshipSchema);

module.exports = Sponsorship;
