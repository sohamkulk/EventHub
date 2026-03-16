const Event = require("../models/Event");

// Get all published events with optional search and filters
const getEvents = async (req, res) => {
  try {
    const { search, category, city, minPrice, maxPrice } = req.query;

    // Start with only published events
    let query = { isPublished: true };

    // If user typed something in search, look in title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) query.category = category;
    if (city) query.city = { $regex: city, $options: "i" };

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const events = await Event.find(query)
      .populate("organizer", "name email")
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single event by ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "organizer",
      "name email"
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new event (organizer only)
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      venue,
      city,
      date,
      time,
      price,
      totalSeats,
    } = req.body;

    // If an image was uploaded, use the cloudinary URL
    const image = req.file ? req.file.path : "";

    const event = await Event.create({
      title,
      description,
      image,
      category,
      venue,
      city,
      date,
      time,
      price,
      totalSeats,
      availableSeats: totalSeats,
      organizer: req.user._id,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an event (only the organizer who created it)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Make sure only the original organizer can edit
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not allowed to edit this event" });
    }

    // If a new image was uploaded, update it
    if (req.file) {
      req.body.image = req.file.path;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an event (organizer or admin)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Allow admin to delete any event, organizer can only delete their own
    if (
      req.user.role !== "admin" &&
      event.organizer.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this event" });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all events created by the logged-in organizer
const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
};

