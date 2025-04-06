const express = require("express");
const router = express.Router();
const healthRecordController = require("../controllers/healthRecord.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Apply auth middleware to all routes
router.use(authMiddleware.verifyToken);

// CRUD routes for health records
router.post("/", healthRecordController.createHealthRecord);
router.get("/", healthRecordController.getAllHealthRecords);
router.get("/child/:childId", healthRecordController.getHealthRecordsByChild);
router.get("/:id", healthRecordController.getHealthRecordById);
router.put("/:id", healthRecordController.updateHealthRecord);
router.delete("/:id", healthRecordController.deleteHealthRecord);

module.exports = router;
