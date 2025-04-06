
const Sponsorship = require('../models/sponsorship.model');

// Create a new sponsorship
exports.createSponsorship = async (req, res) => {
  try {
    const newSponsorship = new Sponsorship(req.body);
    const savedSponsorship = await newSponsorship.save();
    res.status(201).json(savedSponsorship);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all sponsorships
exports.getAllSponsorships = async (req, res) => {
  try {
    const sponsorships = await Sponsorship.find().populate('childId', 'firstName lastName');
    res.status(200).json(sponsorships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific sponsorship by ID
exports.getSponsorshipById = async (req, res) => {
  try {
    const sponsorship = await Sponsorship.findById(req.params.id)
      .populate('childId', 'firstName lastName');
    if (!sponsorship) {
      return res.status(404).json({ message: 'Sponsorship not found' });
    }
    res.status(200).json(sponsorship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a sponsorship by ID
exports.updateSponsorship = async (req, res) => {
  try {
    const updatedSponsorship = await Sponsorship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('childId', 'firstName lastName');
    
    if (!updatedSponsorship) {
      return res.status(404).json({ message: 'Sponsorship not found' });
    }
    
    res.status(200).json(updatedSponsorship);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a sponsorship by ID
exports.deleteSponsorship = async (req, res) => {
  try {
    const deletedSponsorship = await Sponsorship.findByIdAndDelete(req.params.id);
    if (!deletedSponsorship) {
      return res.status(404).json({ message: 'Sponsorship not found' });
    }
    res.status(200).json({ message: 'Sponsorship deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
