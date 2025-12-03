import mongoose from "mongoose";

const SprintSchema = new mongoose.Schema(
  {
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    number: {
      type: Number,
      required: true,
    },

    goals: {
      type: String,
      default: "",
    },

    start_date: {
      type: Date,
    },

    end_date: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["planned", "active", "completed"],
      default: "planned",
    },
  },
  {
    timestamps: true,
  }
);

export const Sprint = mongoose.model("Sprint", SprintSchema);
