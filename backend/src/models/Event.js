import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Technical", "Cultural", "Sports", "Workshop", "Seminar"],
    },

    location: {
      type: String,
      required: [true, "Location is required"],
    },

    date: {
      type: Date,
      required: [true, "Date is required"],
    },

    time: {
      type: String,
      required: [true, "Time is required"],
      default: "00:00",
    },

    image: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Event", eventSchema);