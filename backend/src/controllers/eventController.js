import Event from "../models/Event.js";
import Registration from "../models/Registration.js";

export const createEvent = async (req, res) => {
  try {
    const { title, description, category, location, date, time, image } = req.body;

    if (!title || !description || !category || !location || !date || !time) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const event = await Event.create({
      title,
      description,
      category,
      location,
      date,
      time,
      image: image || "",
      createdBy: req.user.id,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const {
      search = "",
      category = "",
      sort = "latest",
      page = 1,
      limit = 6,
    } = req.query;

    // Build filter
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    // Build sort
    let sortOption = {};
    if (sort === "upcoming") {
      // upcoming: future events first by date ascending
      filter.date = { $gte: new Date() };
      sortOption = { date: 1 };
    } else if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    } else {
      // latest (default)
      sortOption = { createdAt: -1 };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Event.countDocuments(filter);
    const events = await Event.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.json({
      events,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("createdBy", "name");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const registrationCount = await Registration.countDocuments({ event: event._id });

    res.json({ event, registrationCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const { title, description, category, location, date, time, image } = req.body;

    if (title) event.title = title;
    if (description) event.description = description;
    if (category) event.category = category;
    if (location) event.location = location;
    if (date) event.date = date;
    if (time) event.time = time;
    if (image !== undefined) event.image = image;

    const updated = await event.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await event.deleteOne();

    // Also clean up registrations for this event
    await Registration.deleteMany({ event: req.params.id });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};