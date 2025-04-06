const express = require("express");
const router = express.Router();
const donationController = require("../controllers/donation.controller");
const sponsorshipController = require("../controllers/sponsorship.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Apply auth middleware to all routes
router.use(authMiddleware.verifyToken);

// CRUD routes for donations
router.post("/monetary", donationController.createDonation);
router.get("/monetary", donationController.getAllDonations);
router.get("/monetary/:id", donationController.getDonationById);
router.put("/monetary/:id", donationController.updateDonation);
router.delete("/monetary/:id", donationController.deleteDonation);

// CRUD routes for sponsorships
router.post("/sponsorship", sponsorshipController.createSponsorship);
router.get("/sponsorship", sponsorshipController.getAllSponsorships);
router.get("/sponsorship/:id", sponsorshipController.getSponsorshipById);
router.put("/sponsorship/:id", sponsorshipController.updateSponsorship);
router.delete("/sponsorship/:id", sponsorshipController.deleteSponsorship);

module.exports = router;
