import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import EventsPage from "./pages/EventsPage";
import EventDetail from "./pages/EventDetail";
import BookingPage from "./pages/BookingPage";
import BookingConfirmation from "./pages/BookingConfirmation";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Attendee routes - must be logged in */}
            <Route
              path="/book/:id"
              element={<PrivateRoute roles={["attendee"]}><BookingPage /></PrivateRoute>}
            />
            <Route
              path="/booking-confirmation"
              element={<PrivateRoute roles={["attendee"]}><BookingConfirmation /></PrivateRoute>}
            />
            <Route
              path="/dashboard"
              element={<PrivateRoute roles={["attendee"]}><Dashboard /></PrivateRoute>}
            />

            {/* Organizer routes */}
            <Route
              path="/organizer"
              element={<PrivateRoute roles={["organizer"]}><OrganizerDashboard /></PrivateRoute>}
            />
            <Route
              path="/organizer/create"
              element={<PrivateRoute roles={["organizer"]}><CreateEvent /></PrivateRoute>}
            />
            <Route
              path="/organizer/edit/:id"
              element={<PrivateRoute roles={["organizer"]}><EditEvent /></PrivateRoute>}
            />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={<PrivateRoute roles={["admin"]}><AdminDashboard /></PrivateRoute>}
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

