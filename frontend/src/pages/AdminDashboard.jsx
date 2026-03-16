import { useEffect, useState } from "react";
import API from "../services/api";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel to save time
        const [usersRes, eventsRes, bookingsRes] = await Promise.all([
          API.get("/users"),
          API.get("/events"),
          API.get("/bookings"),
        ]);
        setUsers(usersRes.data);
        setEvents(eventsRes.data);
        setBookings(bookingsRes.data);
      } catch (err) {
        console.log("Admin data fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await API.delete(`/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await API.delete(`/events/${id}`);
      setEvents(events.filter((e) => e._id !== id));
    } catch (err) {
      alert("Failed to delete event.");
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading admin data...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-[#1E3A5F] mb-8">Admin Dashboard</h1>

      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-[#1E3A5F] text-white rounded-xl p-6">
          <p className="text-3xl font-bold">{users.length}</p>
          <p className="text-gray-300 text-sm mt-1">Total Users</p>
        </div>
        <div className="bg-[#2A4F7F] text-white rounded-xl p-6">
          <p className="text-3xl font-bold">{events.length}</p>
          <p className="text-gray-300 text-sm mt-1">Total Events</p>
        </div>
        <div className="bg-[#F59E0B] rounded-xl p-6">
          <p className="text-3xl font-bold text-[#1E3A5F]">{bookings.length}</p>
          <p className="text-[#1E3A5F] text-sm mt-1 opacity-70">Total Bookings</p>
        </div>
      </div>

      {/* Tab buttons */}
      <div className="flex gap-2 mb-6">
        {["users", "events", "bookings"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg font-semibold capitalize text-sm transition-colors ${
              activeTab === tab
                ? "bg-[#1E3A5F] text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Users tab */}
      {activeTab === "users" && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F8FAFC] text-gray-600 border-b">
              <tr>
                <th className="text-left px-6 py-3">Name</th>
                <th className="text-left px-6 py-3">Email</th>
                <th className="text-left px-6 py-3">Role</th>
                <th className="text-left px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-[#1E3A5F]">{user.name}</td>
                  <td className="px-6 py-4 text-gray-500">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-600"
                        : user.role === "organizer"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.role !== "admin" && (
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-500 hover:underline text-xs font-semibold"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Events tab */}
      {activeTab === "events" && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F8FAFC] text-gray-600 border-b">
              <tr>
                <th className="text-left px-6 py-3">Title</th>
                <th className="text-left px-6 py-3">Date</th>
                <th className="text-left px-6 py-3">City</th>
                <th className="text-left px-6 py-3">Seats</th>
                <th className="text-left px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-[#1E3A5F]">{event.title}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(event.date).toDateString()}</td>
                  <td className="px-6 py-4 text-gray-500">{event.city}</td>
                  <td className="px-6 py-4 text-gray-500">{event.availableSeats}/{event.totalSeats}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="text-red-500 hover:underline text-xs font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bookings tab */}
      {activeTab === "bookings" && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F8FAFC] text-gray-600 border-b">
              <tr>
                <th className="text-left px-6 py-3">User</th>
                <th className="text-left px-6 py-3">Event</th>
                <th className="text-left px-6 py-3">Qty</th>
                <th className="text-left px-6 py-3">Total</th>
                <th className="text-left px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-[#1E3A5F]">{booking.user?.name}</td>
                  <td className="px-6 py-4 text-gray-500">{booking.event?.title}</td>
                  <td className="px-6 py-4 text-gray-500">{booking.quantity}</td>
                  <td className="px-6 py-4 text-gray-500">Rs. {booking.totalPrice}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-500"
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

