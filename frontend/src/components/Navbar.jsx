import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Decide which dashboard link to show based on user role
  const getDashboardLink = () => {
    if (!user) return null;
    if (user.role === "admin") return { path: "/admin", label: "Admin Panel" };
    if (user.role === "organizer") return { path: "/organizer", label: "My Events" };
    return { path: "/dashboard", label: "My Bookings" };
  };

  const dashboardLink = getDashboardLink();

  return (
    <nav className="bg-[#1E3A5F] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-[#F59E0B] text-2xl font-extrabold tracking-tight">
              EventHub
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/events"
              className="text-gray-200 hover:text-[#F59E0B] font-medium transition-colors"
            >
              Browse Events
            </Link>

            {user ? (
              <>
                {dashboardLink && (
                  <Link
                    to={dashboardLink.path}
                    className="text-gray-200 hover:text-[#F59E0B] font-medium transition-colors"
                  >
                    {dashboardLink.label}
                  </Link>
                )}
                <span className="text-gray-400 text-sm">
                  Hi, {user.name.split(" ")[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-[#F59E0B] hover:bg-[#D97706] text-[#1E3A5F] font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-200 hover:text-[#F59E0B] font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[#F59E0B] hover:bg-[#D97706] text-[#1E3A5F] font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-200 focus:outline-none"
          >
            <div className="space-y-1">
              <span className="block w-6 h-0.5 bg-gray-200"></span>
              <span className="block w-6 h-0.5 bg-gray-200"></span>
              <span className="block w-6 h-0.5 bg-gray-200"></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#162D4A] px-4 pb-4 space-y-3">
          <Link
            to="/events"
            onClick={() => setMenuOpen(false)}
            className="block text-gray-200 hover:text-[#F59E0B] py-2"
          >
            Browse Events
          </Link>
          {user ? (
            <>
              {dashboardLink && (
                <Link
                  to={dashboardLink.path}
                  onClick={() => setMenuOpen(false)}
                  className="block text-gray-200 hover:text-[#F59E0B] py-2"
                >
                  {dashboardLink.label}
                </Link>
              )}
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="block text-[#F59E0B] py-2 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-gray-200 py-2">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block text-[#F59E0B] py-2 font-semibold">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;

