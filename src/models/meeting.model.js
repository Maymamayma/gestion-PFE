import mongoose from "mongoose";

const reunionSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    datePlanification: {
      type: Date,
      required: true,
    },

    ordreDuJour: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 2000,
    },

    meeting_URL: {
      type: String,
      default: "",
      maxlength: 2048,
    },

    compteRendu: {
      type: String,
      maxlength: 5000,
      default: "",
    },

    statut: {
      type: String,
      enum: ["Planifiee", "Effectuee", "Annulee"],
      default: "Planifiee",
    },

    // Team D enhancement: reference to UserStory, Task, or Report
    referenceType: {
      type: String,
      enum: ["UserStory", "Task", "Report", null],
      default: null,
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "referenceType",
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    dateCreation: {
      type: Date,
      default: Date.now,
    },

    validation: {
      estValide: {
        type: Boolean,
        default: null,
      },
      commentaire: {
        type: String,
        default: "",
      },
      validePar: {
        type: String,
        default: "",
      },
      dateValidation: {
        type: Date,
        default: null,
      },
    },
  },
  { timestamps: true }
);

export const Reunion = mongoose.model("Reunion", reunionSchema);
// Keep Meeting export for backward compatibility
export const Meeting = Reunion;

