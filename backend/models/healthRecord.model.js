
const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['checkup', 'vaccination', 'illness', 'treatment']
  },
  description: {
    type: String,
    required: true
  },
  doctor: {
    type: String,
    required: true
  },
  hospital: {
    type: String
  },
  disease: {
    type: String
  },
  treatment: {
    type: String
  },
  cost: {
    type: Number
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  debt: {
    type: Number
  },
  notes: {
    type: String
  },
  pendingMedicines: {
    type: [String]
  },
  paymentReceipt: {
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

healthRecordSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);

module.exports = HealthRecord;
