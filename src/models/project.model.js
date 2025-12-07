import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    start_date: {
      type: Date,
    },

    end_date: {
      type: Date,
    },

    students: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      validate: [
        {
          validator: function (value) {
            return value.length <= 2;
          },
          message: "A project can have a maximum of 2 students.",
        },
      ],
      required: true, // At least 1 student required
    },

    company_supervisor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    university_supervisor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.model("Project", ProjectSchema);
