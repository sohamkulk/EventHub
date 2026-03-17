const Booking = require("../models/Booking");
const Event = require("../models/Event");
const nodemailer = require("nodemailer");

// Send a confirmation email after booking
const sendConfirmationEmail = async (userEmail, userName, event, quantity, totalPrice) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"EventHub" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Booking Confirmed - ${event.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1E3A5F; padding: 20px; text-align: center;">
            <h1 style="color: #F59E0B; margin: 0;">EventHub</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #1E3A5F;">Booking Confirmed!</h2>
            <p>Hi ${userName}, your booking is confirmed.</p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1E3A5F;">${event.title}</h3>
              <p><strong>Date:</strong> ${new Date(event.date).toDateString()}</p>
              <p><strong>Time:</strong> ${event.time}</p>
              <p><strong>Venue:</strong> ${event.venue}, ${event.city}</p>
              <p><strong>Tickets:</strong> ${quantity}</p>
              <p><strong>Total Paid:</strong> Rs. ${totalPrice}</p>
            </div>
            <p style="color: #666;">Thank you for booking with EventHub!</p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    // Email sending failure should not break the booking
    console.log("Email sending failed:", error.message);
  }
};

// Create a new booking
const createBooking = async (req, res) => {
  const { eventId, quantity } = req.body;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Make sure enough seats are available
    if (event.availableSeats < quantity) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    const totalPrice = event.price * quantity;

    // Create the booking record
    const booking = await Booking.create({
      user: req.user._id,
      event: eventId,
      quantity,
      totalPrice,
    });

    // Reduce available seats
    event.availableSeats -= quantity;
    await event.save();

    // Send confirmation email in the background
    sendConfirmationEmail(
      req.user.email,
      req.user.name,
      event,
      quantity,
      totalPrice
    );

    // Return the booking with event and user details filled in
    const populatedBooking = await Booking.findById(booking._id)
      .populate("event")
      .populate("user", "name email");

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings for the logged-in attendee
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("event")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings for a specific event (organizer view)
const getEventBookings = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Make sure only the event's organizer can see its bookings
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const bookings = await Booking.find({ event: req.params.eventId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel a booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only the person who booked can cancel
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Give back the seats to the event
    const event = await Event.findById(booking.event);
    if (event) {
      event.availableSeats += booking.quantity;
      await event.save();
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings (admin only)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("event", "title date")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getEventBookings,
  cancelBooking,
  getAllBookings,
};

