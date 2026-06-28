import User from "../models/User.js";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalRegistrations = await Registration.countDocuments();
    const upcomingEvents = await Event.countDocuments({ date: { $gte: new Date() } });

    // Category breakdown via aggregation
    const categoryAgg = await Event.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const categoryBreakdown = {};
    categoryAgg.forEach(({ _id, count }) => {
      if (_id) categoryBreakdown[_id] = count;
    });

    res.json({
      totalEvents,
      totalStudents,
      totalRegistrations,
      upcomingEvents,
      categoryBreakdown,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
