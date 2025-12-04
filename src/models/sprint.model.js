import mongoose from "mongoose";

const SprintSchema = new mongoose.Schema(
  {
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project ID is required"],
    },

    number: {
      type: Number,
      required: [true, "Sprint number is required"],
      min: [1, "Sprint number must be at least 1"],
    },

    title: {
      type: String,
      required: [true, "Sprint name is required"],
      minlength: [3, "Sprint name must be at least 3 characters"],
      maxlength: [100, "Sprint name cannot exceed 100 characters"],
      trim: true,
    },

    start_date: {
      type: Date,
      required: [true, "Start date is required"],
    },

    end_date: {
      type: Date,
      required: [true, "End date is required"],
      validate: {
        validator: function (value) {
          return !this.start_date || value >= this.start_date;
        },
        message: "End date must be greater than or equal to start date",
      },
    },

    status: {
      type: String,
      enum: {
        values: ["planned", "active", "completed"],
        message: "Status must be planned, active, or completed",
      },
      default: "planned",
    },
  },
  {
    timestamps: true,
  }
);

// project_id + number must be unique
SprintSchema.index(
  { project_id: 1, number: 1 },
  {
    unique: true,
    message: "Sprint number must be unique within the same project",
  }
);

export const Sprint = mongoose.model("Sprint", SprintSchema);
