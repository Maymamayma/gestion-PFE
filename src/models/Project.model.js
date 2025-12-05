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
          ref: "Student", //hethi model ta3 user we ll do it later
        },
      ],
      validate: [
        {
          validator: function (value) {
            return value.length <= 2; // max 2 students
          },
          message: "Un projet peut avoir au maximum 2 étudiants.",
        },
      ],
      required: true, // atleast 1
    },
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.model("Project", ProjectSchema);