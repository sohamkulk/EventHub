import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-extrabold text-[#1E3A5F] mb-4">404</h1>
        <p className="text-2xl font-bold text-gray-600 mb-2">Page Not Found</p>
        <p className="text-gray-400 mb-8">
          The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="bg-[#F59E0B] hover:bg-[#D97706] text-[#1E3A5F] font-bold px-8 py-3 rounded-lg transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;

