import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventById } from "../redux/slices/eventSlice";
import { createBooking, resetBookingState } from "../redux/slices/bookingSlice";

function BookingPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedEvent: event, loading: eventLoading } = useSelector((state) => state.events);
  const { loading, error, success } = useSelector((state) => state.bookings);

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchEventById(id));
    dispatch(resetBookingState());
  }, [dispatch, id]);

  // Redirect to confirmation page once booking is done
  useEffect(() => {
    if (success) {
      navigate("/booking-confirmation");
    }
  }, [success, navigate]);

  if (eventLoading || !event) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }

  const totalPrice = event.price * quantity;

  const handleBooking = () => {
    dispatch(createBooking({ eventId: event._id, quantity }));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-[#1E3A5F] mb-8">Complete Your Booking</h1>

      {/* Event summary card */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-[#1E3A5F] mb-1">{event.title}</h2>
        <p className="text-gray-500 text-sm mb-4">
          {new Date(event.date).toDateString()} at {event.time} — {event.venue}, {event.city}
        </p>

        <div className="border-t pt-4">
          <p className="text-gray-600 text-sm mb-1">
            Available seats: <span className="font-semibold text-green-600">{event.availableSeats}</span>
          </p>
          <p className="text-gray-600 text-sm">
            Price per ticket: <span className="font-semibold text-[#1E3A5F]">
              {event.price === 0 ? "Free" : `Rs. ${event.price}`}
            </span>
          </p>
        </div>
      </div>

      {/* Quantity selector */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Number of Tickets
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-[#1E3A5F] font-bold text-lg transition-colors"
          >
            -
          </button>
          <span className="text-2xl font-bold text-[#1E3A5F] w-8 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(event.availableSeats, q + 1))}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-[#1E3A5F] font-bold text-lg transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Price summary */}
      <div className="bg-[#1E3A5F] rounded-xl p-6 mb-6 text-white">
        <div className="flex justify-between mb-2">
          <span className="text-gray-300">
            {quantity} ticket{quantity > 1 ? "s" : ""} x Rs. {event.price}
          </span>
          <span>Rs. {totalPrice}</span>
        </div>
        <div className="border-t border-[#2A4F7F] pt-3 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-[#F59E0B]">
            {event.price === 0 ? "Free" : `Rs. ${totalPrice}`}
          </span>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Confirm booking button (simulated payment) */}
      <button
        onClick={handleBooking}
        disabled={loading}
        className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-[#1E3A5F] font-bold py-4 rounded-xl text-lg transition-colors disabled:opacity-60"
      >
        {loading ? "Processing..." : "Confirm Booking"}
      </button>

      <p className="text-center text-gray-400 text-xs mt-3">
        A confirmation email will be sent after booking.
      </p>
    </div>
  );
}

export default BookingPage;

