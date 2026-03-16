const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getEventBookings,
  cancelBooking,
  getAllBookings,
} = require("../controllers/bookingController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Attendee routes
router.post("/", protect, authorize("attendee"), createBooking);
router.get("/my", protect, getMyBookings);
router.put("/:id/cancel", protect, cancelBooking);

// Organizer route - see bookings for their event
router.get("/event/:eventId", protect, authorize("organizer", "admin"), getEventBookings);

// Admin route - see all bookings
router.get("/", protect, authorize("admin"), getAllBookings);

module.exports = router;

