import { Link } from "react-router-dom";

function BookingConfirmation() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        {/* Success circle */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-[#1E3A5F] mb-3">
          Booking Confirmed!
        </h1>
        <p className="text-gray-500 mb-2">
          Your tickets have been booked successfully.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          A confirmation email has been sent to your inbox.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/dashboard"
            className="bg-[#1E3A5F] hover:bg-[#162D4A] text-white font-bold py-3 rounded-lg transition-colors"
          >
            View My Bookings
          </Link>
          <Link
            to="/events"
            className="border-2 border-[#1E3A5F] text-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white font-bold py-3 rounded-lg transition-colors"
          >
            Browse More Events
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmation;

