import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../redux/slices/eventSlice";
import EventCard from "../components/EventCard";

const CATEGORIES = ["All", "Music", "Sports", "Tech", "Food", "Art", "Business", "Other"];

function EventsPage() {
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.events);
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [city, setCity] = useState("");

  // Fetch events whenever filters change
  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (category && category !== "All") params.category = category;
    if (city) params.city = city;
    dispatch(fetchEvents(params));
  }, [dispatch, search, category, city]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#1E3A5F] mb-8">Browse Events</h1>

      {/* Search and filter bar */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search input */}
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
          />

          {/* City input */}
          <input
            type="text"
            placeholder="Filter by city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
          />

          {/* Category dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-gray-500 mb-6">
        {events.length} event{events.length !== 1 ? "s" : ""} found
      </p>

      {/* Events grid */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No events found.</p>
          <p className="text-gray-400 text-sm mt-2">Try a different search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

export default EventsPage;

