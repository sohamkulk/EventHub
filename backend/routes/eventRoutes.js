const express = require("express");
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
} = require("../controllers/eventController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { upload } = require("../config/cloudinary");

// Public routes - anyone can view events
router.get("/", getEvents);
router.get("/:id", getEventById);

// Protected routes - must be logged in
router.get("/organizer/my-events", protect, authorize("organizer", "admin"), getMyEvents);

// Organizer routes - upload.single("image") handles the image file
router.post("/", protect, authorize("organizer", "admin"), upload.single("image"), createEvent);
router.put("/:id", protect, authorize("organizer", "admin"), upload.single("image"), updateEvent);
router.delete("/:id", protect, authorize("organizer", "admin", "admin"), deleteEvent);

module.exports = router;

