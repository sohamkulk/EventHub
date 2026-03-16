import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyEvents, deleteEvent } from "../redux/slices/eventSlice";

function OrganizerDashboard() {
  const dispatch = useDispatch();
  const { myEvents, loading } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMyEvents());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Delete this event? This cannot be undone.")) {
      dispatch(deleteEvent(id));
    }
  };

  // Quick stats calculated from the events list
  const totalEvents = myEvents.length;
  const totalSeats = myEvents.reduce((sum, e) => sum + e.totalSeats, 0);
  const bookedSeats = myEvents.reduce(
    (sum, e) => sum + (e.totalSeats - e.availableSeats),
    0
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1E3A5F]">My Events</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>
        </div>
        <Link
          to="/organizer/create"
          className="bg-[#F59E0B] hover:bg-[#D97706] text-[#1E3A5F] font-bold px-6 py-3 rounded-lg transition-colors"
        >
          Create New Event
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="Total Events" value={totalEvents} color="bg-[#1E3A5F]" />
        <StatCard label="Total Seats" value={totalSeats} color="bg-[#2A4F7F]" />
        <StatCard label="Seats Booked" value={bookedSeats} color="bg-[#F59E0B] text-[#1E3A5F]" textColor="text-[#1E3A5F]" />
      </div>

      {/* Events list */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading your events...</div>
      ) : myEvents.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-4">You haven't created any events yet.</p>
          <Link
            to="/organizer/create"
            className="bg-[#1E3A5F] text-white font-bold px-6 py-3 rounded-lg hover:bg-[#162D4A] transition-colors"
          >
            Create Your First Event
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {myEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row justify-between gap-4"
            >
              <div className="flex gap-4">
                {/* Event image thumbnail */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-[#1E3A5F] to-[#2A4F7F] flex-shrink-0">
                  {event.image && (
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  )}
                </div>

                <div>
                  <h3 className="text-[#1E3A5F] font-bold text-lg">{event.title}</h3>
                  <p className="text-gray-500 text-sm">
                    {new Date(event.date).toDateString()} at {event.time}
                  </p>
                  <p className="text-gray-500 text-sm">{event.venue}, {event.city}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="text-gray-600">
                      Booked: <strong>{event.totalSeats - event.availableSeats}</strong>
                    </span>
                    <span className="text-gray-600">
                      Available: <strong className="text-green-600">{event.availableSeats}</strong>
                    </span>
                    <span className="text-gray-600">
                      Price: <strong>Rs. {event.price}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <Link
                  to={`/events/${event._id}`}
                  className="text-[#1E3A5F] border border-[#1E3A5F] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1E3A5F] hover:text-white transition-colors"
                >
                  View
                </Link>
                <Link
                  to={`/organizer/edit/${event._id}`}
                  className="bg-[#1E3A5F] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#162D4A] transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="text-red-500 border border-red-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Simple stat card component used in the dashboard
function StatCard({ label, value, color, textColor }) {
  return (
    <div className={`${color} rounded-xl p-6 text-white`}>
      <p className={`text-3xl font-extrabold ${textColor || "text-white"}`}>{value}</p>
      <p className={`text-sm mt-1 ${textColor ? "text-[#1E3A5F] opacity-70" : "text-gray-300"}`}>{label}</p>
    </div>
  );
}

export default OrganizerDashboard;

