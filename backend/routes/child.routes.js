const express = require("express");
const router = express.Router();
const childController = require("../controllers/child.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Apply auth middleware to all routes
router.use(authMiddleware.verifyToken);

// CRUD routes for children
router.post("/", childController.createChild);
router.get("/", childController.getAllChildren);
router.get("/:id", childController.getChildById);
router.put("/:id", childController.updateChild);
router.delete("/:id", childController.deleteChild);

module.exports = router;
