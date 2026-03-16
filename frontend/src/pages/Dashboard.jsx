import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyBookings, cancelBooking } from "../redux/slices/bookingSlice";
import { Link } from "react-router-dom";

function Dashboard() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.bookings);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const handleCancel = (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      dispatch(cancelBooking(bookingId));
    }
  };

  // Split bookings into upcoming and past
  const now = new Date();
  const upcoming = bookings.filter(
    (b) => b.status === "confirmed" && new Date(b.event?.date) >= now
  );
  const past = bookings.filter(
    (b) => b.status === "cancelled" || new Date(b.event?.date) < now
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1E3A5F]">My Bookings</h1>
        <p className="text-gray-500 mt-1">Hello, {user?.name}. Here are your bookings.</p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading your bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-4">You have no bookings yet.</p>
          <Link
            to="/events"
            className="bg-[#F59E0B] hover:bg-[#D97706] text-[#1E3A5F] font-bold px-6 py-3 rounded-lg transition-colors"
          >
            Browse Events
          </Link>
        </div>
      ) : (
        <>
          {/* Upcoming bookings */}
          {upcoming.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-[#1E3A5F] mb-4">
                Upcoming ({upcoming.length})
              </h2>
              <div className="space-y-4">
                {upcoming.map((booking) => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    onCancel={handleCancel}
                    showCancel={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Past and cancelled bookings */}
          {past.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-400 mb-4">
                Past & Cancelled ({past.length})
              </h2>
              <div className="space-y-4">
                {past.map((booking) => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    onCancel={handleCancel}
                    showCancel={false}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// A single booking card shown in the dashboard
function BookingCard({ booking, onCancel, showCancel }) {
  const event = booking.event;
  if (!event) return null;

  const isCancelled = booking.status === "cancelled";

  return (
    <div className={`bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row justify-between gap-4 ${isCancelled ? "opacity-60" : ""}`}>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-[#1E3A5F] font-bold text-lg">{event.title}</h3>
          {isCancelled && (
            <span className="bg-red-100 text-red-500 text-xs font-semibold px-2 py-0.5 rounded-full">
              Cancelled
            </span>
          )}
        </div>
        <p className="text-gray-500 text-sm">
          {new Date(event.date).toDateString()} at {event.time}
        </p>
        <p className="text-gray-500 text-sm">{event.venue}, {event.city}</p>
        <p className="text-gray-600 text-sm mt-2">
          Tickets: <span className="font-semibold">{booking.quantity}</span> &nbsp;|&nbsp;
          Total: <span className="font-semibold text-[#1E3A5F]">
            {booking.totalPrice === 0 ? "Free" : `Rs. ${booking.totalPrice}`}
          </span>
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to={`/events/${event._id}`}
          className="text-[#1E3A5F] border border-[#1E3A5F] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1E3A5F] hover:text-white transition-colors"
        >
          View Event
        </Link>
        {showCancel && !isCancelled && (
          <button
            onClick={() => onCancel(booking._id)}
            className="text-red-500 border border-red-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

