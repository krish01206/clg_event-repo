import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/roleMiddleware.js";
import {
  registerForEvent,
  getMyEvents,
  getParticipants,
} from "../controllers/registrationController.js";

const router = express.Router();

// IMPORTANT: /my-events MUST come before /:eventId to avoid route conflict
router.get("/my-events", protect, getMyEvents);

router.get("/participants/:eventId", protect, adminOnly, getParticipants);

router.post("/:eventId", protect, registerForEvent);

export default router;