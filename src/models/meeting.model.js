import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "Daily",
        "Planning",
        "Review",
        "Retrospective",
        "Sprint Review",
        "Other",
      ],
      default: "Other",
    },

    date: {
      type: Date,
      required: true,
    },

    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],

    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Meeting = mongoose.model("Meeting", meetingSchema);
