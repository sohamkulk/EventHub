import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

// Fetch all events with optional filters
export const fetchEvents = createAsyncThunk(
  "events/fetchAll",
  async (params, thunkAPI) => {
    try {
      const res = await API.get("/events", { params });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch events"
      );
    }
  }
);

// Fetch a single event by ID
export const fetchEventById = createAsyncThunk(
  "events/fetchById",
  async (id, thunkAPI) => {
    try {
      const res = await API.get(`/events/${id}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch event"
      );
    }
  }
);

// Fetch events created by the logged-in organizer
export const fetchMyEvents = createAsyncThunk(
  "events/fetchMyEvents",
  async (_, thunkAPI) => {
    try {
      const res = await API.get("/events/organizer/my-events");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch your events"
      );
    }
  }
);

// Create a new event (uses FormData because of image upload)
export const createEvent = createAsyncThunk(
  "events/create",
  async (formData, thunkAPI) => {
    try {
      const res = await API.post("/events", formData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create event"
      );
    }
  }
);

// Update an existing event
export const updateEvent = createAsyncThunk(
  "events/update",
  async ({ id, formData }, thunkAPI) => {
    try {
      const res = await API.put(`/events/${id}`, formData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update event"
      );
    }
  }
);

// Delete an event
export const deleteEvent = createAsyncThunk(
  "events/delete",
  async (id, thunkAPI) => {
    try {
      await API.delete(`/events/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete event"
      );
    }
  }
);

const eventSlice = createSlice({
  name: "events",
  initialState: {
    events: [],
    myEvents: [],
    selectedEvent: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => { state.loading = true; })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEventById.pending, (state) => { state.loading = true; })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyEvents.fulfilled, (state, action) => {
        state.myEvents = action.payload;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.myEvents.unshift(action.payload);
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.myEvents.findIndex(e => e._id === action.payload._id);
        if (index !== -1) state.myEvents[index] = action.payload;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.myEvents = state.myEvents.filter(e => e._id !== action.payload);
      });
  },
});

export const { clearSelectedEvent } = eventSlice.actions;
export default eventSlice.reducer;

