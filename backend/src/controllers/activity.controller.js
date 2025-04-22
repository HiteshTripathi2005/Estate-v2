import Activity from "../models/activity.model.js";
import { User } from "../models/users.model.js";

// Log a new user activity
export const logActivity = async (req, res) => {
  try {
    const { userId, action, details, propertyId } = req.body;

    if (!userId || !action) {
      return res
        .status(400)
        .json({ message: "User ID and action are required" });
    }

    // Get IP address and user agent
    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];

    const activity = await Activity.create({
      user: userId,
      action,
      details: details || {},
      propertyId: propertyId || null,
      ipAddress,
      userAgent,
    });

    res.status(201).json({
      message: "Activity logged successfully",
      data: activity,
    });
  } catch (error) {
    console.error("Error logging activity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Track activity without API response (for internal use)
export const trackActivity = async (
  userId,
  action,
  details = {},
  propertyId = null,
  req = null
) => {
  try {
    let ipAddress = "";
    let userAgent = "";

    if (req) {
      ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      userAgent = req.headers["user-agent"];
    }

    await Activity.create({
      user: userId,
      action,
      details,
      propertyId,
      ipAddress,
      userAgent,
    });

    return true;
  } catch (error) {
    console.error("Error tracking activity:", error);
    return false;
  }
};

// Get all activities (admin only)
export const getAllActivities = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      action,
      userId,
      startDate,
      endDate,
    } = req.query;

    const query = {};

    // Apply filters if provided
    if (action) query.action = action;
    if (userId) query.user = userId;

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const activities = await Activity.find(query)
      .populate("user", "fullName email profilePic")
      .populate("propertyId", "title price propertyType")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalActivities = await Activity.countDocuments(query);

    res.status(200).json({
      message: "Activities fetched successfully",
      data: activities,
      pagination: {
        totalActivities,
        totalPages: Math.ceil(totalActivities / limit),
        currentPage: parseInt(page),
        perPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get user activity summary
export const getActivitySummary = async (req, res) => {
  try {
    // Get counts for each activity type in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activityCounts = await Activity.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: "$action", count: { $sum: 1 } } },
    ]);

    // Get total users
    const totalUsers = await User.countDocuments();

    // Get active users in last 30 days
    const activeUsers = await Activity.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: "$user" } },
      { $count: "count" },
    ]);

    // Get recent activity
    const recentActivity = await Activity.find()
      .populate("user", "fullName email")
      .sort({ createdAt: -1 })
      .limit(10);

    // Get activity by day for the last 30 days
    const activityByDay = await Activity.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      message: "Activity summary fetched successfully",
      data: {
        activityCounts: activityCounts.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        totalUsers,
        activeUsers: activeUsers[0]?.count || 0,
        recentActivity,
        activityByDay,
      },
    });
  } catch (error) {
    console.error("Error fetching activity summary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get activities for a specific user
export const getUserActivities = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { page = 1, limit = 20 } = req.query;

    const activities = await Activity.find({ user: userId })
      .populate("propertyId", "title price propertyType")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalActivities = await Activity.countDocuments({ user: userId });

    res.status(200).json({
      message: "User activities fetched successfully",
      data: activities,
      pagination: {
        totalActivities,
        totalPages: Math.ceil(totalActivities / limit),
        currentPage: parseInt(page),
        perPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching user activities:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
