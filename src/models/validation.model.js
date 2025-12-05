import mongoose from "mongoose";

const ValidationSchema = new mongoose.Schema({
  // For task validation (optional - required only for Tache type)
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: false,
  },

  // For meeting content validation (optional - required only for ContenuReunion type)
  reunionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reunion",
    required: false,
  },

  estValide: {
    type: Boolean,
    required: true,
  },

  commentaire: {
    type: String,
    default: "",
  },

  validatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  dateValidation: {
    type: Date,
    default: Date.now,
  },

  typeValidation: {
    type: String,
    enum: ["Tache", "ContenuReunion"],
    required: true,
  },
});

// Add validation to ensure correct fields are provided based on type
ValidationSchema.pre("save", function (next) {
  if (this.typeValidation === "Tache" && !this.taskId) {
    return next(new Error("taskId is required for Tache validation"));
  }
  if (this.typeValidation === "ContenuReunion" && !this.reunionId) {
    return next(new Error("reunionId is required for ContenuReunion validation"));
  }
  next();
});

export const Validation = mongoose.model("Validation", ValidationSchema);


