import Event from "../models/Event.js";
import Registration from "../models/Registration.js";

export const createEvent = async (
  req,
  res
) => {
  try {
    const {
      title,
      description,
      category,
      location,
      date,
      image,
    } = req.body;

    const event =
      await Event.create({
        title,
        description,
        category,
        location,
        date,
        image,
        createdBy: req.user.id,
      });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getEvents = async (
  req,
  res
) => {
  try {
    const events =
      await Event.find().sort({
        createdAt: -1,
      });

    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getEventById =
  async (req, res) => {
    try {
      const event =
        await Event.findById(
          req.params.id
        );

      if (!event) {
        return res.status(404).json({
          message:
            "Event not found",
        });
      }

      const count =
        await Registration.countDocuments(
          {
            event: event._id,
          }
        );

      res.json({
        event,
        registrationCount:
          count,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

export const updateEvent = async (
  req,
  res
) => {
  try {
    const event =
      await Event.findById(
        req.params.id
      );

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    Object.assign(
      event,
      req.body
    );

    const updated =
      await event.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteEvent = async (
  req,
  res
) => {
  try {
    const event =
      await Event.findById(
        req.params.id
      );

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    await event.deleteOne();

    res.json({
      message:
        "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};