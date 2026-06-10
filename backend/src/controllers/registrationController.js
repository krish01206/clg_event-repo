import Registration from "../models/Registration.js";
import Event from "../models/Event.js";

export const registerForEvent =
  async (req, res) => {
    try {
      const userId =
        req.user.id;

      const eventId =
        req.params.eventId;

      const event =
        await Event.findById(
          eventId
        );

      if (!event) {
        return res.status(404).json({
          message:
            "Event not found",
        });
      }

      const alreadyRegistered =
        await Registration.findOne({
          user: userId,
          event: eventId,
        });

      if (alreadyRegistered) {
        return res.status(400).json({
          message:
            "Already registered",
        });
      }

      const registration =
        await Registration.create({
          user: userId,
          event: eventId,
        });

      res.status(201).json({
        message:
          "Registration successful",
        registration,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

export const getMyEvents =
  async (req, res) => {
    try {
      const registrations =
        await Registration.find({
          user: req.user.id,
        }).populate("event");

      res.json(registrations);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

export const getParticipants =
  async (req, res) => {
    try {
      const registrations =
        await Registration.find({
          event:
            req.params.eventId,
        })
          .populate(
            "user",
            "name email"
          )
          .populate(
            "event",
            "title"
          );

      res.json(registrations);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };