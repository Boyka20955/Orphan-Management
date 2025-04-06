
const ClothingItem = require('../models/clothingItem.model');

// Create a new clothing item
exports.createClothingItem = async (req, res) => {
  try {
    const newClothingItem = new ClothingItem(req.body);
    const savedClothingItem = await newClothingItem.save();
    res.status(201).json(savedClothingItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all clothing items
exports.getAllClothingItems = async (req, res) => {
  try {
    const clothingItems = await ClothingItem.find();
    res.status(200).json(clothingItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific clothing item by ID
exports.getClothingItemById = async (req, res) => {
  try {
    const clothingItem = await ClothingItem.findById(req.params.id);
    if (!clothingItem) {
      return res.status(404).json({ message: 'Clothing item not found' });
    }
    res.status(200).json(clothingItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a clothing item by ID
exports.updateClothingItem = async (req, res) => {
  try {
    const updatedClothingItem = await ClothingItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedClothingItem) {
      return res.status(404).json({ message: 'Clothing item not found' });
    }
    
    res.status(200).json(updatedClothingItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a clothing item by ID
exports.deleteClothingItem = async (req, res) => {
  try {
    const deletedClothingItem = await ClothingItem.findByIdAndDelete(req.params.id);
    if (!deletedClothingItem) {
      return res.status(404).json({ message: 'Clothing item not found' });
    }
    res.status(200).json({ message: 'Clothing item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
