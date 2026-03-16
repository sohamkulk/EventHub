import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../redux/slices/eventSlice";
import EventCard from "../components/EventCard";

function Home() {
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // Show only the first 6 events on the homepage
  const featuredEvents = events.slice(0, 6);

  return (
    <div>
      {/* Hero section */}
      <section className="bg-gradient-to-br from-[#1E3A5F] to-[#162D4A] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Discover Events That{" "}
            <span className="text-[#F59E0B]">Inspire You</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Find and book the best events in your city — music, tech, food,
            sports and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/events"
              className="bg-[#F59E0B] hover:bg-[#D97706] text-[#1E3A5F] font-bold px-8 py-3 rounded-lg transition-colors text-lg"
            >
              Browse Events
            </Link>
            <Link
              to="/register"
              className="border-2 border-white text-white hover:bg-white hover:text-[#1E3A5F] font-bold px-8 py-3 rounded-lg transition-colors text-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-[#F59E0B] py-6">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-[#1E3A5F] text-2xl font-extrabold">{events.length}+</p>
            <p className="text-[#162D4A] text-sm font-medium">Live Events</p>
          </div>
          <div>
            <p className="text-[#1E3A5F] text-2xl font-extrabold">100%</p>
            <p className="text-[#162D4A] text-sm font-medium">Secure Booking</p>
          </div>
          <div>
            <p className="text-[#1E3A5F] text-2xl font-extrabold">24/7</p>
            <p className="text-[#162D4A] text-sm font-medium">Support</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-[#1E3A5F] mb-6">Browse by Category</h2>
        <div className="flex flex-wrap gap-3">
          {["Music", "Sports", "Tech", "Food", "Art", "Business", "Other"].map(
            (cat) => (
              <Link
                key={cat}
                to={`/events?category=${cat}`}
                className="bg-white border-2 border-[#1E3A5F] text-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white px-5 py-2 rounded-full font-semibold transition-colors"
              >
                {cat}
              </Link>
            )
          )}
        </div>
      </section>

      {/* Featured events */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1E3A5F]">Upcoming Events</h2>
          <Link
            to="/events"
            className="text-[#F59E0B] font-semibold hover:underline"
          >
            See all
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading events...</div>
        ) : featuredEvents.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No events available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;

