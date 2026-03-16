import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventById } from "../redux/slices/eventSlice";

function EventDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedEvent: event, loading } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchEventById(id));
  }, [dispatch, id]);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading event...</div>;
  }

  if (!event) {
    return <div className="text-center py-20 text-gray-500">Event not found.</div>;
  }

  const eventDate = new Date(event.date);
  const isSoldOut = event.availableSeats === 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="text-[#1E3A5F] font-medium mb-6 hover:text-[#F59E0B] transition-colors"
      >
        Back to Events
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Event image */}
        <div className="h-72 bg-gradient-to-br from-[#1E3A5F] to-[#2A4F7F]">
          {event.image && (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="p-8">
          {/* Category and title */}
          <span className="bg-[#F59E0B] text-[#1E3A5F] text-sm font-bold px-3 py-1 rounded-full">
            {event.category}
          </span>
          <h1 className="text-3xl font-extrabold text-[#1E3A5F] mt-3 mb-2">
            {event.title}
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            Organized by {event.organizer?.name}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left - details */}
            <div>
              <p className="text-gray-700 leading-relaxed mb-6">
                {event.description}
              </p>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="text-[#1E3A5F] font-semibold w-20">Date</span>
                  <span className="text-gray-600">{eventDate.toDateString()}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#1E3A5F] font-semibold w-20">Time</span>
                  <span className="text-gray-600">{event.time}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#1E3A5F] font-semibold w-20">Venue</span>
                  <span className="text-gray-600">{event.venue}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#1E3A5F] font-semibold w-20">City</span>
                  <span className="text-gray-600">{event.city}</span>
                </div>
              </div>
            </div>

            {/* Right - booking box */}
            <div className="bg-[#F8FAFC] border border-gray-200 rounded-xl p-6">
              <p className="text-3xl font-extrabold text-[#1E3A5F] mb-2">
                {event.price === 0 ? "Free" : `Rs. ${event.price}`}
                <span className="text-base font-normal text-gray-500"> / ticket</span>
              </p>

              <p className="text-gray-500 text-sm mb-6">
                {isSoldOut ? (
                  <span className="text-red-500 font-semibold">Sold Out</span>
                ) : (
                  <span className="text-green-600 font-semibold">
                    {event.availableSeats} seats available
                  </span>
                )}
              </p>

              {/* Show book button only to logged-in attendees */}
              {!user ? (
                <Link
                  to="/login"
                  className="block text-center bg-[#1E3A5F] text-white font-bold py-3 rounded-lg hover:bg-[#162D4A] transition-colors"
                >
                  Login to Book
                </Link>
              ) : user.role === "attendee" && !isSoldOut ? (
                <Link
                  to={`/book/${event._id}`}
                  className="block text-center bg-[#F59E0B] hover:bg-[#D97706] text-[#1E3A5F] font-bold py-3 rounded-lg transition-colors"
                >
                  Book Now
                </Link>
              ) : isSoldOut ? (
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 font-bold py-3 rounded-lg cursor-not-allowed"
                >
                  Sold Out
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetail;

