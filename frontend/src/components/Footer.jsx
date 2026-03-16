import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#1E3A5F] text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h2 className="text-[#F59E0B] text-xl font-bold mb-2">EventHub</h2>
            <p className="text-sm text-gray-400">
              Discover and book amazing events near you.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-[#F59E0B] transition-colors">Home</Link></li>
              <li><Link to="/events" className="hover:text-[#F59E0B] transition-colors">Browse Events</Link></li>
              <li><Link to="/register" className="hover:text-[#F59E0B] transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-3">Contact</h3>
            <p className="text-sm text-gray-400">support@EventHub.com</p>
          </div>
        </div>

        <div className="border-t border-[#2A4F7F] mt-8 pt-6 text-center text-sm text-gray-500">
          {new Date().getFullYear()} EventHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;

