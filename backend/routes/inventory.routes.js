const express = require("express");
const router = express.Router();
const foodItemController = require("../controllers/foodItem.controller");
const clothingItemController = require("../controllers/clothingItem.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Apply auth middleware to all routes
router.use(authMiddleware.verifyToken);

// CRUD routes for food items
router.post("/food", foodItemController.createFoodItem);
router.get("/food", foodItemController.getAllFoodItems);
router.get("/food/:id", foodItemController.getFoodItemById);
router.put("/food/:id", foodItemController.updateFoodItem);
router.delete("/food/:id", foodItemController.deleteFoodItem);

// CRUD routes for clothing items
router.post("/clothing", clothingItemController.createClothingItem);
router.get("/clothing", clothingItemController.getAllClothingItems);
router.get("/clothing/:id", clothingItemController.getClothingItemById);
router.put("/clothing/:id", clothingItemController.updateClothingItem);
router.delete("/clothing/:id", clothingItemController.deleteClothingItem);

module.exports = router;
