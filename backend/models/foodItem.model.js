
const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['grain', 'protein', 'dairy', 'vegetable', 'fruit', 'other']
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true
  },
  expiryDate: {
    type: String,
    required: true
  },
  dateReceived: {
    type: String,
    required: true
  },
  supplier: {
    type: String
  },
  status: {
    type: String,
    enum: ['normal', 'lowStock', 'nearExpiry'],
    default: 'normal'
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

foodItemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const FoodItem = mongoose.model('FoodItem', foodItemSchema);

module.exports = FoodItem;
