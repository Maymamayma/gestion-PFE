const mongoose = require("mongoose");

const ValidationSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  isValid: {
    type: Boolean,
    required: true,
  },
  comment: {
    type: String,
  },
  validatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  validatedAt: {
    type: Date,
    default: Date.now,
  },
  // typeValidation left if you later want Reunion vs Task, but for team C keep Tache
  typeValidation: {
    type: String,
    enum: ["Tache"],
    default: "Tache",
  },
});

module.exports = mongoose.model("Validation", ValidationSchema);
