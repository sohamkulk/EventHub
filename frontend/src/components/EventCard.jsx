import { Link } from "react-router-dom";

function EventCard({ event }) {
  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Event image */}
      <div className="relative h-48 bg-gray-200">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1E3A5F] to-[#2A4F7F] flex items-center justify-center">
            <span className="text-white text-4xl font-bold opacity-30">
              {event.title.charAt(0)}
            </span>
          </div>
        )}

        {/* Category badge */}
        <span className="absolute top-3 left-3 bg-[#F59E0B] text-[#1E3A5F] text-xs font-bold px-2 py-1 rounded-full">
          {event.category}
        </span>

        {/* Sold out badge */}
        {event.availableSeats === 0 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Sold Out
          </span>
        )}
      </div>

      {/* Event details */}
      <div className="p-5">
        <h3 className="text-[#1E3A5F] font-bold text-lg mb-1 line-clamp-1">
          {event.title}
        </h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-1 mb-4">
          <p className="text-gray-600 text-sm">
            {eventDate.toDateString()} at {event.time}
          </p>
          <p className="text-gray-600 text-sm">
            {event.venue}, {event.city}
          </p>
          <p className="text-gray-500 text-sm">
            {event.availableSeats} seats left
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#1E3A5F] font-bold text-lg">
            {event.price === 0 ? "Free" : `Rs. ${event.price}`}
          </span>
          <Link
            to={`/events/${event._id}`}
            className="bg-[#1E3A5F] hover:bg-[#162D4A] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventCard;

