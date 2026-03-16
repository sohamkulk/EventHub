import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../redux/slices/eventSlice";

const CATEGORIES = ["Music", "Sports", "Tech", "Food", "Art", "Business", "Other"];

function CreateEvent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.events);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Other",
    venue: "",
    city: "",
    date: "",
    time: "",
    price: "",
    totalSeats: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Show a preview of the selected image before uploading
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Use FormData to send both text fields and the image file together
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (imageFile) data.append("image", imageFile);

    const result = await dispatch(createEvent(data));
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/organizer");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-[#1E3A5F] mb-8">Create New Event</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-6">
        {/* Title */}
        <FormField label="Event Title">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder=""
            className="input-style"
          />
        </FormField>

        {/* Description */}
        <FormField label="Description">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            placeholder=""
            className="input-style resize-none"
          />
        </FormField>

        {/* Category */}
        <FormField label="Category">
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-style"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </FormField>

        {/* Venue and City side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Venue">
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              required
              placeholder=""
              className="input-style"
            />
          </FormField>
          <FormField label="City">
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder=""
              className="input-style"
            />
          </FormField>
        </div>

        {/* Date and Time side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Date">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="input-style"
            />
          </FormField>
          <FormField label="Time">
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="input-style"
            />
          </FormField>
        </div>

        {/* Price and Seats side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Ticket Price (Rs.) — Enter 0 for free">
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min={0}
              placeholder=""
              className="input-style"
            />
          </FormField>
          <FormField label="Total Seats">
            <input
              type="number"
              name="totalSeats"
              value={formData.totalSeats}
              onChange={handleChange}
              required
              min={1}
              placeholder=""
              className="input-style"
            />
          </FormField>
        </div>

        {/* Image upload */}
        <FormField label="Event Image (optional)">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#1E3A5F] file:text-white hover:file:bg-[#162D4A] cursor-pointer"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-3 h-40 w-full object-cover rounded-lg"
            />
          )}
        </FormField>

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#F59E0B] hover:bg-[#D97706] text-[#1E3A5F] font-bold py-3 rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/organizer")}
            className="flex-1 border-2 border-gray-300 text-gray-600 font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Tailwind doesn't support dynamic class names so we use inline style here */}
      <style>{`
        .input-style {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          padding: 0.625rem 1rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input-style:focus {
          ring: 2px solid #1E3A5F;
          border-color: #1E3A5F;
        }
      `}</style>
    </div>
  );
}

// Small wrapper to keep each field label and input together cleanly
function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

export default CreateEvent;

