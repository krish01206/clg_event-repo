import express from "express";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/roleMiddleware.js";

import {
  registerForEvent,
  getMyEvents,
  getParticipants,
} from "../controllers/registrationController.js";

const router =
  express.Router();

router.post(
  "/:eventId",
  protect,
  registerForEvent
);

router.get(
  "/my-events",
  protect,
  getMyEvents
);

router.get(
  "/participants/:eventId",
  protect,
  adminOnly,
  getParticipants
);

export default router;