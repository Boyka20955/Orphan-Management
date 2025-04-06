
const HealthRecord = require('../models/healthRecord.model');

// Create a new health record
exports.createHealthRecord = async (req, res) => {
  try {
    const newHealthRecord = new HealthRecord(req.body);
    const savedHealthRecord = await newHealthRecord.save();
    res.status(201).json(savedHealthRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all health records
exports.getAllHealthRecords = async (req, res) => {
  try {
    const healthRecords = await HealthRecord.find().populate('childId', 'firstName lastName');
    res.status(200).json(healthRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get health records by child ID
exports.getHealthRecordsByChild = async (req, res) => {
  try {
    const healthRecords = await HealthRecord.find({ childId: req.params.childId })
      .populate('childId', 'firstName lastName');
    res.status(200).json(healthRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific health record by ID
exports.getHealthRecordById = async (req, res) => {
  try {
    const healthRecord = await HealthRecord.findById(req.params.id)
      .populate('childId', 'firstName lastName');
    if (!healthRecord) {
      return res.status(404).json({ message: 'Health record not found' });
    }
    res.status(200).json(healthRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a health record by ID
exports.updateHealthRecord = async (req, res) => {
  try {
    const updatedHealthRecord = await HealthRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('childId', 'firstName lastName');
    
    if (!updatedHealthRecord) {
      return res.status(404).json({ message: 'Health record not found' });
    }
    
    res.status(200).json(updatedHealthRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a health record by ID
exports.deleteHealthRecord = async (req, res) => {
  try {
    const deletedHealthRecord = await HealthRecord.findByIdAndDelete(req.params.id);
    if (!deletedHealthRecord) {
      return res.status(404).json({ message: 'Health record not found' });
    }
    res.status(200).json({ message: 'Health record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
