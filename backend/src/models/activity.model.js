import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "login",
        "register",
        "upload_property",
        "update_property",
        "delete_property",
        "add_to_watchlist",
        "remove_from_watchlist",
        "purchase_property",
        "view_property",
        "send_message",
        "other",
      ],
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      default: null,
    },
    ipAddress: {
      type: String,
      default: "",
    },
    userAgent: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create indexes for faster queries
activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ action: 1, createdAt: -1 });
activitySchema.index({ createdAt: -1 });

export default mongoose.model("Activity", activitySchema);
