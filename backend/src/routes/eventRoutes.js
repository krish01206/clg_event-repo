import express from "express";

import protect from "../middleware/authMiddleware.js";

import adminOnly from "../middleware/roleMiddleware.js";

import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

const router = express.Router();

router.get("/", getEvents);

router.get(
  "/:id",
  getEventById
);

router.post(
  "/",
  protect,
  adminOnly,
  createEvent
);

router.put(
  "/:id",
  protect,
  adminOnly,
  updateEvent
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteEvent
);

export default router;